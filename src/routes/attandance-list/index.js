import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks'
import Header from "../../components/header";
import style from './style';
import { DataTable, ColDef } from '../../components/data-table';
import { AppDB, FireApp } from "../../firestore";

<<<<<<< Updated upstream
import { AppDB, FireApp } from "../../firestore";

class AttandanceList extends Component {
    state = {
        data: [],
        user: null,
        allowDeleteAction: false,
        selectedRows: new Map()
    };
    constructor() {
        super();
        this.rowDef = this.rowDef.bind(this);
    }
    userChanged(user) {
        this.setState({ user: user });
=======
function AttandanceList(props) {

    const [data, setData] = useState([])
    const [user, setUser] = useState()
    const [selectedRows, setSelectedRows] = useState(new Map())
    const [allowDeleteAction, setAllowDeleteAction] = useState(false)


    const userChanged = (user) => {
        setUser(user);
>>>>>>> Stashed changes
        if (!user) {
            window.history.replaceState({}, null, "/login");
            window.history.go();
        }


        AppDB.collection("amateraniro_logs")
            .orderBy("names", "asc")
            .orderBy("registrationTime", "desc")
            .onSnapshot(snap => {
                const docsData = snap.docs.map(doc => {
                    const docId = doc.id;
                    const docPath = doc.ref.path;
                    return {
                        ...doc.data(),
                        docId,
                        docPath,
                        registrationTime: doc.data().registrationTime.toDate().toLocaleString()
                    };
                });
<<<<<<< Updated upstream
                this.setState({ data: docsData });
            });
    }
    componentDidMount() {
        document.title = "Attendance app";
        FireApp.auth().onAuthStateChanged(user => this.userChanged(user));

    }
    selectRow(row) {
        const rowId = row.docId;
        if (this.state.selectedRows.has(rowId)) {
            this.state.selectedRows.delete(rowId);
        } else {
            this.state.selectedRows.set(rowId, row);
=======
                setData(docsData);
            });
    }
    useEffect(() => {
        document.title = "Attendance app";
        FireApp.auth().onAuthStateChanged(user => userChanged(user));

    }, [])



    const selectRow = (row) => {
        const rowId = row.docId;
        if (selectedRows?.has(rowId)) {
            selectedRows?.delete(rowId);
        } else {
            selectedRows?.set(rowId, row);
>>>>>>> Stashed changes
        }
        const selectedRows = new Map(selectedRows);
        const allowDeleteAction = selectedRows.size > 0;
<<<<<<< Updated upstream
        this.setState({ selectedRows, allowDeleteAction });
    }
    rowDef(data, index) {
        const rowSelected = this.state.selectedRows.has(data.docId);
        const selectedRowClass = rowSelected ? style.rowSelected : "";
        return <tr onClick={_ => this.selectRow(data)} className={`${selectedRowClass} ${style.tr}`} >
=======
        setSelectedRows(selectedRows)
        setAllowDeleteAction(allowDeleteAction)
    }
    const rowDef = (data, index) => {
        const rowSelected = selectedRows.has(data.docId);
        const selectedRowClass = rowSelected ? style.rowSelected : "";
        return <tr onClick={() => {
            selectRow(data)
            attendService(data)

            // I will come back here
        }} className={`${selectedRowClass} ${style.tr}`} >
>>>>>>> Stashed changes
            <td>{index + 1}</td>
            <td>{data.names.toUpperCase()}</td>
            <td>{data.nidNumber}</td>
            <td>{data.telphoneNumber}</td>
            <td>{data.akarere.toUpperCase()}</td>
            <td>{data.umurenge.toUpperCase()}</td>
            {/* <td>{data.akagari.toUpperCase()}</td> */}
            {/* <td>{data.umudugudu.toUpperCase()}</td> */}
            {/* <td>{data.isibo ? data.isibo.toUpperCase() : "-"}</td> */}
            {/* <td>{data.registrationTime}</td> */}
            <td><span style={{ border: '1px solid #ccd', padding: '5px 10px', borderRadius: '5px', background: '#ccc', margin: '10px 4px' }}>Attend</span></td>
        </tr>;
    }
    const deleteRow = async () => {
        const batch = AppDB.batch();
<<<<<<< Updated upstream
        Array.from(this.state.selectedRows.values())
=======
        Array.from(selectedRows.values())
>>>>>>> Stashed changes
            .forEach(row => {
                const docRef = AppDB.doc(row.docPath);
                batch.delete(docRef);

            });
        confirm("Continue deletion?")
            ? await batch.commit() : null;
<<<<<<< Updated upstream
        this.setState({ selectedRows: new Map() });

    }
    async getCurrentChurchService() {
=======
        setSelectedRows(new Map());

    }

    const getCurrentChurchService = async () => {
>>>>>>> Stashed changes
        console.log("getCurrentChurchService");
        const activeService = await AppDB.collection("amateraniro").where("active", "==", true).get();
        if (activeService.empty) return null;
        return activeService.docs[0].id;
    }
<<<<<<< Updated upstream
    async attendService() {
        const tempeture = prompt("Temperature: ");
=======
    const attendService = async (props) => {
        const tempeture = prompt(`${props.names} Temperature: `);
>>>>>>> Stashed changes
        const tempNumber = Number(tempeture);
        if (!tempNumber) {
            alert("Invalid temperature");
            return;
        }
<<<<<<< Updated upstream
        const currentChurchService = await this.getCurrentChurchService();
=======
        const currentChurchService = await getCurrentChurchService();
>>>>>>> Stashed changes
        if (!currentChurchService) {
            alert("Nta materaniro ahari");
            return;
        }
        const serviceDoc = AppDB.collection("amateraniro").doc(currentChurchService);

        const serviceAttendees = serviceDoc.collection("abateranye");
        const batch = AppDB.batch();
<<<<<<< Updated upstream
        Array.from(this.state.selectedRows.values())
            .forEach(row => {
                const docRef = serviceAttendees.doc(row.docId);
                batch.set(docRef, { ...row, attendanceTime: Date.now(), tempeture: tempNumber });
=======
        Array.from(selectedRows.values())
            .forEach(row => {
                const docRef = serviceAttendees.doc(row.docId);
                batch.set(docRef, { ...row, attendanceTime: Date.now(), temperature: tempNumber });
>>>>>>> Stashed changes

            });
        await batch.commit();
        alert("Added");
<<<<<<< Updated upstream
        this.setState({ selectedRows: new Map() });
    }
    actionTab() {
        return <div>
            <button onClick={_ => this.attendService()} disabled={!this.state.allowDeleteAction} >Attend service</button>
            <button onClick={_ => this.deleteRow()} disabled={!this.state.allowDeleteAction} >Delete</button>
        </div>
    }
    render(props, state) {
        return (
            <div className={`appSection ${style.attanceListPage}`}>
                <div className={`${!state.user ? style.hideContent : ""}`}>
                    <Header user={state.user} path={props.path} />
                    <div className={style.titleAndActions}>
                        <h1>Attendance list</h1>
                        {this.actionTab()}
=======
        setSelectedRows(new Map());
    }



    return (
        <div className={`appSection ${style.attanceListPage}`}>
            <div className={`${!user ? style.hideContent : ""}`}>

                <Header user={user} path={props.path} />
                <div className={style.titleAndActions}>
                    <h1>Attendance list</h1>
                    <div>
                        <button onClick={() => attendService()} disabled={!allowDeleteAction} >Attend service</button>
                        <button onClick={() => deleteRow()} disabled={!allowDeleteAction} >Delete</button>
>>>>>>> Stashed changes
                    </div>
                </div>
                <DataTable data={data} showRowNumbers rowDef={rowDef}>
                    <ColDef name="names">Amazina</ColDef>
                    <ColDef name="nidNumber">NID</ColDef>
                    <ColDef name="telphoneNumber">Tel</ColDef>
                    <ColDef name="akarere">Akarere</ColDef>
                    <ColDef name="umurenge">Umurenge</ColDef>
                    {/* <ColDef name="akagari">Akagari</ColDef> */}
                    {/* <ColDef name="umudugudu">Umudugudu</ColDef> */}
                    {/* <ColDef name="isibo">Isibo</ColDef> */}
                    {/* <ColDef name="registrationTime">Itariki</ColDef> */}
                    <ColDef name="function">Function</ColDef>
                </DataTable>
            </div>
        </div>
    );
}

export default AttandanceList;
