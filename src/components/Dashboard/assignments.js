import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import SignedInLinks from './SignedInLinks'
import firebase from '../firebase'

export default class Assignments extends React.Component {
    state = {
        assignments: []
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
    
            axios.get(`http://7d414f476251.ngrok.io/davematthews/assignments/`, { params: get_body}, { headers: headers})
            .then(res => {
                console.log(res.data)
                const assignments = res.data;
                this.setState({ assignments });
            })

        }

    }
    
    render() {
        return (
            <div>
                <ul>
                    { this.state.assignments.map(assignment => 
                    <li>
                        {assignment.title} - Total Points: {assignment.total_points} 
                        <hr></hr>
                    </li>)}
                </ul>
            </div>
        )
    }

}