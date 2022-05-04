import { Component, useState, setState } from "react";
import axios from "axios";
import { Button, Alert, Form } from 'react-bootstrap';
import DropDownComp from "./DropDown/dropdown";
import ImageCarousel from "./ImageCarousel/carousel";
import CardComponent from "./CardComp/CardComp";
import  Vid_Ex_Component from "./VideoExample/vidEx";
import "./vidMain.css"

class VidMain extends Component{

    constructor(props){
        super(props);
    }

    // States
    state = { 
        images: [],

        dropDownSelectedValue: "Uniform Sampling + Histogram Comparison",

        returnedDropDownSelectedValue: "",

        file_selected_show_alert:false,

        // main dropdown values - store the values
        dropDownValues: {
            "SamplingRate1Value": "",
            "ShotDuration1Value": "",
            
            "Thresh2Value":"",
            "ShotDuration2Value":"",
            
            "Method3Value":"",

            "SamplingRate4Value": "",
            "CentroidPercent4Value": "",

            "CosThresh5Value": "",
            "ShotDuration5Value": ""
            
        },

        // check if the keys are empty
        userDropDownValueNotEmpty:{
            "SamplingRate1Value": false,
            "ShotDuration1Value": false,
            
            "Thresh2Value":false,
            "ShotDuration2Value":false,
            
            "Method3Value":false,

            "SamplingRate4Value": false,
            "CentroidPercent4Value": false,

            "CosThresh5Value": false,
            "ShotDuration5Value": false,
            
            "mainDropDown":false,
        },

        // check if empty and if need to show alert
        showAlertDropDown:{
            "SamplingRate1Value": false,
            "ShotDuration1Value": false,
            
            "Thresh2Value":false,
            "ShotDuration2Value":false,
            
            "Method3Value":false,

            "SamplingRate4Value": false,
            "CentroidPercent4Value": false,

            "CosThresh5Value": false,
            "ShotDuration5Value": false,

            "mainDropDown": false
         
        },

        // The alert texts for each input/dropdown
        alertTexts:{
            "SamplingRate1Value": "This input cannot be left blank.",
            "ShotDuration1Value": "This input cannot be left blank.", 
            
            "Thresh2Value":"This input cannot be left blank.",
            "ShotDuration2Value":"This input cannot be left blank.",
           
            "Method3Value":"This input cannot be left blank.",

            "SamplingRate4Value":"This input cannot be left blank.",
            "CentroidPercent4Value":"This input cannot be left blank.",

            "CosThresh5Value":"This input cannot be left blank.",
            "ShotDuration5Value":"This input cannot be left blank.",
           

            "mainDropDown": "This input cannot be left blank."
        },

        // if the spinner shld be shown
        imageLoading:false,
    }

    // handle the change in the inner dropdown/input values
    handleDropDownFormValChange = (key, val, isTextBox) =>{

        // set the states first
        let dropDownValuesNew = this.state.dropDownValues
        let alertTextsNew = this.state.alertTexts
        dropDownValuesNew[key] = val

        let dropDownSelectedValuesNew = this.state.userDropDownValueNotEmpty
        
        // check if blank or if entered correct datatype
        if(val == ""){
            dropDownSelectedValuesNew[key] = false
            alertTextsNew[key] = "This input cannot be left blank."
        }
        else if(isTextBox && Number.isNaN(Number(val))){
            dropDownSelectedValuesNew[key] = false
            alertTextsNew[key] = "Input can only be integers/decimals."
        }
        else{
            dropDownSelectedValuesNew[key] = true
            alertTextsNew[key] = ""
        }
        
        // set the states after error checking
        this.setState({
            dropDownValues: dropDownValuesNew,
            userDropDownValueNotEmpty: dropDownSelectedValuesNew,
            alertTexts: alertTextsNew
        });
        
    }

