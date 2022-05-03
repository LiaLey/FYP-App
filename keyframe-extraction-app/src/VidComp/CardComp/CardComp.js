import { Component, useState, setState } from "react";
import { Card } from 'react-bootstrap';
import "./CardComp.css"

class CardComponent extends Component{
    constructor(props){
        super(props);
    }

    // renders the card components at the bottom 
    render(){
        return (
            <div >
                <br/>
                <br/>
                <h2 className="text_default_color" id = "cardComponentScrollTo">Different Methods Simply Explained</h2>
                <br/>
                <br/>
                <Card className="card-container secondary_inner_background text_default_color card_default_border" >
                    <Card.Header className = "secondary_inner_background card_default_border" as = "h4" >Uniform Sampling + Histogram Comparison</Card.Header>
                    <Card.Body className = "tertiary_inner_background card_default_border">
                        <Card.Text>
                           Uniform Sampling is performed on the frames of the video. Depending on the sampling rate, the algorithm selects a sample number of frames to perform the key-frame extraction.
                           Based on the sample set of frames selected, HSV histogram comparison is performed on consecutive frames. Frames with histogram difference over a certain threshold will be considered as a transition frame.
                           Frames are then filtered again based on the shot duration given. The middle frame of a shot (length betwen 2 transition frames) is selected as a keyframe.
                           <br/>
                           <br/>
                           <Card.Title>Parameters: Sampling Rate</Card.Title>
                           Eg. A sampling rate of 50 means that every 50th frame is picked for the sample set
                           <br/>
                           <br/>
                           <Card.Title>Parameters: Minimum Shot Duration</Card.Title>
                           When filtering the frames after the histogram comparison, the consecutive frames within the shot duration are eliminated as they are considered redundant frames
                        </Card.Text>
                    </Card.Body>
                </Card>
                <br/>
                <br/>
                <Card className="card-container secondary_inner_background text_default_color card_default_border" >
                    <Card.Header className = "secondary_inner_background card_default_border" as = "h4" >Absolute Histogram Difference</Card.Header>
                    <Card.Body className = "tertiary_inner_background card_default_border">
                        <Card.Text>
                           This is a straighforward method where frames with histogram difference over a certain threshold will be considered as a transition frame.
                           The frames are then filtered again based on the shot duration given. The middle frame of a shot (length betwen 2 transition frames) is selected as a keyframe.
                           <br/>
                           <br/>
                           <Card.Title>Parameters: Threshold factor</Card.Title>
                           The threshold is calculated based on the average difference of all frames. Users can specify a factor for the threshold.
                           <br/>
                           <br/>
                           <Card.Title>Parameters: Minimum Shot Duration</Card.Title>
                           When filtering the frames after the histogram comparison, the consecutive frames within the shot duration are eliminated as they are considered redundant frames
                        </Card.Text>
                    </Card.Body>
                </Card>
                <br/>
                <br/>
                <Card className="card-container secondary_inner_background text_default_color card_default_border" >
                    <Card.Header className = "secondary_inner_background card_default_border" as = "h4" >Absolute Difference (LUV Colourspace)</Card.Header>
                    <Card.Body className = "tertiary_inner_background card_default_border">
                        <Card.Text>
                           This is another straighforward method where we compare the differences between consecutive frames. The difference is that we compare the absolute difference between frames in the LUV colourspace instead
                           of the RGB or HSV colourspace. This method provides 3 different ways to select the keyframes. 
                           <br/>
                           <br/>
                           <Card.Title>Parameters: Selection Method</Card.Title>
                           <b>Local Maxima :</b> Keyframes are selection based on a smoothing function where the frames with the most difference ina certain window is selected as keyframe.
                           <br/>
                           <b>Top 10 Frames :</b> The top 10 frames with the greatest difference are selected as keyframes
                           <br/>
                           <b>Thresholding :</b> Keyframes are selected based on a threshold. Default value of 0.6.
                           
                        </Card.Text>
                    </Card.Body>
                </Card>
                <br/>
                <br/>
                <Card className="card-container secondary_inner_background text_default_color card_default_border" >
                    <Card.Header className = "secondary_inner_background card_default_border" as = "h4" >K-Means Clustering</Card.Header>
                    <Card.Body className = "tertiary_inner_background card_default_border">
                        <Card.Text>
                           Uniform Sampling is performed on the frames of the video. Depending on the sampling rate, the algorithm selects a sample number of frames to perform the key-frame extraction.
                           Based on the sample set of frames selected and the percentage of centriod given by the users, the frames are clustered and a keyframe is selected based on each cluster.
                           <br/>
                           <br/>
                           <Card.Title>Parameters: Sampling Rate</Card.Title>
                           Eg. Eg. A sampling rate of 50 means that every 50th frame is picked for the sample set
                           <br/>
                           <br/>
                           <Card.Title>Parameters: Percentage of Centriods</Card.Title>
                           Eg. A 50% centriod percentage in a 1000 frame video means there will be 500 clusters
                           
                        </Card.Text>
                    </Card.Body>
                </Card>
                <br/>
                <br/>
                <Card className="card-container secondary_inner_background text_default_color card_default_border" >
                    <Card.Header className = "secondary_inner_background card_default_border" as = "h4" >Dynamic Clustering</Card.Header>
                    <Card.Body className = "tertiary_inner_background card_default_border">
                        <Card.Text>
                           Instead of a fixed number of centriod, this method dynamically clustering the frames. The frames are divided in 3x3 blocks. RGB histogram is computed for each block.
                           A feature-frame matrix is created by concatenating the 9 histograms. SVD is performed to reduce the dimension of the matrix. The frames are then clustered based on a Cosine
                           Similarity check. Frames that have a Cosine Similarity over a certain threshold given will be considered to be in the same cluster. The middle frame from each cluster is selected as a Key-frame.
                           <br/>
                           <br/>
                           <Card.Title>Parameters: Cosine Similarity Threshold</Card.Title>
                           A number between 0 to 1. The higher the number the more keyframes extracted for a single event. Default value at 0.98
                           <br/>
                           <br/>
                           <Card.Title>Parameters: Minimum Shot Duration</Card.Title>
                           When filtering the frames after the clustering, clusters below a certain given number of frames are filtered out and not considered as key events.
                           
                        </Card.Text>
                    </Card.Body>
                </Card>
            </div>
        )
    }
}

export default CardComponent