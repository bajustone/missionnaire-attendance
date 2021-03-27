import style from './style';
import FormInput from "../../components/form-input";
import MissionnaireLogo from "../../assets/icons/missionnaire.png";
import Form from '../../components/form-component';
import viewEye from "../../assets/icons/visibility-24px.svg";
import viewEyeClose from "../../assets/icons/visibility_off-24px.svg";
import LoadingBar from '../../components/loading';


import { Component } from 'preact';
import { FireApp } from "../../firestore";

export default class Login extends Component {
    state = {
        loginFormValue: {},
        passwordTextType: "password",
        user: null,
        isLoading: false
    };
    signIn(value) {
        this.setState({ isLoading: true });
        FireApp.auth().signInWithEmailAndPassword(value.username, value.password)
            .then(user => {
                
                if (!user)
                    alert("Invalid name or password");
            }).catch(err=>{
                alert("Invalid name or password");
                this.setState({isLoading: false})
            });

    }
    userChanged(user) {
        this.setState({ user, isLoading: false });

        if (user) {
            window.history.replaceState({}, null, "/list");
            window.history.go();
        }

    }
    componentDidMount() {
        document.title = "Attendance app";
        FireApp.auth().onAuthStateChanged(user => this.userChanged(user));
    }
    showPassword(input) {

        if (this.state.passwordTextType == "text") {
            this.setState({ passwordTextType: "password" });

        } else {

            this.setState({ passwordTextType: "text" });
        }
    }
    render(props, { loginFormValue, passwordTextType, isLoading }) {
        return <div className="appSection">
            <LoadingBar className={style.loadingBar} visible={isLoading} />
            <div className={`formSection borderedForm loginPage `}>
                <div>
                    <img src={MissionnaireLogo} width="160" />
                </div>
                <h2>Kwinjira</h2>

                <Form method="post" onSubmit={evt => this.signIn(evt)}>
                    <div>
                        <FormInput name="username" id="username" label="Username" type="email" required value={loginFormValue.username} />
                        <FormInput name="password" id="password" prefixIcon={passwordTextType == "text" ? viewEyeClose : viewEye} onPrefixButtonClick={input => { this.showPassword(input) }} label="Password" type={passwordTextType} autocomplete="off" required value={loginFormValue.password} />
                        <div className={`formControlsSection ${style.alignRight}`}>
                            <button disabled={isLoading} className="defaultButton filled" type="submit">SIGN IN</button>
                        </div>
                    </div>
                </Form>
            </div>
        </div>
    }
}