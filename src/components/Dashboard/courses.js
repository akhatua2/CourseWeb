import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import SignedInLinks from './SignedInLinks'
import firebase from '../firebase'
import SectionGrade from './sectiongrade'

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
                const courses = res.data;
                console.log("BSDJFLSADJFLKSJADLFKJSDJK")
                console.log(courses);
                // this.state.courses = courses;
                this.setState({courses});
            })

        }

    }
    
    render() {
        return (
            <div>
                <ul>
                    { this.state.courses.map(course => 
                    <li>
                        <hr></hr>
                        <h6>{course.course} - <i>Section {course.section}</i></h6>
                        <div style={{ marginTop: -7.5, marginBottom: 10 }}>
                            <SectionGrade section_id={course.id}/>
                        </div>
                    </li>)}
                </ul>
            </div>
        )
    }

}