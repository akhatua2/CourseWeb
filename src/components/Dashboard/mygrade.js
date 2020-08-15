import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import SignedInLinks from './SignedInLinks'
import firebase from '../firebase'

export default class MyGrade extends React.Component {
    state = {
        grade: {},
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
    
            axios.get(`http://127.0.0.1:8000/davematthews/grade/`, { params: get_body}, { headers: headers})
            .then(res => {
                console.log(res.data)
                const grade = res.data;
                this.setState({ grade });
            })

        }

    }
    
    render() {
        return (
            <div>
                <h5>Current grade: <b>{this.state.grade.grade}%</b></h5>
                <hr style = {{ marginBottom: 15, }}></hr>
            </div>
        )
    }

}