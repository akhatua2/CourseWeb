import React from 'react'
import { Dropdown, Button } from 'semantic-ui-react'
import firebase from '../firebase'
import axios from 'axios'

/*
function printBtn() {
    for (var i = 0; i < countryOptions.length; i++) {
       var btn = document.createElement("button");
       var t = document.createTextNode(countryOptions[i]);
       btn.appendChild(t);
       document.body.appendChild(btn);
    }
}
*/


const allSections = [{ key: 'af', value: 'af', flag: 'af', text: 'Afghanistan' },
{ key: 'ax', value: 'ax', flag: 'ax', text: 'Aland Islands' },
{ key: 'al', value: 'al', flag: 'al', text: 'Albania' },
{ key: 'dz', value: 'dz', flag: 'dz', text: 'Algeria' },
{ key: 'as', value: 'as', flag: 'as', text: 'American Samoa' },
{ key: 'ad', value: 'ad', flag: 'ad', text: 'Andorra' },
{ key: 'ao', value: 'ao', flag: 'ao', text: 'Angola' },
{ key: 'ai', value: 'ai', flag: 'ai', text: 'Anguilla' },
{ key: 'ag', value: 'ag', flag: 'ag', text: 'Antigua' },
{ key: 'ar', value: 'ar', flag: 'ar', text: 'Argentina' },
{ key: 'am', value: 'am', flag: 'am', text: 'Armenia' },
{ key: 'aw', value: 'aw', flag: 'aw', text: 'Aruba' },
{ key: 'au', value: 'au', flag: 'au', text: 'Australia' },
{ key: 'at', value: 'at', flag: 'at', text: 'Austria' },
{ key: 'az', value: 'az', flag: 'az', text: 'Azerbaijan' },
{ key: 'bs', value: 'bs', flag: 'bs', text: 'Bahamas' },
{ key: 'bh', value: 'bh', flag: 'bh', text: 'Bahrain' },
{ key: 'bd', value: 'bd', flag: 'bd', text: 'Bangladesh' },
{ key: 'bb', value: 'bb', flag: 'bb', text: 'Barbados' },
{ key: 'by', value: 'by', flag: 'by', text: 'Belarus' },
{ key: 'be', value: 'be', flag: 'be', text: 'Belgium' },
{ key: 'bz', value: 'bz', flag: 'bz', text: 'Belize' },
{ key: 'bj', value: 'bj', flag: 'bj', text: 'Benin' },];

function makeButton(data) {
    return (
        <div>

        <button>
            {data.text}
        </button>
        </div>
    );
}

export default class DropCourses extends React.Component {
    constructor(props) {
        super(props);
        this.state.course = props.course;
      }
  
      state = {
        selectedCourse: '',
      }

      handleCourseChange = event => {
        this.setState({ selectedCourse : event.target.value });
      }

      handleSubmit = event => {
          console.log("Submitted");
      }

      /*
      handleSubmit = (courseName) => {
  
        var user = firebase.auth.currentUser;
  
        if (user) { 
          console.log(user.uid);
          console.log("http://059ed99e2114.ngrok.io/davematthews/add/" + courseName + "/"); 
  
          const submission = {
            user: user.uid,
            section: courseName,
          };
    
          const headers = {
            'Content-Type': 'application/json',
          }
      
          axios.post("http://059ed99e2114.ngrok.io/davematthews/add/", submission, { headers: headers})
            .then(res => {
              console.log(res);
              console.log(res.data);
            }).then(this.reloadTheThing)
  
  
        } else {
          console.log("L");
        }
    
      }
      */

render() {
    return(
        <div>

            {/* <label class="required" for="id_title">Title:</label>
            <input type="text" name="title" class="vTextField" maxlength="100" required="" id="id_title" onChange={this.handleTitleChange}/> */}

            <label class="required" for="id_content">Course:</label>
                <Dropdown
                id='id_content'
                placeholder='Select Country'
                fluid
                search
                selection
                options={allSections.map(makeButton, this)}
                //onChange={this.handleCourseChange}
            
            />

            <div style={{textAlign: 'right', alignSelf: 'stretch'}}>
            <Button
              type="submit"
              color="secondary"
              variant="contained">
              Search
          	</Button>
            </div>

            {/* <button type="submit">Submit</button> */}
        </div>
    )
}
}