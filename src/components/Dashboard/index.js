import React, { useEffect, useState } from 'react'
import { Typography, Paper, Avatar, CircularProgress, Button } from '@material-ui/core'
import VerifiedUserOutlined from '@material-ui/icons/VerifiedUserOutlined'
import withStyles from '@material-ui/core/styles/withStyles'
import firebase from '../firebase'
import { withRouter, BrowserRouter } from 'react-router-dom'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Navbar from './Navbar'
// import CustomTable from './table'
import Form from './form'
import ImageForm from './imageform'
import Submissions from './submissions'
import Courses from './courses'
import Assignments from './assignments'
import WorkDue from './workdue'
import MyGrade from './mygrade'
import SectionGrade from './sectiongrade'
import GradeDist from '../GradePage'
import DropList from '../DropList'
import axios from 'axios'
import { Dropdown } from 'semantic-ui-react'



const styles = theme => ({
	main: {
		width: 'auto',
		display: 'block', // Fix IE 11 issue.
		// marginLeft: theme.spacing.unit * 3,
		// marginRight: theme.spacing.unit * 3,
		[theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
			width: 600,
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

function Dashboard(props) {

	console.log("Change");
	const { classes } = props
	// const [country, setCountry] = useState('')

	// useEffect(() => {
	// 	if(firebase.getCurrentUsername()) {
	// 		firebase.getCurrentUserCountry().then(setCountry)
	// 	}
	// }, [firebase.getCurrentUsername(), firebase.getCurrentUserCountry()])




	return (
		<main className={classes.main} style={{ paddingTop: 50, paddingBottom: 200 }}>

			<h5>Welcome, <b>{ firebase.getCurrentUsername() }</b></h5>

			<Button
				type="submit"
				fullWidth
				variant="contained"
				onClick={logout}
				className={classes.submit}>
				Logout
          	</Button>

			<Button
				type="submit"
				fullWidth
				variant="contained"
				onClick={droplist}
				className={classes.submit}>
				Add Sections
          	</Button>
			 {/* const DropdownExampleSelection = () => (
  			<Dropdown
    			placeholder='Select Friend'
    			fluid
    			selection
    			options={gradedist}
  			/>
			)

export default DropdownExampleSelection */}
			
			{/* <MyGrade /> */}
			<Button
				type="submit"
				fullWidth
				variant="contained"
				onClick={gradedist}
				className={classes.submit}>
				More Grades
          	</Button>

			<div style={{ marginTop: 40 }}>
				<h5><strong>Your Sections</strong></h5>
				<Courses />
			</div>

			<div style={{ marginTop: 40 }}>
				<h5><strong>TODO Assignments</strong></h5>
				<WorkDue />
			</div>

			{/* <h3>All Assignments</h3>
			<Assignments /> */}
			<div style={{ marginTop: 40}}>
				<h5><strong>Your Submissions</strong></h5>
				<Submissions />
			</div>

			<Router>
				<Switch>
					<Route exact path="/gradedist" component={GradeDist} />
				</Switch>
			</Router>

			<Router>
				<Switch>
					<Route exact path="/droplist" component={DropList} />
				</Switch>
			</Router>

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

	async function gradedist() {
		try {
			// await firebase.login(email, password)
			props.history.replace('/gradedist')
		} catch(error) {
			alert(error.message)
		}
	}

	async function droplist() {
		try {
			// await firebase.login(email, password)
			props.history.replace('/droplist')
		} catch(error) {
			alert(error.message)
		}
	}
}

export default withRouter(withStyles(styles)(Dashboard))
