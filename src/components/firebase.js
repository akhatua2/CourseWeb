import app from 'firebase/app'
import 'firebase/auth'
import 'firebase/firebase-firestore'

const config = {
	apiKey: "AIzaSyCy4CEw_-p-zwId4S9lJcPHoS4LfIRF968",
	authDomain: "courseloop-95744.firebaseapp.com",
	databaseURL: "https://courseloop-95744.firebaseio.com",
	projectId: "courseloop-95744",
	storageBucket: "courseloop-95744.appspot.com",
	messagingSenderId: "896111699616"
}


class Firebase {
	constructor() {
		app.initializeApp(config)
		this.auth = app.auth()
		this.db = app.firestore()
	}

	login(email, password) {
		return this.auth.signInWithEmailAndPassword(email, password)
	}

	logout() {
		return this.auth.signOut()
	}

	async register(name, email, password) {
		await this.auth.createUserWithEmailAndPassword(email, password)
		return this.auth.currentUser.updateProfile({
			displayName: name
		})
	}

	addCountry(country) {
		if(!this.auth.currentUser) {
			return alert('Not authorized')
		}

		return this.db.doc(`users/${this.auth.currentUser.uid}`).set({
			country
		})
	}

	isInitialized() {
		return new Promise(resolve => {
			this.auth.onAuthStateChanged(resolve)
		})

	}

	getCurrentUsername() {
		return this.auth.currentUser && this.auth.currentUser.displayName
	}

	async getCurrentUserCountry() {
		const country = await this.db.doc(`users/${this.auth.currentUser.uid}`).get()
		return country.get('country')
	}
}

export default new Firebase()
