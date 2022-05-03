import { Component, useState, setState } from "react";
import { Carousel, Spinner, Button } from 'react-bootstrap';
import "./carousel.css"

class ImageCarousel extends Component{
    constructor(props){
        super(props);
    }

    // state of the images 
    state = {
        
        imageIndex:0

    }

    handleCarouselChangeItem = (selectedIndex, e) => {
        // set the state of the index
        this.setState({
            imageIndex:selectedIndex
        })
    };
    
    // render the carousel components - dynamically looping/appending the images
    handleRenderCarousel = () =>{
        let imageItemElement = []
        let numberOfImages = this.props.images.length
        for(let index = 0;index < numberOfImages; index++){
            if(this.props.images[index]){
                // if the image has an element in it
                if(this.props.images[index] !== ""){
                    imageItemElement.push(
                        <Carousel.Item key = {index}>
                            <center>
                                <div className = "carouselItemDiv">
                                    <img src = {`data:image/jpg;base64,${this.props.images[index] }`}  data-testid = "image_id"/>
                                    <br />
                                    <br />
                                    <Button variant="primary" download="image.jpg" 
                                        href={`data:image/jpg;base64,${this.props.images[index]}`}>Download Image
                                    </Button>
                                </div>
                            </center>
                        </Carousel.Item>
    
                    )
                }
            }
            
        }

        // the spinner loader will be shown if images are being loaded
        if(this.props.imageLoading){
           return(
            
            <Spinner animation="border" variant="info" data-testid="processing_spinner"/>
           )
        }
        // if not show the below line of text
        else if(imageItemElement.length == 0){
            return(
                <div>
                    <p className = "carousel-hint-text">No Images yet.. Try uploading a video to get started</p>
                    <p className = "carousel-hint-text">Note: The uploading process to server takes some time, please do wait awhile.</p>
                </div>
            )

        }
        // once finish loading, show the images
        else{
            return(
                <Carousel 
                    activeIndex={this.state.imageIndex} 
                    onSelect={this.handleCarouselChangeItem}
                    interval = {null}
                    variant="dark"
                    data-testid = "image_caro"

                >
                    {imageItemElement}
                </Carousel>
                
            )
        }
    }

//    render the image carousel
    render(){
        return (
            <div>
                {this.handleRenderCarousel()}
                
            </div>
        )
    }
}

export default ImageCarousel

