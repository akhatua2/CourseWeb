import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import SignedInLinks from './SignedInLinks'
import firebase from '../firebase'

export default class Submissions extends React.Component {
    state = {
        submissions: []
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
    
            axios.get(`http://7d414f476251.ngrok.io/davematthews/submissions/`, { params: get_body}, { headers: headers})
            .then(res => {
                console.log(res.data)
                const submissions = res.data;
                this.setState({ submissions });
            })

        }

    }
    
    render() {
        return (
            <div>
                <ul>
                    { this.state.submissions.map(submission => 
                    <li>
                        {submission.asn_title} - {submission.points} points 
                        <div>
                            {submission.content}
                        </div>
                        <hr></hr>
                    </li>)}
                </ul>
            </div>
        )
    }

}