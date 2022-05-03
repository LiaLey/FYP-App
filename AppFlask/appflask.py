import os
from flask import Flask, request, send_file
import numpy as np
from werkzeug.utils import secure_filename
import io
from base64 import encodebytes
from PIL import Image
from flask import jsonify
from flask_cors import CORS
import sys
sys.path.insert(0, os.getcwd() + "/keyFrame_scripts")
from pyav import *
from uniform_sampling_histdist import *
from abs_hist_diff import *
from dynamic_cluster import *
from k_means import *
from abs_frame_diff_luv import *

app = Flask(__name__)

CORS(app)

# encode the images
def get_response_image(image_path, folder_dir):
    pil_img = Image.open(os.path.join(folder_dir,image_path), mode='r') # reads the image
    byte_arr = io.BytesIO()
    pil_img.save(byte_arr, format='PNG') # convert the image to byte array
    encoded_img = encodebytes(byte_arr.getvalue()).decode('ascii') # encode as base64
    os.remove(os.path.join(folder_dir,image_path)) #remove the images
    return encoded_img


@app.route("/vid", methods=["POST"])
def get_frames():
   
    if request.method == "POST":
        
        # write video file to current directory
        f = request.files['fileToUpload']
        vid_file = secure_filename(f.filename)
        # f.save(secure_filename(f.filename))
        f.save(vid_file)

        # get the selected method
        selectedVal = request.form.get('userSelectedVal')
        print(selectedVal)

        # store the keys and their values
        paramDict = dict()
        formDropDownValCollectionKey = [
            "SamplingRate1Value",
            "ShotDuration1Value",
            
            "Thresh2Value",
            "ShotDuration2Value",
            
            "Method3Value",

            "SamplingRate4Value",
            "CentroidPercent4Value",

            "CosThresh5Value",
            "ShotDuration5Value"]

        # update the dictionary with the values
        for valKey in formDropDownValCollectionKey:
            val = request.form.get(valKey)
            paramDict.update({valKey: val})
            
        # Run the specified methods
        if selectedVal == "Uniform Sampling + Histogram Comparison":

            sampling_rate = int(paramDict.get("SamplingRate1Value"))
            shot_duration = int(paramDict.get("ShotDuration1Value"))
            run_uniform_histDist(vid_file, sampling_rate, shot_duration, 4)

        elif selectedVal == "Absolute Histogram Difference":

            factor = int(paramDict.get("Thresh2Value"))
            shot_duration_hist = int(paramDict.get("ShotDuration2Value"))
            run_abshist(vid_file, factor, shot_duration_hist)

        elif selectedVal == "Absolute Frame Difference (LUV)":
            
            selected_method = paramDict.get("Method3Value")
            if selected_method == "Local Maxima":
                 method = 1
            elif selected_method == "Thresholding":
                 method = 2
            run_absluv(vid_file, method)
       
        elif selectedVal == "K-Means Clustering":

            sampling_rate_kmean = int(paramDict.get("SamplingRate4Value"))
            centroid_percentage = int(paramDict.get("CentroidPercent4Value"))
            run_kmeans_clustering(vid_file, centroid_percentage, sampling_rate_kmean)

        elif selectedVal == "Dynamic Clustering":

            cosine_thresh = float(paramDict.get("CosThresh5Value"))
            shot_duration_dynamic = int(paramDict.get("ShotDuration5Value"))
            run_dynamic_cluster(vid_file, cosine_thresh, shot_duration_dynamic)

        elif selectedVal == "PyAV (Lib)":
            pyav_run(secure_filename(f.filename))
            
        
        
        result = []
        folder_dir = "./Result"
        for images in os.listdir(folder_dir):
            # check for images with png or jpg
            if (images.endswith(".png") or images.endswith(".jpg")):
                # append the images to the result image array
                result.append(images)

        # return the encoded image
        encoded_imges = []
        for image_path in result:
            encoded_imges.append(get_response_image(image_path, folder_dir))
        # remove the video
        os.remove(vid_file)
        return jsonify({'result': encoded_imges})
        
    else:
        return "Error"

if __name__ == '__main__':
   app.run(debug = True)
    

