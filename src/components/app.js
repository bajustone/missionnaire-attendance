import { h, Component } from 'preact';
import { Router } from 'preact-router';

// Code-splitting is automated for routes
import AttandanceList from '../routes/attandance-list';
import Attended from '../routes/attended';
import RegistrationPage from '../routes/registration-page';
import Login from '../routes/login';

export default class App extends Component {
	
	
	/** Gets fired when the route changes.
	 *	@param {Object} event		"change" event from [preact-router](http://git.io/preact-router)
	 *	@param {string} event.url	The newly routed URL
	 */
	handleRoute = e => {
		this.currentUrl = e.url;
	};

	render() {
		return (
			<div id="app">
				<Router onChange={this.handleRoute}>
					<Login path="/"  />
					<AttandanceList path="/list" />
					<Attended path="/attended" />
					<RegistrationPage path="/register" />
					<Login path="/login" />
				</Router>
			</div>
		);
	}
}
