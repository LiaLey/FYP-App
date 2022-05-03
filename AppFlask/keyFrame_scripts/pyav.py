import av
import os
import shutil

## this is a very strighforward method for keyframe extraction obtain from a python library called pyav
## this is an additional option given to the users for keyframe extraction based off a library 

def extract_vid(filename):

    #keyframe extraction with pyav
    container = av.open(str(filename))
    stream = container.streams.video[0]
    stream.codec_context.skip_frame = 'NONKEY'
    for frame in container.decode(stream):
        frame.to_image().save('frame{:04d}.png'.format(frame.pts), quality = 80)

    folder_dir = "C:/Users/celia/Desktop/Project/AppFlask"
    dest_dir = "C:/Users/celia/Desktop/Project/AppFlask/Result"
    for images in os.listdir(folder_dir):
        if "frame" in images:
            shutil.copy(images, dest_dir)
            os.remove(images)
    container.close()      

def pyav_run(vid_file):
    extract_vid(vid_file)