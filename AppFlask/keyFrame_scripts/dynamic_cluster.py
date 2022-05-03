import numpy as np
import pandas as pd
import time
import matplotlib.pyplot as plt
import cv2
from scipy.sparse import csc_matrix
from scipy.sparse.linalg import svds, eigs


def get_Hist(video_file):
    
    video = cv2.VideoCapture(video_file) 

    arr = np.empty((0, 1944), int)   #initialize array to store histograms features of the frames
    Dict_frames = dict()   # Store all the frames
    count_frames = 0    #number of frames
    start_time = time.time()
    while video.isOpened():
        
        # Read video
        success, frame = video.read()
        
        if success == True:
            frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)  
            Dict_frames[count_frames] = frame_rgb   # store frames into a dict
            #dividing a frame into 3x3 blocks
            height, width, channels = frame_rgb.shape

            if height % 3 == 0:
                h_chunk = int(height/3)
            else:
                h_chunk = int(height/3) + 1

            if width % 3 == 0:
                w_chunk = int(width/3)
            else:
                w_chunk = int(width/3) + 1

            h = 0
            w = 0 
            feature_vector = []
            
            for a in range(1,4):
                h_window = h_chunk*a
                for b in range(1,4):
                    frame = frame_rgb[h : h_window, w : w_chunk*b , :]
                    hist = cv2.calcHist(frame, [0, 1, 2], None, [6, 6, 6], [0, 256, 0, 256, 0, 256]) #calculate histograms for each block  
                    hist1 = hist.flatten()  #flatten the hist
                    feature_vector += list(hist1) # store the hist features
                    w = w_chunk*b
                    
                h = h_chunk*a
                w = 0
                
            arr = np.vstack((arr, feature_vector )) # generate N*M matrix (where N is number of frames and M is 1944) 
            count_frames += 1
        else:
            break

    print("--- %s seconds ---" % (time.time() - start_time))

    frame_arr = arr.transpose() # now transpose to a M*N matrix

    return frame_arr, Dict_frames

# The SVD is performed to reduce the dimension of the hist features to 63
def get_svd_projections(frame_arr):
    
    arr = csc_matrix(frame_arr, dtype=float)
    u, s, vt = svds(arr, k = 63)

    # we want to get (N, 63) where N is the number of frames
    v1_t = vt.transpose()
    projections = v1_t @ np.diag(s)

    return projections

def dynamic_clustering(projections, similarity_thresh):

    frames = projections # the histogram features in a reduced dimension
    cluster = dict() #to store frames in respective cluster
    for i in range(frames.shape[0]):
        cluster[i] = np.empty((0,63), int)
        
    #Initializaton of cluster with first 2 frames
    cluster[0] = np.vstack((cluster[0], frames[0]))   
    cluster[0] = np.vstack((cluster[0], frames[1]))

    # Cluster centriods 
    centriods = dict() 
    for i in range(projections.shape[0]):
        centriods[i] = np.empty((0,63), int)
    # mean of the centriod
    centriods[0] = np.mean(cluster[0], axis=0) 

    # cluster the frames according to the cosine similarity
    count = 0
    for i in range(2,frames.shape[0]):
        cos_similarity = np.dot(frames[i], centriods[count])/( (np.dot(frames[i],frames[i]) **.5) * (np.dot(centriods[count], centriods[count]) ** .5)) #cosine similarity
        
        # The lower we go the more keyframe extracted for a similar event. Extact similar is 1 no similarity is 0
        if cos_similarity < similarity_thresh: 
             # not similar, form new cluster and count mean              
            count+=1         
            cluster[count] = np.vstack((cluster[count], frames[i])) 
            centriods[count] = np.mean(cluster[count], axis=0)   
        else: 
            # similar, add to cluster and update mean
            cluster[count] = np.vstack((cluster[count], frames[i])) 
            centriods[count] = np.mean(cluster[count], axis=0) 

    # get the clusters
    cluster_points = []
    for i in range(frames.shape[0]):
        cluster_points.append(cluster[i].shape[0])

    cluster_len = cluster_points.index(0)  #where we find where the last cluster ends 
    cluster_points_final = cluster_points[:cluster_len] #store all the filled clusters

    return cluster_points_final, cluster, cluster_len

def label_clusters(cluster_points_final, cluster, cluster_len, shotDuration):

    temp_cluster = cluster
    for i in range(cluster_len):
        arr1= np.repeat(i, cluster_points_final[i]).reshape(cluster_points_final[i], 1) # labelling for each frame (eg. if first cluster with 200 frames, all will be labelled with 1)
        temp_cluster[i] = np.hstack((temp_cluster[i], arr1)) # add the labels to the end of the cluster
    
    dataframe =  np.empty((0,64), int) # 64 columns because now we have a label added 
    for i in range(cluster_len):
        dataframe = np.vstack((dataframe, temp_cluster[i]))

    # label the columns
    colnames = []
    for i in range(1, 65):
        col_name = "c" + str(i)
        colnames+= [col_name]

    # store into a dataframe
    df = pd.DataFrame(dataframe, columns= colnames)
    # cast column 64 as int
    df['c64']= df['c64'].astype(int)

    # get the clusters with at least n number of frames
    shot_len = [idx for idx, val in enumerate(cluster_points_final) if val >= shotDuration]
    df1 =  df[df.c64.isin(shot_len)]

    # Extract the mid frame from each of the cluster
    df1['index'] = pd.RangeIndex(stop=df1.shape[0])
    # Extract group positions and number of rows
    idxpos = df1.groupby('c64', sort=False, as_index=False, group_keys=False, dropna=False)['index'].agg(['first','count']).values
    # Create middle rows position vector
    idxmid = idxpos[:,0] + idxpos[:,1]//2
    # Extract them and drop the index that we created
    keyframe = df1.iloc[idxmid].drop('index',axis=1)['c64']

    frame_index = keyframe.index

    return frame_index

def output_frames(frame_index, Dict_frames):

    # Save the frames 
    for index in frame_index:
        frame_rgb1 = cv2.cvtColor(Dict_frames[index], cv2.COLOR_RGB2BGR) # convert back to bgr
        # Label the frames with indexes
        frame_num_chr = str(index) 
        file_name = 'frame'+ frame_num_chr +'.png' 
        # save
        cv2.imwrite("Result/{0}".format(file_name), frame_rgb1)

def run_dynamic_cluster(video_file, similarity_thresh = 0.995, shotDuration = 5):

    frame_arr, Dict_frames = get_Hist(video_file)
    projections = get_svd_projections(frame_arr)
    cluster_points_final, cluster, cluster_len = dynamic_clustering(projections, similarity_thresh)
    frame_index = label_clusters(cluster_points_final, cluster, cluster_len, shotDuration)
    output_frames(frame_index, Dict_frames)


