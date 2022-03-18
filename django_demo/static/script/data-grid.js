const loadDataGrid = async () => {
    const columnDefs = [
      { field: "name" },
      { field: "loginsCount" },
      { headerName: "Sign up", field: "created" },
      { field: "lastSession"}
    ];

    // default ColDef, gets applied to every column
    const defaultColDef= {
      // make columns resizable
      resizable: true,
    };
    
    // specify the data
    const dashboardData = await fetch('/membership/get_dashboard_data/', {
    method: 'GET',
    headers: {}
  })
  .then(response => {
    if (response.ok) {
      return response.json()
    } else if(response.status === 404) {
      return Promise.reject('error 404')
    } else {
      return Promise.reject('some other error: ' + response.status)
    }
  })
  .catch(error => console.log('error is', error));

    const rowData = dashboardData[0].members
    const membersInfo = dashboardData[0].members_info[0]

    const infoStr = 'Members signed up: <p style="color:red">' + membersInfo.SingUpCount
        + '</p>active sessions today: <p style="color:red">' + membersInfo.ToDayAlive
        + '</p>active session users in the last 7 days rolling: <p style="color:red">' + membersInfo.Last7DaysAlice + '</p>'
    setDashboardInfo(infoStr);
    
    // let the grid know which columns and what data to use
    const gridOptions = {
      columnDefs: columnDefs,
      rowData: rowData,
      defaultColDef: defaultColDef
    };
    
    // setup the grid after the page has finished loading
    const gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);
}