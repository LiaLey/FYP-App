import cv2
from matplotlib.pyplot import hist
import numpy as np
import math
import copy

hist_size = 128    # how many bins for each R,G,B histogram
#min_shot_duration = 25    # if a shot has length less than this, merge it with others
absolute_threshold = 1.0 
#factor = 4   

def read_video(video_file):

    frames = []
    hist_arr = []
    video = cv2.VideoCapture(video_file)
    # frame_count = video.get(cv2.CAP_PROP_FRAME_COUNT)
    fps = video.get(cv2.CAP_PROP_FPS)
    while True:
        success, frame = video.read()
        if not success:
            break
        frames.append(frame)
        # compute RGB histogram for each frame
        hist_feature = [cv2.calcHist([frame], [c], None, [hist_size], [0,256]) for c in range(3)]
        # flattten the histogram features
        hist_arr.append(np.asarray(hist_feature).flatten())
    # store into an array
    hist_arr =np.asarray(hist_arr)
    # compute abs diff for histograms
    hist_diff = [np.ndarray.sum(abs(pair[0] - pair[1])) for pair in zip(hist_arr[1:], hist_arr[:-1])]
    
    return hist_diff, frames, fps

def save_keyframes(frames, keyframe_indices, dir_path):

    # save keyframes
     keyframes = [frames[i] for i in keyframe_indices]
     print("Saving frames") 
     for i,frame in enumerate(keyframe_indices):
	 	    cv2.imwrite("{0}/frame{1}.jpg".format(dir_path, frame), frames[frame-1])


def keyframe_select(hist_diff, frames, factor, min_shot_duration):

    average_frame_div = sum(hist_diff)/len(hist_diff) #average diff
    keyframe_index = []
    for index in range(len(hist_diff)):
        if hist_diff[index] > factor * average_frame_div:    #if the scores are more than the average difference, identified as key
            keyframe_index.append(index + 1)


    tmp_idx = copy.copy(keyframe_index)
    for i in range(0, len(keyframe_index) - 1):
        if keyframe_index[i + 1] - keyframe_index[i] < min_shot_duration:   # the frames are checked to see if they are considered the same shot
            del tmp_idx[tmp_idx.index(keyframe_index[i])]
    keyframe_index = tmp_idx
    
    
    keyframe_index_new = copy.copy(keyframe_index)
    keyframe_index_new.insert(0, -1) # add the first frame in
    if len(frames) - 1 - keyframe_index_new[-1] < min_shot_duration:  #add the last frame in (provided video is longer than what is considered a shot)
        del keyframe_index_new[-1]
    keyframe_index_new.append(len(frames) - 1)
   

    keyframe_index_new = list(map(lambda x : x + 1.0, keyframe_index_new))
    #We get the mid-index of pairs of sequential selected key frame
    shot_middle_idx = [math.ceil((pair[0] + pair[1])/2) for pair in zip(keyframe_index_new[:-1], keyframe_index_new[1:])]
    shot_middle_idx = list(map(lambda x : int(x), shot_middle_idx))
    

    # double checking if it is within the shot, if yes then not keyframe
    tmp_idx = copy.copy(shot_middle_idx)
    for i in range(0, len(shot_middle_idx) - 1):
        if shot_middle_idx[i + 1] - shot_middle_idx[i] < min_shot_duration:
            del tmp_idx[tmp_idx.index(shot_middle_idx[i])]   
    keyframe_indices = tmp_idx

    return keyframe_indices

def run_abshist(video_file, factor = 4, min_shot_duration = 25):

    hist_diff, frames, fps = read_video(video_file)
    keyframe_indices = keyframe_select(hist_diff, frames, factor, min_shot_duration)
    save_keyframes(frames, keyframe_indices, "Result")