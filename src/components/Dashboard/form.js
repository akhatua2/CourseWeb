import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import SignedInLinks from './SignedInLinks'


export default class Form extends React.Component {
    state = {
      title: '',
      content: '',
    }
  
    handleTitleChange = event => {
      this.setState({ title: event.target.value });
    }

    handleContentChange = event => {
        this.setState({ content: event.target.value });
      }
  
    handleSubmit = event => {
      event.preventDefault();
  
      const submission = {
        title: this.state.title,
        content: this.state.content
      };

      const headers = {
        'Content-Type': 'application/json',
      }
  
      axios.post(`http://7d414f476251.ngrok.io/davematthews/grade/frq/11/`, submission, { headers: headers})
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

            <label class="required" for="id_content">Content:</label>
            <textarea name="content" cols="40" rows="10" class="vLargeTextField" required="" id="id_content" onChange={this.handleContentChange}></textarea>

            <button type="submit">Submit</button>

          </form>
        </div>
    )
    }
}