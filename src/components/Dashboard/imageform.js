import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import SignedInLinks from './SignedInLinks'
import firebase from '../firebase'
import { Typography, Paper, Avatar, CircularProgress, Button } from '@material-ui/core'


export default class ImageForm extends React.Component {

  constructor(props) {
    super(props);
    this.state.ws_id = props.ws_id;
  }

    state = {
      title: 'def',
      image: null,
    }

    reloadTheThing() {
      window.location.reload();
    }
  
    handleTitleChange = event => {
      this.setState({ title: event.target.value });
    }

    handleImageChange = event => {
        console.log(event.target.files[0]);
        this.setState({image:event.target.files[0]});
    }
  
    handleSubmit = event => {
      event.preventDefault();

      var user = firebase.auth.currentUser;

      if (user) {
        console.log(user.uid);
        console.log(this.state.ws_id);
        console.log("http://7d414f476251.ngrok.io/davematthews/grade/ws/" + this.state.ws_id + "/");

        const formData = new FormData();
        formData.append('title',this.state.title);
        formData.append('image',this.state.image);
        formData.append('user',user.uid);


        const headers = {
          'Content-Type': 'multipart/form-data',
        }
    
        axios.post("http://7d414f476251.ngrok.io/davematthews/grade/ws/" + this.state.ws_id + "/", formData, { headers: headers})
          .then(res => {
            console.log(res);
            console.log(res.data);
        })
        
      } else {
        console.log("L");
      }


    }
  
    render() {
      return (
        <div>
          <form onSubmit={this.handleSubmit}>

            <label class="required" for="id_image">Image:</label>
            <input type="file" name="image" accept="image/*" required="" id="id_image" onChange={this.handleImageChange}/>

            <Button
              type="submit"
              color="secondary"
              variant="contained">
              Submit
          	</Button>
            {/* <button type="submit">Submit</button> */}

          </form>
        </div>
        )
    }
}