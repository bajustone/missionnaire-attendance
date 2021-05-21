import { h, Component, createRef } from 'preact';
import Header from "../../components/header";
import FormInput from "../../components/form-input";
import Form from "../../components/form-component";
import style from './style';
import LoadingBar from '../../components/loading';

import {AppDB, FireApp} from "../../firestore";


export default class RegistrationPage extends Component {
	state = {
		registrationAPI: "regitration api endpoint",
		isSubmiting: false,
		registrationFormValue: {},
		formSectionIndex: 0,
		user: null

	};
	ref = createRef();
	userChanged(user){
        this.setState({user: user});
        // if(!user){
        //     window.history.replaceState({},null, "/login");
        //     window.history.go();
		// }
	}
	componentDidMount(){
		if(!this.ref.current) return;
		const formSection = this.ref.current.querySelectorAll(`.${style.formSection}`)[1]

		let borderedForm = this.ref.current.querySelector(`.borderedForm`);
		const {height} = formSection.getBoundingClientRect();
		borderedForm.style.height = `${height + 92}px`;
		FireApp.auth().onAuthStateChanged(user=>this.userChanged(user));
	}

	async submitRegistration(value) {
		if (!value.names || !value.nidNumber) return;
		
		this.setState({ isSubmiting: true });
		const docRef = AppDB.collection("amateraniro_logs").doc(value.nidNumber);
		await docRef.set({
			...value,
			registrationTime: new Date()
		});
		alert("Kwiyandikisha byagenze neza");
		this.setState({ formSectionIndex: 0, isSubmiting: false, registrationFormValue: {} });
	}

	render( props, {user, registrationAPI, registrationFormValue, formSectionIndex, isSubmiting }) {
		return (
			<div className="appSection" ref={this.ref}>
				<Header user={user} path={props.path}/>

				<div className="formSection borderedForm">
				<LoadingBar className={style.loadingBar} visible={isSubmiting}/>

					<h2>Kwiyandikisha kujya mu materaniro</h2>
					{this.registrationFormComponent(registrationAPI, registrationFormValue, formSectionIndex)}
				</div>
			</div>
		);
	}
	onUpdateFormValue(value) {
		this.setState({ registrationFormValue: value });
	}

	changeFormSection(index){
		this.setState({formSectionIndex: index});
		if(index==1){
			const akarereElt = this.ref.current.querySelector("input[name=akarere]");
			if(!akarereElt) return;
			akarereElt.focus();
		}
		if(index==0){
			const akarereElt = this.ref.current.querySelector("input[name=names]");
			if(!akarereElt) return;
			akarereElt.focus();
		}
	}
	registrationFormComponent(registrationAPI, registrationFormValue, formSectionIndex) {
		return <Form action={registrationAPI} onSubmit={value => this.submitRegistration(value)} onUpdateFormValue={value => this.onUpdateFormValue(value)}>
			<div className={style.formComponent}>
				<div className={`${style.formSection} ${formSectionIndex == 0 ? style.current : ""}`}>
					<FormInput name="names" id="names" label="Amazina" autofocus required value={registrationFormValue.names ? registrationFormValue.names : ""} />
					<FormInput name="nidNumber" id="nidNumber" label="Numero y'indangamuntu" required inputmode="numeric" type="text" pattern="[0-9]{16}|[0-9]{3}-[0-9]{8}|[0-9]{16}-[0-9]{1}" value={registrationFormValue.nidNumber ? registrationFormValue.nidNumber : ""} />
					<FormInput name="telphoneNumber" id="telphoneNumber" label="Nomero ya telephoni" required type="tel" pattern="07[0-9]{8}" value={registrationFormValue.telphoneNumber ? registrationFormValue.telphoneNumber : ""} />
					<div className="formControlsSection alignRight">
						<button className="defaultButton filled" onClick={evt=>this.changeFormSection(1)} type="button" disabled={this.state.isSubmiting}>KOMEZA</button>
					</div>
				</div>
				<div className={`${style.formSection} ${formSectionIndex == 1 ? style.current : ""}`}>
					<FormInput name="akarere" id="akarere" outofocus = {formSectionIndex == 1 ? true : false} label="Akarere" required value={registrationFormValue.akarere ? registrationFormValue.akarere : ""} />
					<FormInput name="umurenge" id="umurenge" label="Umurenge" required value={registrationFormValue.umurenge ? registrationFormValue.umurenge : ""} />
					<FormInput name="akagari" id="akagari" label="Akagari" required value={registrationFormValue.akagari ? registrationFormValue.akagari : ""} />
					<FormInput name="umudugudu" id="umudugudu" label="Umudugudu" required value={registrationFormValue.umudugudu ? registrationFormValue.umudugudu : ""} />
					<FormInput name="isibo" id="isibo" label="Isibo" value={registrationFormValue.isibo ? registrationFormValue.isibo : ""} />
					<div className="formControlsSection">
						<button className="defaultButton" onClick={evt=>this.changeFormSection(0)} type="button">SUBIRA INYUMA</button>
						<button className="defaultButton filled" type="submit" disabled={this.state.isSubmiting}>OHEREREZA</button>
					</div>
				</div>

			</div>
		</Form>;
	}
}
