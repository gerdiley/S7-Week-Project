// inizializzio variabili
var nome;
var cognome;
var addBtn;
var elencoHTML;
var errore;
var erroreElenco;
var elenco = [];
var toggle = true;
var editId = 0;


window.addEventListener("DOMContentLoaded", init);

function init() {
    nome = document.getElementById("nome");
    cognome = document.getElementById("cognome");
    addBtn = document.getElementById("scrivi");
    elencoHTML = document.getElementById("elenco");
    errore = document.getElementById("errore");
    erroreElenco = document.getElementById("erroreElenco");

    printData();
    eventHandler();
}

function eventHandler() {
    addBtn.addEventListener("click", function () {
        if (toggle) {
            controlla();
        } else {
            editPut(editId);
            // clear classi aggiunte nell'edit
            editElement.classList.remove('border-2', 'border-primary', 'opacity-50');
            nome.classList.remove('border', 'border-primary', 'border-2')
            cognome.classList.remove('border', 'border-primary', 'border-2');
        }
    });
}



function printData() {
    fetch("http://localhost:3000/elenco")
        .then((response) => {
            // ritorna una rappresentazione
            return response.json();
            // la trasformiamo e popoliamo array
        })
        .then((data) => {
            elenco = data;
            if (elenco.length > 0) {
                errore.innerHTML = "";
                elencoHTML.innerHTML = "";
                elenco.map(function (element) {
                    elencoHTML.innerHTML += `<li class= "list-group-item bg-light bg-gradient bg-opacity-50"><button type="button" class="btn btn-danger me-1" onClick="elimina(${element.id})"><i class="bi bi-x"></i></i></button> <button type="button" class="btn btn-primary me-1" onClick="edit(${element.id},'${element.nome}','${element.cognome}')"><i class="bi bi-pencil-square"></i></button> ${element.nome} ${element.cognome} </li>`;
                });
            } else {
                erroreElenco.innerHTML = "Your list is empty!";
                erroreElenco.classList.remove('d-none');

            }
        });
}

function controlla() {
    if (nome.value != "" && cognome.value != "") {
        var data = {
            nome: nome.value,
            cognome: cognome.value,
        };
        addData(data);
    } else {
        errore.innerHTML = "Please, fill out your fields!";
        errore.classList.remove('bg-transparent');
        errore.classList.add('bg-danger', 'bg-opacity-75');
        nome.classList.add('border', 'border-danger', 'border-2')
        cognome.classList.add('border', 'border-danger', 'border-2')
        return;
    }
}



async function addData(data) {
    let response = await fetch("http://localhost:3000/elenco", {
        method: "POST",
        headers: {
            "Content-Type": "application/json;chartset=utf-8",
        },
        body: JSON.stringify(data),
    });
    clearForm();
}

function clearForm() {
    nome.value = "";
    cognome.value = "";
}

// Funtion delete

function elimina(record) {
    if (window.confirm('Attention! This operation is irreversible. Do you want to continue?')) {
        fetch("http://localhost:3000/elenco/" + record, {
            method: "DELETE",
        });
        clearForm();
    } else return
}

// function edit

function edit(dataId, dataName, dataSurname) {
    toggle = false;
    nome.value = dataName;
    cognome.value = dataSurname;
    editId = dataId;

    let editElement = document.querySelector(`li:nth-of-type(${editId})`);
    editElement.classList.add('border-2', 'border-primary', 'opacity-50');
    nome.classList.add('border', 'border-primary', 'border-2')
    cognome.classList.add('border', 'border-primary', 'border-2')
}


async function editPut(parID) {

    if (nome.value == "" || cognome.value == "") {
        errore.innerHTML = "Compilare correttamente i campi!";
        return;
    }

    if (window.confirm('Do you want to modify your record? The action is irreversible.')) {
        data = {
            nome: nome.value,
            cognome: cognome.value,
        };

        await fetch("http://localhost:3000/elenco/" + parID, {
            method: "PUT",
            headers: { "Content-Type": "application/json;chartset=utf-8" },
            body: JSON.stringify(data)
        });
    } else return
};