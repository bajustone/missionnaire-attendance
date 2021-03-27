import { h, Component } from 'preact';
import Header from "../../components/header";
import style from './style';
import { DataTable, ColDef } from '../../components/data-table';

import {AppDB, FireApp} from "../../firestore";

class AttandanceList extends Component {
    state = {
        data: [],
        user: null
    };
    userChanged(user){
        this.setState({user: user});
        if(!user){
            window.history.replaceState({},null, "/login");
            window.history.go();
        }


        AppDB.collection("amateraniro_logs")
        .orderBy("registrationTime", "desc")
        .onSnapshot(snap=>{
           const docsData = snap.docs.map(doc=>{
               return {
                   ...doc.data(),
                   registrationTime: doc.data().registrationTime.toDate().toLocaleString()
               };
           });
           this.setState({data: docsData});
        });
	}
    componentDidMount(){
        document.title = "Attendance app";
        FireApp.auth().onAuthStateChanged(user=>this.userChanged(user));

    }
    rowDef(data, index){
        return <tr>
            <td>{index + 1}</td>
            <td>{data.names}</td>
            <td>{data.nidNumber}</td>
            <td>{data.telphoneNumber}</td>
            <td>{data.akarere}</td>
            <td>{data.umurenge}</td>
            <td>{data.akagari}</td>
            <td>{data.umudugudu}</td>
            <td>{data.isibo}</td>
            <td>{data.registrationTime}</td>
        </tr>;
    }
    render(props, state) {
        return (
            <div className={`appSection ${style.attanceListPage}`}>
                <div className={`${!state.user ? style.hideContent : ""}`}>
                    <Header user={state.user} path={props.path} />
                    <h1>Attendance list</h1>
                    <DataTable data={state.data} showRowNumbers rowDef={this.rowDef}>
                        <ColDef name="names">Amazina</ColDef>
                        <ColDef name="nidNumber">NID</ColDef>
                        <ColDef name="telphoneNumber">Tel</ColDef>
                        <ColDef name="akarere">Akarere</ColDef>
                        <ColDef name="umurenge">Umurenge</ColDef>
                        <ColDef name="akagari">Akagari</ColDef>
                        <ColDef name="umudugudu">Umudugudu</ColDef>
                        <ColDef name="isibo">Isibo</ColDef>
                        <ColDef name="registrationTime">Itariki</ColDef>
                    </DataTable>
                </div>
            </div>
        );
    }
}

export default AttandanceList;
