import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import SignedInLinks from './SignedInLinks'
import firebase from '../firebase'
import { Typography, Paper, Avatar, CircularProgress, Button } from '@material-ui/core'

export default class Form extends React.Component {

    constructor(props) {
      super(props);
      this.state.frq_id = props.frq_id;
    }

    state = {
      title: 'def',
      content: '',
    }

    reloadTheThing() {
      window.location.reload();
    }
  
    handleTitleChange = event => {
      this.setState({ title: event.target.value });
    }

    handleContentChange = event => {
        this.setState({ content: event.target.value });
    }
  
    handleSubmit = event => {
      event.preventDefault();

      var user = firebase.auth.currentUser;

      if (user) {
        console.log(user.uid);
        console.log(this.state.frq_id);
        console.log("http://059ed99e2114.ngrok.io/davematthews/grade/frq/" + this.state.frq_id + "/"); 

        const submission = {
          title: this.state.title,
          content: this.state.content,
          user: user.uid,
        };
  
        const headers = {
          'Content-Type': 'application/json',
        }
    
        axios.post("http://059ed99e2114.ngrok.io/davematthews/grade/frq/" + this.state.frq_id + "/", submission, { headers: headers})
          .then(res => {
            console.log(res);
            console.log(res.data);
          }).then(this.reloadTheThing)


      } else {
        console.log("L");
      }
  
    }
  
    render() {
      return (
        
        <div>
          <form onSubmit={this.handleSubmit}>

            {/* <label class="required" for="id_title">Title:</label>
            <input type="text" name="title" class="vTextField" maxlength="100" required="" id="id_title" onChange={this.handleTitleChange}/> */}

            <label class="required" for="id_content">Content:</label>
            <textarea name="content" cols="40" rows="10" class="vLargeTextField" required="" id="id_content" onChange={this.handleContentChange}></textarea>

            <div style={{textAlign: 'right', alignSelf: 'stretch'}}>
            <Button
              type="submit"
              color="secondary"
              variant="contained">
              Submit
          	</Button>
            </div>

            {/* <button type="submit">Submit</button> */}

          </form>
        </div>
    )
    }
}