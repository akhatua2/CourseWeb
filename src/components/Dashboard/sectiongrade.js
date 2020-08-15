import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import SignedInLinks from './SignedInLinks'
import firebase from '../firebase'

export default class SectionGrade extends React.Component {

    constructor(props) {
        super(props);
        this.state.section_id = props.section_id;
    }

    state = {
        grade: {},
    }
    
    componentDidMount() {
        console.log("THIS IS THE SECTION GRADE")
        console.log(this.state.section_id);
        var user = firebase.auth.currentUser;

        if (user) {
            
            const get_body = {
                'user': user.uid,
                'section': this.state.section_id
            };
    
            console.log(get_body);
            const headers = {
                'Content-Type': 'application/json',
            }
    
            axios.get(`http://127.0.0.1:8000/davematthews/sectiongrade/`, { params: get_body}, { headers: headers})
            .then(res => {
                console.log(res.data);
                const grade = res.data;
                this.setState({grade});
                console.log("BOIIIIII");
                console.log(this.state.grade.grade);
            })

        }

    }
    
    render() {
        return (
            <div>
                <h6><b>{this.state.grade.grade}%</b></h6>
            </div>
        )
    }

}