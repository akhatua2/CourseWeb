import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import SignedInLinks from './SignedInLinks'


export default class ImageForm extends React.Component {
    state = {
      title: '',
      image: null,
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

      const formData = new FormData();
      formData.append('title',this.state.title);
      formData.append('image',this.state.image);

      const headers = {
        'Content-Type': 'multipart/form-data',
      }
  
      axios.post(`http://7d414f476251.ngrok.io/davematthews/grade/ws/6/`, formData, { headers: headers})
        .then(res => {
          console.log(res);
          console.log(res.data);
        })
    }
  
    render() {
      return (
        <div>
          <form onSubmit={this.handleSubmit}>

            <label class="required" for="id_title">Title:</label>
            <input type="text" name="title" class="vTextField" maxlength="100" required="" id="id_title" onChange={this.handleTitleChange}/>

            <label class="required" for="id_image">Image:</label>
            <input type="file" name="image" accept="image/*" required="" id="id_image" onChange={this.handleImageChange}/>

            <button type="submit">Submit</button>

          </form>
        </div>
        )
    }
}