    // handle the change in the main dropdown values
    handleChangeDropDownVal = (newDropDownVal) => {

        // updates the state
        this.setState({
            dropDownSelectedValue: newDropDownVal,
            dropDownValues: {
                "SamplingRate1Value": "",
                "ShotDuration1Value": "",  
                
                "Thresh2Value":"",
                "ShotDuration2Value":"",
                
                "Method3Value":"",
                
                "SamplingRate4Value": "",
                "CentroidPercent4Value": "",

                "CosThresh5Value": "",
                "ShotDuration5Value": "",
               
            },
            // for error checking
            userDropDownValueNotEmpty:{
                "SamplingRate1Value": false,
                "ShotDuration1Value": false,  
                
                "Thresh2Value":false,
                "ShotDuration2Value":false,
                
                "Method3Value":false,
            
                "SamplingRate4Value": false,
                "CentroidPercent4Value": false,
                
                "CosThresh5Value": false,
                "ShotDuration5Value": false,
                
                "mainDropDown":true,
            },

            // whether or not to show alert
            showAlertDropDown:{
                "SamplingRate1Value": false,
                "ShotDuration11Value": false,
                
                "Thresh2Value":false,
                "ShotDuration2Value":false,
                
                "Method3Value":false,

                "SamplingRate4Value": false,
                "CentroidPercent4Value": false,

                "CosThresh5Value": false,
                "ShotDuration5Value": false,
                        
            }

        });
    }

    // checking for empty fields
    check_single_field_empty = (keyCollection) =>{

        let allElementsFilledUp = true
        let showAlertDropDownNew = this.state.showAlertDropDown
        let numElements = keyCollection.length
        
        // check and determine if need to show alert for that input/dropdown
        for (let i = 0;i<numElements;i++){
            
            if(!this.state.userDropDownValueNotEmpty[keyCollection[i]]){
                allElementsFilledUp = false
                showAlertDropDownNew[keyCollection[i]] = true
            }
            else
            {
                showAlertDropDownNew[keyCollection[i]] = false
            }
        }
        // update the state
        this.setState({
            showAlertDropDown:showAlertDropDownNew
        });

        return allElementsFilledUp
    }

    // check the main dropdown
    field_filled_up_check = () =>{

        // if empty show alert
        if(!this.state.userDropDownValueNotEmpty["mainDropDown"]){
            let showAlertDropDownNew = this.state.showAlertDropDown
            showAlertDropDownNew["mainDropDown"] = true
            this.setState({
                showAlertDropDown:showAlertDropDownNew
            });
            return false
        }
        // else we fill up the keys with the selected values and check if the inner dropdowns are empty
        else{
            if(this.state.dropDownSelectedValue == "Uniform Sampling + Histogram Comparison"){
                let dropDownCollectionKey = ["SamplingRate1Value", "ShotDuration1Value"]
                return this.check_single_field_empty(dropDownCollectionKey)
            }
            else if(this.state.dropDownSelectedValue == "Absolute Histogram Difference"){
                let dropDownCollectionKey = ["Thresh2Value", "ShotDuration2Value"]
                return this.check_single_field_empty(dropDownCollectionKey)
            }
            else if(this.state.dropDownSelectedValue == "Absolute Frame Difference (LUV)"){
                let dropDownCollectionKey = ["Method3Value"]
                return this.check_single_field_empty(dropDownCollectionKey)
            }
            else if(this.state.dropDownSelectedValue == "K-Means Clustering"){
                let dropDownCollectionKey = ["SamplingRate4Value", "CentroidPercent4Value"]
                return this.check_single_field_empty(dropDownCollectionKey)
            }
            else if(this.state.dropDownSelectedValue == "Dynamic Clustering"){
                let dropDownCollectionKey = ["CosThresh5Value", "ShotDuration5Value"]
                return this.check_single_field_empty(dropDownCollectionKey)
            }
            else if(this.state.dropDownSelectedValue == "PyAV (Lib)"){
                return true
            }
            
        }
        
    }
    
