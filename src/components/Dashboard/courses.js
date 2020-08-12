import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import SignedInLinks from './SignedInLinks'
import firebase from '../firebase'

export default class Courses extends React.Component {
    state = {
        courses: []
      }
    
    componentDidMount() {
        console.log("BRREEEEEEEHhhh");
        var user = firebase.auth.currentUser;

        if (user) {
            
            const get_body = {
                'user': user.uid,
            };
    
            console.log(get_body);
            const headers = {
                'Content-Type': 'application/json',
            }
    
            axios.get(`http://7d414f476251.ngrok.io/davematthews/courses/`, { params: get_body}, { headers: headers})
            .then(res => {
                console.log(res.data)
                const courses = res.data;
                this.setState({ courses });
            })

        }

    }
    
    render() {
        return (
            <div>
                <ul>
                    { this.state.courses.map(course => 
                    <li>
                        {course.course} - Section {course.section} 
                        <hr></hr>
                    </li>)}
                </ul>
            </div>
        )
    }

}