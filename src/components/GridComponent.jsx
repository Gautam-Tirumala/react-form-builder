import React, { useState } from 'react';

const GridComponent = ({handleColumsSelected}) => {
    const [rows, setRows] = useState([
        // [
        //     { id: 'column-0', widthClass: 'col-md-12 col-sm-12', widgets: [],uid:12 }
        // ],
        [
            { id: 'column-1', widthClass: 'col-md-4 col-sm-4', widgets: [] ,uid:48 },
            { id: 'column-2', widthClass: 'col-md-8 col-sm-8', widgets: [] ,uid:48 }
        ],
        [
            { id: 'column-3', widthClass: 'col-md-8 col-sm-8', widgets: [] ,uid:84 },
            { id: 'column-4', widthClass: 'col-md-4 col-sm-4', widgets: [] ,uid:84 }
        ],
        [
            { id: 'column-5', widthClass: 'col-md-6 col-sm-6', widgets: [] ,uid:633 },
            { id: 'column-6', widthClass: 'col-md-3 col-sm-3', widgets: [] ,uid:633 },
            { id: 'column-7', widthClass: 'col-md-3 col-sm-3', widgets: [] ,uid:633 }
        ],
        [
            { id: 'column-8', widthClass: 'col-md-3 col-sm-3', widgets: [] ,uid:363 },
            { id: 'column-9', widthClass: 'col-md-6 col-sm-6', widgets: [] ,uid:363 },
            { id: 'column-10', widthClass: 'col-md-3 col-sm-3', widgets: [] ,uid:363 }
        ],
        [
            { id: 'column-11', widthClass: 'col-md-3 col-sm-3', widgets: [] ,uid:336 },
            { id: 'column-12', widthClass: 'col-md-3 col-sm-3', widgets: [] ,uid:336 },
            { id: 'column-13', widthClass: 'col-md-6 col-sm-6', widgets: [] ,uid:336 },
        ]
    ]);

    const [showCols, setShowCols] = useState(false);

    const showDropdown = () =>{
        setShowCols(!showCols);
    }

    const addNewColumn = (columnValue) => {
        const newColumns = columnValue.split("-");
        const newRow = newColumns.map((col, index) => ({
            id: `column-${index}`,
            widthClass: `col-md-${col} col-sm-${col}`,
            widgets: []
        }));
        setRows([...rows, newRow]);
    };

    const deleteRow = (index) => {
        const updatedRows = [...rows];
        updatedRows.splice(index, 1);
        setRows(updatedRows);
    };
    // const handleColumsSelected = (row , rowIndex ) =>{
    //     console.log("row received is ", row);
    // }

    return (
        <div>
            <div id="add-column-button" className="dropdown-toggle w100p p10 bg-white text-center clickable " data-bs-toggle="collapse" data-bs-target="#add-column-collapse-panel" aria-expanded="true" onClick={showDropdown}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-plus-circle icon-16">
                    {/* <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="16"></line>
                    <line x1="8" y1="12" x2="16" y2="12"></line> */}
                </svg> Add row
            </div>
            {rows.map((row, rowIndex) => (
                <div key={rowIndex} className="col-md-12 p15 bg-off-white float-end m-1" id="widget-row-area "  onClick={() => showCols && handleColumsSelected(row, rowIndex)}>
                    {/* <div className="float-start row-controller text-off font-16">
                        <span className="move">
                            <i className="icon-16">Move Icon</i>
                        </span>
                        <span className="delete delete-widget-row" onClick={() => deleteRow(rowIndex)}>
                            <i className="icon-16">Delete Icon</i>
                        </span>
                    </div> */}
                     
                    <div className="clearfix row">
                        {showCols && row.map((column, columnIndex) => (
                            <div key={column.id} className={`col-xs-12 ${column.widthClass}`} >
                                <div className="grid-bg add-column-panel add-column-drop text-center p15 border border-dark" style={{ marginBottom: '15px' }}>
                                    {column.widgets.length === 0 ? (
                                        <span className="text-off empty-area-text">{columnIndex+1}/{rowIndex+1}</span>
                                    ) : (
                                        column.widgets.map((widget, widgetIndex) => (
                                            <div key={widgetIndex} className="mb5 widget clearfix p10 bg-white">
                                                {widget}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        
           
            
        </div>
    );
};

export default GridComponent;
