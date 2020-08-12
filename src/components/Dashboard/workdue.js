import React, {useState} from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import SignedInLinks from './SignedInLinks'
import firebase from '../firebase'
import Form from './form'
import ImageForm from './imageform'


export default class WorkDue extends React.Component {
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
    
            axios.get(`http://7d414f476251.ngrok.io/davematthews/workdue/`, { params: get_body}, { headers: headers})
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
                        ID:{assignment.id} - {assignment.type} - {assignment.title} - Total Points: {assignment.total_points} 
                        {assignment.type === 'FRQ' ? (<Form frq_id={assignment.id.toString()}/>) : 
                            (<ImageForm ws_id={assignment.id.toString()}/>) }
                        
{/*                         
                        if {assignment.type.toString()} == 'FRQ':
                            <Form frq_id={assignment.id.toString()}/>
                        else:
                            <ImageForm ws_id={assignment.id.toString()}/> */}
                        <hr></hr>
                    </li>)}
                </ul>
            </div>
        )
    }

}