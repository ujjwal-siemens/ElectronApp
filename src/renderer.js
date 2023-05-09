const ipcRenderer = require('electron').ipcRenderer;

ipcRenderer.on('cpu', (event,data)=>{
    document.getElementById('cpu').innerHTML = data.toFixed(2);
});
ipcRenderer.on('mem', (event,data)=>{
    document.getElementById('mem').innerHTML = data.toFixed(2);
});
ipcRenderer.on('total-mem', (event,data)=>{
    document.getElementById('total-mem').innerHTML = data.toFixed(2);
});

//const buttonUpload = document.getElementById('upload');
//buttonUpload.addEventListener('click', () => {
//    ipcRenderer.send('open-file-dialog');
//});

ipcRenderer.on('selected-file', (event,data) => {
    console.log('Full Path: ' + data);
    document.getElementById('full-path').innerHTML = data;
});

const openBtn = document.getElementById('open');
const shell = require('electron').shell;

openBtn.addEventListener('click', function(event) {
    //shell.showItemInFolder('C:\\workdir\\Electron_Project\\cool-app\\package-lock.json');
    //shell.openItem('C:\\workdir\\Electron_Project\\cool-app\\license.txt');
    shell.openPath('C:\\Windows\\notepad.exe');
});


// Deletes a person
function deletePerson(id) {

    const database = require('./database');

    // Delete the person from the database
    database.deletePerson(id);
  
    // Repopulate the table
    populateTable();
  }

  // Populates the persons table
function populateTable() {

    const database = require('./database');

    // Retrieve the persons
    database.getPersons(function(persons) {
  
      // Generate the table body
      var tableBody = '';
      for (i = 0; i < persons.length; i++) {
        tableBody += '<tr>';
        tableBody += '  <td>' + persons[i].firstname + '</td>';
        tableBody += '  <td>' + persons[i].lastname + '</td>';
        tableBody += '  <td><input type="button" value="Delete" onclick="deletePerson(\'' + persons[i]._id + '\')"></td>'
        tableBody += '</tr>';
      }
  
      // Fill the table content
      document.getElementById('tablebody').innerHTML = tableBody;
    });
  }

  const responseEle = document.getElementById('response');
  ipcRenderer.on('fetch-data-response', function(event, data) {
    responseEle.innerHTML = JSON.stringify(data);
  });

  callApi.addEventListener('click', (event) => {
    ipcRenderer.send('fetch-data');
  });