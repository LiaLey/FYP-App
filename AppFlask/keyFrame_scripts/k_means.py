import numpy as np
import cv2
from sklearn.cluster import KMeans


num_bins = 16 #num of bins for g,b,r
range_per_bin = 256/num_bins # size of values in each bin
#sampling_rate = 20 # skimming every nth frame
#centriods_percentage = 50


def save_keyframes(summary_frames):

    # Save the keyframes
	print("Saving frames")
	for i,frame in enumerate(summary_frames):
	 	cv2.imwrite("Result/frame%d.jpg"%i, frame)

def read_video(video_file, sampling_rate):
    
    # read the video file and store the frames according to sampling rate
    video = cv2.VideoCapture(video_file)
    frames = []
    i = 0
    while(video.isOpened()):
        if i % sampling_rate==0:
            video.set(1,i)
            success, frame = video.read() 
            if frame is None :
                break
            frames.append(np.asarray(frame))
        i += 1
    frames = np.array(frames) #store the frames into an array

    return frames

def calc_centriods(frames, centroids_percentage):

    # we calc the num of centroids according to the given percentage 
    num_centroids=int(centroids_percentage*len(frames)/100)	
    if (len(frames)) < num_centroids:
        num_centroids=int(len(frames)) #if frames lesser than input centriods then change it to the max number possible
    
    return num_centroids

def get_Hist(frames):

    channels=['b','g','r']
    hist_arr = []
    for frame in frames:
        # get the color hist of the frames
        hist_feature = [cv2.calcHist([frame],[i],None,[num_bins],[0,256]) for i,col in enumerate(channels)]
        hist_arr.append(np.asarray(hist_feature).flatten()) #flatten the hist features
    hist_arr =np.asarray(hist_arr)

    return hist_arr

def k_means_clustering(hist_arr, num_centroids,frames):

    kmeans = KMeans(n_clusters = num_centroids).fit(hist_arr) #K-means clustering
    keyframes=[]
    # transforms into cluster-distance space 
    hist_transform = kmeans.transform(hist_arr)
    frame_index=[]
    for cluster in range(hist_transform.shape[1]):
        frame_index.append(np.argmin(hist_transform.T[cluster]))  # get the frames after clustering 
        
    frame_index = sorted(frame_index) # sort frame index
    keyframes = [frames[i] for i in frame_index]

    return keyframes, frame_index

def run_kmeans_clustering(video_file, centroids_percentage = 50, sampling_rate = 50):

    frames = read_video(video_file, sampling_rate)
    histogram = get_Hist(frames)
    num_centroids = calc_centriods(frames,centroids_percentage)
    keyframes, frame_index = k_means_clustering(histogram, num_centroids, frames)
    save_keyframes(keyframes)