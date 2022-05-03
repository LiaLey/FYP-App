import { Component, useState, setState } from "react";
import { Dropdown, InputGroup, FormControl, Alert } from 'react-bootstrap';
import "./dropdown.css"

class DropDownComp extends Component{
    constructor(props){
        super(props);
        
    }

    // handle the dropdown change
    handleOnChangeDropDown = (event) =>{

        let optionSelected = String(event).slice(2);
        this.props.handleChangeDropDownVal(optionSelected);
        
    }

    // handle the inner dropdown change
    handleOnChangeInternalDropDown = (event, key) =>{
        let optionSelected = String(event).slice(2);
        this.props.handleDropDownFormValChange(key, optionSelected, false)

    }

    // handle the changes in the textbox
    handleOnChangeTextBoxInternal = (event, key) =>{
        this.props.handleDropDownFormValChange(key, event.target.value, true)
    }

    // handle rendering alerts
    handleRenderAlert= (key, string) =>{
        if(this.props.showAlertDropDown[key] && string!= ""){
            return(
                    <Alert variant="danger" data-testid = {key + "_alert"}>
                        {string}
                    </Alert>
            )
        }
    }

    // displays the inner dropdown component 
    handleRenderComponentOnDropDown = () =>{
        let userDropDownValue = this.props.dropDownSelectedValue
        if(userDropDownValue === ""){
            return(
                <div>
                    <p>No drop down value selected. Please select one drop down value to proceed.</p>
                
                </div>  
            )
            
        }
        else if(userDropDownValue === "Uniform Sampling + Histogram Comparison"){
            return(
                <div className = "option-container-outer">
                    <div className = "option-container">
                        <div className = "col-md-6 form-dropdown-elements-container">
                            <span className = "dropdown-elements-title">Minimum Shot Duration: </span><br />
                            <InputGroup  className = "input-text-form">
                                <FormControl aria-label="Text input" 
                                data-testid="ShotDuration1Value"
                                onChange = {(event) =>this.handleOnChangeTextBoxInternal(event, "ShotDuration1Value")}
                                value = {this.props.dropDownValues["ShotDuration1Value"]}
                                />
                            </InputGroup>
                           
                        </div>
                        <div className = "col-md-6 form-dropdown-elements-container">
                            <span className = "dropdown-elements-title">Sampling Rate: </span>
                            <Dropdown onSelect = {(event) =>this.handleOnChangeInternalDropDown(event, "SamplingRate1Value")}>
                                <Dropdown.Toggle variant="success" id="dropdown-basic" data-testid="SamplingRate1Value">
                                    {this.handleRenderOptionsTitle(this.props.dropDownValues["SamplingRate1Value"])}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    {this.handleRenderOptions(["1","2","3", "4", "5","8", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55", "60", "65", "70", "75", "80", "85", "90", "100"])}
                                </Dropdown.Menu>
                            </Dropdown>
                            
                        </div>
                    </div>    
                    {/* alerts */}
                    <div className = "option-container">
                        <div className = "col-md-6 form-dropdown-elements-container">
                            
                            {this.handleRenderAlert("ShotDuration1Value", this.props.alertTexts["ShotDuration1Value"])}
                        </div>
                        <div className = "col-md-6 form-dropdown-elements-container">
                           
                            {this.handleRenderAlert("SamplingRate1Value",this.props.alertTexts["SamplingRate1Value"])}
                        </div>
                    </div>    
                </div>        
            )
            
        }
        else if(userDropDownValue === "Absolute Histogram Difference"){
            
            return(
                <div className = "option-container-outer">
                    <div className = "option-container">
                        <div className = "col-md-6 form-dropdown-elements-container">
                            <span className = "dropdown-elements-title">Minimum Shot Duration: </span>
                            <InputGroup  className = "input-text-form">
                                <FormControl aria-label="Text input" data-testid="ShotDuration2Value" onChange = {(event) =>this.handleOnChangeTextBoxInternal(event, "ShotDuration2Value")}
                                    value = {this.props.dropDownValues["ShotDuration2Value"]}
                                
                                />
                            </InputGroup>
                            
                        </div>
                        <div className = "col-md-6 form-dropdown-elements-container">
                            <span className = "dropdown-elements-title">Threshold Factor: </span>
                            <Dropdown onSelect = {(event) => this.handleOnChangeInternalDropDown(event,"Thresh2Value")}>
                                <Dropdown.Toggle variant="success" id="dropdown-basic" data-testid="Thresh2Value">
                                    {this.handleRenderOptionsTitle(this.props.dropDownValues["Thresh2Value"])}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    {this.handleRenderOptions(["2", "3", "4", "5", "6"])}
                                </Dropdown.Menu>
                            </Dropdown>
                        

                        </div>
                        
                    </div> 
                    {/* alerts */}
                    <div className = "option-container">
                        <div className = "col-md-6 form-dropdown-elements-container">
                            
                            {this.handleRenderAlert("ShotDuration2Value", this.props.alertTexts["ShotDuration2Value"])}
                        </div>
                        <div className = "col-md-6 form-dropdown-elements-container">
                        
                            {this.handleRenderAlert("Thresh2Value", this.props.alertTexts["Thresh2Value"])}
                        </div>
                    </div>
                </div>           
            )
            
        }
        else if(userDropDownValue === "Absolute Frame Difference (LUV)"){
            return(
                <div className = "option-container-outer">
                    <div className = "option-container">
                        <div className = "col-md-12 form-dropdown-elements-container">
                            <br/>
                            <br/>
                            <br/>
                            <span className = "dropdown-elements-title">Selection Method: </span>

                            <Dropdown onSelect = {(event) =>this.handleOnChangeInternalDropDown(event,"Method3Value")}>
                                <Dropdown.Toggle variant="success" id="dropdown-basic" data-testid="Method3Value">
                                    {this.handleRenderOptionsTitle(this.props.dropDownValues["Method3Value"])}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    {this.handleRenderOptions(["Local Maxima", "Thresholding"])}
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    </div>
                    {/* alerts */}
                    <div className = "option-container">
                    
                        <div className = "col-md-12 form-dropdown-elements-container">
                            
                            {this.handleRenderAlert("Method3Value", this.props.alertTexts["Method3Value"])}
                        </div>
                    </div>
                    
                </div>
            )
            
            
        }
        else if(userDropDownValue === "K-Means Clustering"){
            return(
                <div className = "option-container-outer">
                    <div className = "option-container">
                        <div className = "col-md-6 form-dropdown-elements-container">
                            <span className = "dropdown-elements-title">Sampling Rate: </span>
                            <Dropdown onSelect = {(event) =>this.handleOnChangeInternalDropDown(event, "SamplingRate4Value")}>
                                <Dropdown.Toggle variant="success" id="dropdown-basic" data-testid="SamplingRate4Value">
                                    {this.handleRenderOptionsTitle(this.props.dropDownValues["SamplingRate4Value"])}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    {this.handleRenderOptions(["1","2","3", "4", "5","8", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55", "60", "65", "70", "75", "80", "85", "90", "100"])}
                                </Dropdown.Menu>
                            </Dropdown>
                            
                        </div>

                        <div className = "col-md-6 form-dropdown-elements-container">
                            <span className = "dropdown-elements-title">Centriod Percentage: </span>
                            <Dropdown onSelect = {(event) =>this.handleOnChangeInternalDropDown(event, "CentroidPercent4Value")}>
                                <Dropdown.Toggle variant="success" id="dropdown-basic"  data-testid="CentroidPercent4Value">
                                    {this.handleRenderOptionsTitle(this.props.dropDownValues["CentroidPercent4Value"])}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    {this.handleRenderOptions(["10", "20", "30", "40", "50", "60", "70", "80", "90"])}
                                </Dropdown.Menu>
                            </Dropdown>
                            
                        </div>
                    </div>    
                    {/* alerts */}
                    <div className = "option-container">
                        <div className = "col-md-6 form-dropdown-elements-container">
                           
                            {this.handleRenderAlert("SamplingRate4Value", this.props.alertTexts["SamplingRate4Value"])}
                        </div>
                        <div className = "col-md-6 form-dropdown-elements-container">
                           
                            {this.handleRenderAlert("CentroidPercent4Value", this.props.alertTexts["CentroidPercent4Value"])}
                        </div>
                    </div>    
                </div>        
            )
            
        }
        else if(userDropDownValue === "Dynamic Clustering"){
            return(
                <div className = "option-container-outer">
                    <div className = "option-container">
                        <div className = "col-md-6 form-dropdown-elements-container">
                            <span className = "dropdown-elements-title">Cosine Similarity Threshold: </span><br />
                            <InputGroup  className = "input-text-form">
                                <FormControl aria-label="Text input" 
                                data-testid="CosThresh5Value"
                                onChange = {(event) =>this.handleOnChangeTextBoxInternal(event, "CosThresh5Value")}
                                value = {this.props.dropDownValues["CosThresh5Value"]}
                                />
                            </InputGroup>
                           
                        </div>
                        <div className = "col-md-6 form-dropdown-elements-container">
                            <span className = "dropdown-elements-title">Minimum Shot Duration: </span><br />
                            <InputGroup  className = "input-text-form">
                                <FormControl aria-label="Text input" 
                                 data-testid="ShotDuration5Value"
                                onChange = {(event) =>this.handleOnChangeTextBoxInternal(event, "ShotDuration5Value")}
                                value = {this.props.dropDownValues["ShotDuration5Value"]}
                                />
                            </InputGroup>
                           
                        </div>
                        
                    </div>    
                    {/* alerts */}
                    <div className = "option-container">
                        <div className = "col-md-4 form-dropdown-elements-container">
                            
                            {this.handleRenderAlert("CosThresh5Value", this.props.alertTexts["CosThresh5Value"])}
                        </div>
                        <div className = "col-md-4 form-dropdown-elements-container">
                           
                            {this.handleRenderAlert("ShotDuration5Value", this.props.alertTexts["ShotDuration5Value"])}
                        </div> 
                    </div>    
                </div>        
            )
            
        }
        else if(userDropDownValue === "PyAV (Lib)"){
            return(
                <div>
                    <p>PyAv is one of the python libraries that has functions for direct key-frame extraction. Click on Extract Keyframes to see the results of the PyAV library. </p>
               </div>
            )
        }
        else{
            return(
                <div>
                    <p>Please Select a Method to Proceed</p>
                </div>            
            )
            
        }
        
    }

    // displays the options menu for the dropdown
    handleRenderOptions(options){
        let numOptions = options.length
        let returnElements = []
        for(let index = 0;index < numOptions;index++){
            returnElements.push(
                <Dropdown.Item 
                    href= {'#/' + String(options[index])}
                    key = {String(options[index]) + "_keyValue001"}   // the key is so the JS can distinguish between different child elements
                >
                   <span data-testid={options[index] + "_options"}>{options[index]}</span>
                </Dropdown.Item>
            )
        }
        return returnElements
    }

    // Displays the title for the dropdown
    handleRenderOptionsTitle(titleValue){
        if(titleValue == ""){
            return "Choose an Option  "
        }
        else{
            return titleValue
        }
    }
   
    // component to be rendered 
    render(){
        return (
            <div>
                <center>
                    <div className = "main-dropdown-method-container">
                        <div className="dropdown-elements-title">
                            <span>Choose a Key-Frame Selection Method: </span>
                        </div>
                        <div className = "top-dropdown-container" >
                            <Dropdown onSelect = {this.handleOnChangeDropDown}>
                                <Dropdown.Toggle variant="primary" id="dropdown-basic" data-testid="mainDropDown">
                                    {this.handleRenderOptionsTitle(this.props.dropDownSelectedValue)}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    {this.handleRenderOptions(["Uniform Sampling + Histogram Comparison", "Absolute Histogram Difference", "Absolute Frame Difference (LUV)", "K-Means Clustering", "Dynamic Clustering", "PyAV (Lib)"])}
                                </Dropdown.Menu>
                            </Dropdown>
                            <a href = "#cardComponentScrollTo" className="drop-down-right-icon " title = "Which to Choose?">
                                <i className="fa fa-info-circle icon_colour"></i>
                            </a>
                        </div>
                        
                    </div>
                </center>
                {this.handleRenderAlert("mainDropDown", "This dropdown cannot be left blank.")}
                <br />
                {this.handleRenderComponentOnDropDown()}
                <br />
            </div>
            
        )
    }
}

export default DropDownComp;
