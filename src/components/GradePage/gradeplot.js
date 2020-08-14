import React, {setState} from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import SignedInLinks from '../Dashboard/SignedInLinks'
import firebase from '../firebase'

export default class GradePlot extends React.Component {

    state = {
        gradedata: []
      }
    
    componentDidMount() {
        console.log("BRREEEEEEEHhhh");
        var user = firebase.auth.currentUser;

        if (user) {

            const headers = {
                'Content-Type': 'application/json',
            }
    
            axios.get(`http://059ed99e2114.ngrok.io/davematthews/studentgrades/bio101-5B/`, { headers: headers})
            .then(res => {
                console.log(res.data)
                const gradedata = res.data;
                this.setState({ gradedata });
                console.log("WOOOOOOOOO", this.state.gradedata);
                console.log("PEACE", this.state.gradedata.gradedata);
            })
        }
    }
    
    render() {
        var gl = this.state.gradedata;
        console.log("RUNNing", gl)
        
        return (
            <div>
                <ul>
                    { this.state.gradedata != [] ? (this.state.gradedata.map(gradedataelem => 
                    <li style = {{ marginBottom : 15, }} >
                        <hr style = {{ marginBottom: 15, }}></hr>
                        <b>{gradedataelem.id}</b> 
                        <div>
                            {gradedataelem.grade}
                        </div>
                    </li>)) : (<h6> No Graph Data</h6>)}
                </ul>
            </div>
        )
    }

}