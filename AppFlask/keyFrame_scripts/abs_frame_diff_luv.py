import cv2
import numpy as np
import matplotlib.pyplot as plt
from scipy.signal import argrelextrema
import copy

#  threshold value
THRESH = 0.6

# class that holds the frame details
class Frame:
   
    def __init__(self, id, diff):
        self.id = id
        self.diff = diff

def smoothing(x, window_len=15, window='hanning'):

    # This smoothing algo is based on https://scipy-cookbook.readthedocs.io/items/SignalSmooth.html
    #np.r_ concats single vector array
    s = np.r_[2 * x[0] - x[window_len:1:-1],
              x, 2 * x[-1] - x[-1:-window_len:-1]]
 
    if window == 'flat':  # moving average
        w = np.ones(window_len, 'd')  # d means double precision floating point
    else:
        w = getattr(np, window)(window_len)
    y = np.convolve(w / w.sum(), s, mode='same')
    # returned the smoothed video 
    return y[window_len - 1:-window_len + 1]

# calculates the diff between the frames
def diff_luv(prev, curr):

    if  max(prev, curr) == 0:
        diff = 0
    else:
        diff = (curr - prev) / max(prev, curr)
    return diff

def read_video(video_file):

    # read the video
    cap = cv2.VideoCapture(video_file) 
    curr_frame = None
    prev_frame = None 
    frame_diffs = []
    frames = []
    frame_list = []
    success, frame = cap.read()
    i = 0 
    while(success):
        frame_list.append(np.asarray(frame)) #store the frames into an array
        luv = cv2.cvtColor(frame, cv2.COLOR_BGR2LUV) # convert to LUV
        curr_frame = luv
        if curr_frame is not None and prev_frame is not None:
            diff = cv2.absdiff(curr_frame, prev_frame)  #compute the difference in the luv of the frames
            diff_sum = np.sum(diff)
            diff_sum_mean = diff_sum / (diff.shape[0] * diff.shape[1])  #get the mean of the difference
            frame_diffs.append(diff_sum_mean)
            frame = Frame(i, diff_sum_mean)  #store into the frame class as an object
            frames.append(frame)  #append to the list of frames
        prev_frame = curr_frame
        i = i + 1
        success, frame = cap.read()   
    cap.release()

    frame_list = np.array(frame_list)

    return frames, frame_diffs, frame_list

def save_keyframes(frame_list, keyframe_id_set, dir_path):

    # save keyframes
     keyframes = [frame_list[i] for i in keyframe_id_set]
     print("Saving frames") 
     for i,frame in enumerate(keyframe_id_set):
	 	    cv2.imwrite("{0}/frame{1}.jpg".format(dir_path, frame), frame_list[frame])


# obtain the keyframes with a predefined fixed threshold
def thresh_diff(frames):
    
    keyframe_id_set = []
    for i in range(1, len(frames)):
        # checking to see if threshold exceeded
        if (diff_luv(np.float(frames[i - 1].diff), np.float(frames[i].diff)) >= THRESH): 
            keyframe_id_set.append(frames[i].id) 

    # the frames are checked to see if they are considered the same shot
    tmp_id_set = copy.copy(keyframe_id_set)
    for i in range(0, len(keyframe_id_set)-1):
        if keyframe_id_set[i + 1] - keyframe_id_set[i] < 25:   # if less than 25 frames then considered to be represent the same shot
            del tmp_id_set[tmp_id_set.index(keyframe_id_set[i])]
    keyframe_id_set = tmp_id_set
    
    return keyframe_id_set

# get the local maximum for a specific window with the smoothing 
def local_maxima(frames, frame_diffs):

    # Window length
    len_window = int(50)
    keyframe_id_set = []
    diff_array = np.array(frame_diffs)
    # perform the smoothing based on the window length
    smooth_diff_array = smoothing(diff_array, len_window)
    # get the local maxima
    frame_indexes = np.asarray(argrelextrema(smooth_diff_array, np.greater))[0]
    for i in frame_indexes:
        keyframe_id_set.append(frames[i - 1].id)
    # return the keyframe index
    return keyframe_id_set

# diff methods for the luv differences
def run_absluv(video_file, method = 3):

    frames, frame_diffs, frame_list = read_video(video_file)
    if method == 1:
        keyframe_id_set = local_maxima(frames, frame_diffs)
    elif method == 2:
        keyframe_id_set = thresh_diff(frames)
    
    save_keyframes(frame_list, keyframe_id_set, "Result")



