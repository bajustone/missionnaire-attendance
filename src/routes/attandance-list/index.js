import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks'
import Header from "../../components/header";
import style from './style';
import { DataTable, ColDef } from '../../components/data-table';
import { AppDB, FireApp } from "../../firestore";

function AttandanceList(props) {

    const [data, setData] = useState([])
    const [user, setUser] = useState()
    const [selectedRows, setSelectedRows] = useState(new Map())
    const [allowDeleteAction, setAllowDeleteAction] = useState(false)


    const userChanged = (user) => {
        setUser(user);
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
        }
        const selectedRows = new Map(selectedRows);
        const allowDeleteAction = selectedRows.size > 0;
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
        Array.from(selectedRows.values())
            .forEach(row => {
                const docRef = AppDB.doc(row.docPath);
                batch.delete(docRef);

            });
        confirm("Continue deletion?")
            ? await batch.commit() : null;
        setSelectedRows(new Map());

    }

    const getCurrentChurchService = async () => {
        console.log("getCurrentChurchService");
        const activeService = await AppDB.collection("amateraniro").where("active", "==", true).get();
        if (activeService.empty) return null;
        return activeService.docs[0].id;
    }
    const attendService = async (props) => {

        const temperature = prompt(`${props.names} Temperature: `);
        const tempNumber = Number(temperature);

        if (!tempNumber) {
            alert("Invalid temperature");
            return;
        }
        const currentChurchService = await getCurrentChurchService();
        if (!currentChurchService) {
            alert("Nta materaniro ahari");
            return;
        }
        const serviceDoc = AppDB.collection("amateraniro").doc(currentChurchService);

        const serviceAttendees = serviceDoc.collection("abateranye");
        const batch = AppDB.batch();
        Array.from(selectedRows.values())
            .forEach(row => {
                const docRef = serviceAttendees.doc(row.docId);
                batch.set(docRef, { ...row, attendanceTime: Date.now(), temperature: tempNumber });

            });
        await batch.commit();
        alert("Added");
        setSelectedRows(new Map());
    }



    return (
        <div className={`appSection ${style.attanceListPage}`}>
            <div className={`${!user ? style.hideContent : ""}`}>

                <Header user={user} path={props.path} />
                <div className={style.titleAndActions}>
                    <h1>Attendance list</h1>
                    {/* <div>
                        <button onClick={() => attendService()} disabled={!allowDeleteAction} >Attend service</button>
                        <button onClick={() => deleteRow()} disabled={!allowDeleteAction} >Delete</button>

                  

                    </div> */}

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
