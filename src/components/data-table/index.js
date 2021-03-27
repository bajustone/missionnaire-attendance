import { h, Component } from "preact";


export class DataTable extends Component {
    constructor(props) {
        super();
        this.props = props;

        this.state = {
            tableData: props.data || [],
            columns: {},
            selectAll: false,
            _selectedRows: []
        };
        if (props.rowDef) {
            this.rowDef = props.rowDef.bind(this);
        }
        this.getColumns();

        this.onRowClicked = !this.props.onRowClicked ? () => { } : this.props.onRowClicked;
        this.selectAll = this.selectAll.bind(this);

    }
    get selectedRows(){
        return this.state._selectedRows.map(i=>this.state.tableData[i]);
    }
    getColumns() {
        const children = Array.isArray(this.props.children) ? this.props.children : [this.props.children]

        for (const child of children) {
            if (child.type != ColDef) continue;
            this.state.columns[child.props.name] = child;
        }
    }
    onRowSectionChange(rowData, index, evt) {
        // const selectedRows = this.state.selectedRows;
        
        // console.log("onRowSectionChange");
        // console.log(selectedRows);
        // console.log(Array.from(selectedRows));
        // console.log(Array.from(selectedRows));
        const found = this.state._selectedRows.indexOf(rowData) !== -1;
        // Array.from(selectedRows).forEach(row=>{
        //     console.log(row, rowData);
        //     console.log((row==rowData));
        // })
        // console.log(Array.from(selectedRows).indexOf(rowData));

        if ( found ) {
            console.log("Deselect");
            this.deSelectRow(index);
        } else {

            this.selectRow(index);
        }
        // this.setState({
        //     selectedRows: selectedRows
        // });

    }
    rowDef(row, index, rowData) {
        const rowNumbers = this.props.showRowNumbers ? <td>{index + 1}</td> : null;
        const showCheckBoxes = this.props.showCheckBoxes ?
            <td><input onChange={evt => this.onRowSectionChange(rowData, index, evt)} type="checkbox" checked={this.state._selectedRows.indexOf(index) !== -1} /></td>
            : null;
        return [
            <tr onClick={evt => this.onRowClicked(evt, rowData, index)}>
                {showCheckBoxes}
                {rowNumbers}
                {Object.entries(row).map((td) => {
                    const [tdName, tdValue] = td;
                    return [
                        <td className={tdName}>{tdValue ? tdValue.toLocaleString() : "n/a"}</td>
                    ]
                })}
            </tr>
        ];
    }
    get selectedRows() {
        return this.state.selectedRows;
    }
    onRowSelection(rowData) {
        // console.log("Table selection");
        // console.log(this.props);
        if (!this.props.onRowSelection) return;
        this.props.onRowSelection(rowData, this);
    }
    selectRow(row) {
        if (this.state._selectedRows.indexOf(row) !== -1 ) return;
        console.log("Select");

        let selectedRows = this.state._selectedRows;
        selectedRows.push(row);
        this.setState({ _selectedRows: selectedRows});
        this.onRowSelection(this.state.tableData[row]);
    }
    deSelectRow(row) {
        if (this.state._selectedRows.indexOf(row) === -1 ) return;
        let selectedRows = this.state._selectedRows;
        selectedRows = selectedRows.splice(row, 1);
        this.setState({ _selectedRows: selectedRows});
        this.onRowSelection(this.state.tableData[row]);

    }
    selectAll(value) {
        let selectedRows = new Map()

        if (value) {
            this.state.tableData.forEach((row) => {
                selectedRows.set(row), true
            });
        }

        this.setState({
            selectAll: value,
            selectedRows: selectedRows
        });


    }
    renderTableHeader(state) {
        const showCheckBoxes = this.props.showCheckBoxes ? <th><input type="checkbox" onChange={evt => this.selectAll(evt.target.checked)} /></th> : null;
        const rowNumbers = this.props.showRowNumbers ? <th>#</th> : null;
        return [showCheckBoxes, rowNumbers, Object.keys(state.columns).map(columnName => {
            const column = state.columns[columnName];
            return <th onClick={(evt) => { return column.props.sortable ? this.sortBy(columnName) : null }}>{column.props.children}</th>
        })]
    }
    renderTableBody(data) {

        const allowedRows = Object.keys(this.state.columns);
      
        return data.map((row, index) => {
            const rowData = {};
            for(let col of allowedRows){
                rowData[col] = row[col];
            }
            const rowComponent = this.rowDef(rowData, index, row);

            return rowComponent;

        });

    }
    sortBy(columnName) {
    }

    render(props, state) {
        
        const { className } = props;
        return (
            <table className={className} >
                <thead>
                    <tr>{this.renderTableHeader(state)}</tr>
                </thead>

                <tbody>
                    {this.renderTableBody(props.data)}
                </tbody>
            </table>
        );
    }

}
export class ColDef extends DataTable {
    constructor(props, state) {
        super(props, state);
    }
    render(props, state) {
        return (
            <div> {props.children} </div>
        );
    }
}