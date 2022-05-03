import { Component, useState, setState } from "react";
import { Carousel, Spinner } from 'react-bootstrap';
import "./vidEx.css"

class Vid_Ex_Component extends Component{
    constructor(props){
        super(props);
    }
   
    // renders the Example component 
    render(){
        return (
            <div>
                <h4 className="text_default_color">How It Works</h4>
                <div className = "vid-picture-component-container tertiary_inner_background default_border">
                    <center>
                        <p>Video</p>
                        <video height="240" controls className="video-display-component tertiary_inner_background default_border">
                            <source src="VidEx_data/VidEx.mp4" type="video/mp4" />
                            
                        </video>
                        <br/>
                        <i class="fa fa-arrow-circle-down down-icon"></i>
                        <p>Frames Selected</p>
                        <div className = "image-display-container">
                            <div className = "image-display-inner-container tertiary_inner_background default_border">
                                <img src = "VidEx_data/frame0.jpg" 
                                    height = "100"
                                />
                            </div>
                            
                            <div className = "image-display-inner-container tertiary_inner_background default_border">
                                <img src = "VidEx_data/frame1.jpg" 
                                    height = "100"
                                />
                            </div>
                            
                            <div className = " image-display-inner-container tertiary_inner_background default_border">
                                <img src = "VidEx_data/frame2.jpg" 
                                    height = "100"
                                />
                            </div>
                            
                            <div className = " image-display-inner-container tertiary_inner_background default_border">
                                <img src = "VidEx_data/frame3.jpg" 
                                    height = "100"
                                />
                            </div>
                         </div>
                    </center>
                 </div>
            </div>
        )
    }
}

export default Vid_Ex_Component