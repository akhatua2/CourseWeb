import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import firebase from '../firebase'
import { Typography, Paper, Avatar, CircularProgress, Button } from '@material-ui/core'


export default class Sections extends React.Component {
    state = {
        sections: []
      }

    reloadTheThing() {
        window.location.reload();
    }

    Breh(section_id) {
		try {
            
            var user = firebase.auth.currentUser;

            if (user) {

                const add_data = {
                    user: user.uid,
                    section: section_id
                };
        
                const headers = {
                'Content-Type': 'application/json',
                }
            
                axios.post("http://059ed99e2114.ngrok.io/davematthews/add/", add_data, { headers: headers})
                .then(res => {
                    console.log(res.data);
                }).then(this.reloadTheThing)

            } else {
                console.log("L");
            }

		} catch(error) {
            console.log("BACKK  BABYYYY")
			alert(error.message)
		}
	}
    
    componentDidMount() {
        console.log("BRREEEEEEEHhhh");
        var user = firebase.auth.currentUser;

        if (user) {
            
            const headers = {
                'Content-Type': 'application/json',
            }

            const get_body = {
                'user': user.uid,
            };
    
            axios.get(`http://059ed99e2114.ngrok.io/davematthews/allcourses/`, { params: get_body}, { headers: headers})
            .then(res => {
                const sections = res.data;
                console.log(sections);
                // this.state.courses = courses;
                this.setState({sections});
            })

        }

    }
    
    render() {
        return (
            <div>
                <ul>
                    { this.state.sections.map(section => 
                    <li>
                        <div style={{ marginBottom:20 }}>
                        <hr></hr>
                        <h6>{section.course} - <i>Section {section.section}</i></h6>

                        <Button
                            type="submit"
                            onClick={() => { this.Breh(section.id) }}
                            variant="contained">
                            ADD
                        </Button>
                        </div>

                    </li>)}
                </ul>
            </div>
        )
    }

}