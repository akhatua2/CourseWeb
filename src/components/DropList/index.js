import React, { useEffect, useState } from 'react'
import { Typography, Paper, Avatar, CircularProgress, Button } from '@material-ui/core'
import VerifiedUserOutlined from '@material-ui/icons/VerifiedUserOutlined'
import withStyles from '@material-ui/core/styles/withStyles'
import firebase from '../firebase'
import { withRouter, BrowserRouter } from 'react-router-dom'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
// import React, { useEffect, useState } from 'react'
// // import {text} from './classes'
// import { Dropdown } from 'semantic-ui-react'
// import { Typography, Paper, Avatar, CircularProgress, Button } from '@material-ui/core'
// import VerifiedUserOutlined from '@material-ui/icons/VerifiedUserOutlined'
// import withStyles from '@material-ui/core/styles/withStyles'
// import firebase from '../../firebase'
// import { withRouter, BrowserRouter } from 'react-router-dom'
// import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
// import CustomTable from './table'
// import MyGrade from './mygrade'
// import GradeDist from '../GradePage'
import axios from 'axios'

var listOfClasses = [];

// function lineCount( text ) {
//     var nLines = 0;
//     for( var i = 0, n = text.length;  i < n;  ++i ) {
//         if( text[i] === '\n' ) {
//             ++nLines;
//         }
//     }
//     return nLines;
// }

// const DropList = () => {
//     // var numLines = lineCount(text);
//     return (
//         <h1>Hello</h1>
//     )
// }


const styles = theme => ({
	main: {
		width: 'auto',
		display: 'block', // Fix IE 11 issue.
		marginLeft: theme.spacing.unit * 3,
		marginRight: theme.spacing.unit * 3,
		[theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
			width: 400,
			marginLeft: 'auto',
			marginRight: 'auto',
		},
	},
	paper: {
		marginTop: theme.spacing.unit * 8,
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
	},
	avatar: {
		margin: theme.spacing.unit,
		backgroundColor: theme.palette.secondary.main,
	},
	submit: {
		marginTop: theme.spacing.unit * 3,
	},
})

function DropList(props) {

	console.log("Change");
	const { classes } = props
	// const [country, setCountry] = useState('')

	// useEffect(() => {
	// 	if(firebase.getCurrentUsername()) {
	// 		firebase.getCurrentUserCountry().then(setCountry)
	// 	}
	// }, [firebase.getCurrentUsername(), firebase.getCurrentUserCountry()])

	return (
		<main className={classes.main} style={{ paddingBottom: 200 }}>
			<BrowserRouter>
			</BrowserRouter>

			<Button
				type="submit"
				fullWidth
				variant="contained"
				onClick={logout}
				className={classes.submit}>
				Logout
          	</Button>

			<div style={{ marginTop: 30, marginBottom: -10 }}>
				<h6>Welcome, { firebase.getCurrentUsername() }</h6>
			</div>

			{/* <MyGrade /> */}
			<Button
				type="submit"
				fullWidth
				variant="contained"
				onClick={dashreturn}
				className={classes.submit}>
				Back to Dashboard!
          	</Button>
{/* 
			<div style={{ marginTop: 40}}>
				<h5><strong>Your Sections</strong></h5>
				<Courses />
			</div>

			<div style={{ marginTop: 40}}>
				<h5><strong>TODO Assignments</strong></h5>
				<WorkDue />
			</div>

			{/* <h3>All Assignments</h3>
			<Assignments /> */}
			{/* <div style={{ marginTop: 40}}>
				<h5><strong>Your Submissions</strong></h5>
				<Submissions />
			</div> */}

			{/* <h3>FRQ Submission</h3>
			<Form frq_id='10'/>

			<h3>Upload Submission</h3>
			<ImageForm ws_id='6'/>	 */}
			{/* <Paper className={classes.paper}>
				<Avatar className={classes.avatar}>
					<VerifiedUserOutlined />
				</Avatar>
				<Typography component="h1" variant="h5">
					Hello { firebase.getCurrentUsername() }
				</Typography>

			</Paper> */}
		</main>
	) 

	async function logout() {
		await firebase.logout()
		props.history.push('/')
	}

	async function dashreturn() {
		try {
            console.log("BACKK")
            if(firebase.auth.currentUser != null) {
                console.log("WOOOOOO")
                props.history.replace('/dashboard')
            }
            else {
                props.history.push('/')
            }
		} catch(error) {
            console.log("BACKK  BABYYYY")
			alert(error.message)
		}
	}
}

export default withRouter(withStyles(styles)(DropList))
