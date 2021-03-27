import { h } from 'preact';
import { Link } from 'preact-router/match';
import style from './style.css';

import {FireApp} from "../../firestore";
class Header {
	logout(){
		FireApp.auth().signOut();
	}
	render(props, { }) {
		const { user, path } = props;
		let menuNav = <Link activeClassName={style.active} href="/list">Urutonde rw'abateranye</Link>;
		
		if(path=="/list"){
			menuNav = <Link activeClassName={style.active} href="/register">Kwiyandikisha</Link>;
		}
		return (<header className={style.header}>
			<div className={style.headerContents}>
			<h1>Missionnaire Net</h1>
			<nav>
				{user ? menuNav : <Link activeClassName={style.active} href="/login">Kwinjira</Link>}
				{user ? <button onClick={evt=>this.logout()} className="defaultButton filled logouBtn">Gusohoka</button> : null }
			</nav>
			</div>
		</header>);

	}
}

export default Header;