    // the submit button
    handleOnClick = (event) =>{

        console.log("Start Sending")
        // set the states
        this.setState({
            images: [],
            returnedDropDownSelectedValue: "",
            // hide all alerts
            showAlertDropDown:{
                "SamplingRate1Value": false,
                "ShotDuration1Value": false,
                
                "Thresh2Value":false,
                "ShotDuration2Value":false,
                
                "Method3Value":false,

                "SamplingRate4Value": false,
                "CentroidPercent4Value": false,

                "CosThresh5Value": false,
                "ShotDuration5Value": false,
                
            },

            file_selected_show_alert: false
        });

        // fill the form that will be sent 
        let formData = new FormData();
        let vidFile = document.querySelector('#fileToUpload');
        
        // add error checking
        if(!vidFile.files[0]){
            this.setState({
                file_selected_show_alert:true
            });
            return 1
        }
        else if(!(vidFile.files[0].type == "video/webm" || vidFile.files[0].type == "video/mp4")){
            // file format is not webm or mp4
            this.setState({
                file_selected_show_alert:true
            });
            return 1
        }

        // additional error checking
        if(!this.field_filled_up_check()){
            return 1
        }
        console.log("Check complete")
        // if we reached here, this means the form is filled up correctly, start the spinner loader
        this.setState({
            imageLoading:true,
        })

        // append the video and data and parameters to the form
        formData.append("fileToUpload", vidFile.files[0]);
        formData.append("userSelectedVal", String(this.state.dropDownSelectedValue));
        console.log("Running " + String(this.state.dropDownSelectedValue))

        // appending the dropdown values 
        let keys = Object.keys(this.state.dropDownValues);
        let numKeys = (keys).length
        for (let numKeysIndex = 0;numKeysIndex < numKeys;numKeysIndex++){
            let keyIndex = keys[numKeysIndex]
            let sendVal = ""
            if(this.state.dropDownValues[keyIndex]){
                sendVal = String(this.state.dropDownValues[keyIndex])
            }
            else{
                sendVal = "None"
            }
            
            formData.append(keyIndex, sendVal);
        }
        axios({
            method:"post",
            url: "http://127.0.0.1:5000/vid",
            data: formData,
        }).then((response) => {
            let imageData = (response.data.result)

            if(imageData){

                // if there are images, we reset the states
                 this.setState({
                     images:imageData,
                     
                     // hide all alerts
                     showAlertDropDown:{
                        "SamplingRate1Value": false,
                        "ShotDuration1Value": false,
                        
                        "Thresh2Value":false,
                        "ShotDuration2Value":false,
                        
                        "Method3Value":false,
        
                        "SamplingRate4Value": false,
                        "CentroidPercent4Value": false,
        
                        "CosThresh5Value": false,
                        "ShotDuration5Value": false,
                     },

                    file_selected_show_alert: false,

                    // set image loading to false, information received
                    imageLoading:false,
                })
            }
            
        })
        .catch((error) => {
            // error handling
            console.log('Error', error.message);
            alert("A backend error has occured. Error Message: \"" + error.message + "\". Reloading web app now.")
            // reload page
            window.location.reload()
        })
        
    }

    // alert for the video file upload
   handle_render_alert_file_upload = () =>{
       if(this.state.file_selected_show_alert){
           return(
            <Alert
                    // dark mode 
                    //variant="danger"
                    variant="danger"
                    data-testid="no_file_selected_alert"
                >
                    Please select a valid video file
            </Alert>
           )
       }
   }


//    render component (all the components needed for the webpage)
    render(){
        return (
            <div>
                <div className = "vid_app_container">
                    <h1 className="text_default_color">Key Frame Extraction Tool</h1>
                    <br />
                    <h5 className="text_default_color">An interface that allows you to experiment with some of the classic methods of Key-frame Extraction/Video Summarization</h5>
                    <div className= "form_data_container">
                        <div className="mb-3 upload_file_container">
                            <label htmlFor="fileToUpload" className="col-form-label text_default_color">Only .mp4 supported.</label>
                            <input type="file" name="fileToUpload" id="fileToUpload" className="form-control" data-testid="fileToUpload"/>
                            {this.handle_render_alert_file_upload()}
                        </div>
                        

                        <div className="form_data_inner_container">
                            <DropDownComp 
                                dropDownSelectedValue = {this.state.dropDownSelectedValue}
                                handleChangeDropDownVal = {this.handleChangeDropDownVal}
                                dropDownValues = {this.state.dropDownValues}
                                handleDropDownFormValChange = {this.handleDropDownFormValChange}
                                showAlertDropDown = {this.state.showAlertDropDown}
                                alertTexts = {this.state.alertTexts}
                            />
                            <center>
                                <Button variant="primary" onClick = {this.handleOnClick} name="submit" id = "start_button" data-testid="extract_button">Extract Keyframes </Button>
                            </center>
                        </div>

                    </div>
                    
                    <br />
                    <br />

                </div>
                <center>
                    <h4 className="text_default_color">Key Frames Selected: </h4>
                </center>
                <center>
                    <div className="carousel-outer-container">
                        {/* {this.handleRenderImage()} */}
                        <ImageCarousel images = {this.state.images} imageLoading = {this.state.imageLoading}/>
                        
                    </div>
                </center>
                <br />
                <center>
                    <Vid_Ex_Component />
                </center>
                <br />
                <center>
                    <CardComponent />
                </center>
                <br />
                <br />
                <br />
            </div>
        )
    }
}

export default VidMain
