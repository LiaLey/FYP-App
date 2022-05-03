import time
import numpy as np
import cv2
import copy
import math

num_bins_H = 32
num_bins_S = 4
num_bins_V = 2
#sampling_rate = 50  # every nth frame


def save_keyframes(frames, keyframe_indices, dir_path):

     keyframes = [frames[i] for i in keyframe_indices]
     print("Saving frames") 
     for i,frame in enumerate(keyframe_indices):
	 	    cv2.imwrite("{0}/frame{1}.jpg".format(dir_path, frame), frames[frame-1]) # save keyframes

def get_hsv_hist(frame):
        # get the hsv hist of the frames
        hsv_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
        hist = cv2.calcHist([hsv_frame], [0, 1, 2], None, [num_bins_H, num_bins_S, num_bins_V], [0, 256, 0, 256, 0, 256])
        hist = cv2.normalize(hist, hist).flatten() # flatten the hist features
        return hist

def read_video(video_file, sampling_rate):

        # read video and save frames according to sampling rate
        print("Opening video")
        video = cv2.VideoCapture(video_file)
        frame_count = int(video.get(cv2.CAP_PROP_FRAME_COUNT))
        sampling_rate_n = sampling_rate
        frame_indices = [i for i in range(frame_count) if i%sampling_rate==0]

        # Get the frames based on the sampling rate
        frames = []
        i=0
        start_time = time.time()
        while(video.isOpened()):
            if i % sampling_rate_n == 0: # based on the sampling rate provided we get a sample set of frames
                video.set(1,i)
                success, frame = video.read()
                if frame is None :
                    break
                frames.append(np.asarray(frame))
            i+=1
        frames = np.array(frames) # store into an array
        # print(len(frames))
        print("--- %s seconds ---" % (time.time() - start_time))

        return frames


def calc_hist_diff(frames, method):
    
    # get the hsv color hist of the frames
    color_histogram = [get_hsv_hist(frame) for frame in frames]
    diff_matrix_arr= []
    for i in range(1, len(color_histogram)):
        temp_list = []
        # compare the hist 
        diff_matrix = cv2.compareHist(color_histogram[i-1],color_histogram[i], method) 
        #store into an array
        diff_matrix_arr.append(diff_matrix)
    
    # get the mean dist as threshold
    frame_diff_arr = np.array(diff_matrix_arr)
    mean_thresh = np.mean(frame_diff_arr)

    return mean_thresh, frame_diff_arr

def select_keyframes(mean_thresh, frame_diff_arr, frames, min_shot_duration):

    keyframe_index = []

    for idx in range(len(frame_diff_arr)):
        if frame_diff_arr[idx] > mean_thresh:    #if the scores are more than the average difference (thresh), identified as key
            keyframe_index.append(idx + 1)
    
    # we want to reduce redundant images so we remove frames we consider to be in the same shot
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
    
    # We want to take the middle frame between two high difference transition ( the mid frame of a shot )
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
    print(keyframe_indices)

    return keyframe_indices

def run_uniform_histDist(video_file, sampling_rate = 50, min_shot_duration = 20, method = 4):

    frames = read_video(video_file, sampling_rate)
    mean_thresh, frame_diff_arr = calc_hist_diff(frames, method)
    keyframe_indices = select_keyframes(mean_thresh, frame_diff_arr, frames, min_shot_duration)
    save_keyframes(frames, keyframe_indices, "Result")