// Form
var form = document.getElementById("form");

// Buttons
const btnAdd = document.getElementById("btnAdd");
const btnEdit = document.getElementById("btnEdit");
const btnDelete = document.getElementById("btnDelete");
const btnRefresh = document.getElementById("btnRefresh");
const btnDeleteConfirm = document.getElementById("btnConfirmDelete");

const id = document.getElementById("id");
const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const email = document.getElementById("email");

const firstNameValidationMessage = document.getElementById("firstNameValidationMessage");
const lastNameValidationMessage = document.getElementById("lastNameValidationMessage");
const emailValidationMessage = document.getElementById("emailValidationMessage");

const deleteConfirmModal = document.getElementById("deleteConfirmModal");
const deleteConfirmModalBody = document.getElementById("deleteConfirmModalBody");
const idInDeleteConfirmModal = document.getElementById("inDeleteConfirmModalId");

var detailsModal = document.getElementById("detailsModal");

const chkSelectAll = document.getElementById("selectAll");
const tbody = document.querySelector("tbody");
const resultMessage = document.getElementById("resultMessage");

// Debugging
console.log("Form:", form);
console.log("btnAdd:", btnAdd);
console.log("btnEdit:", btnEdit);
console.log("btnDelete:", btnDelete);
console.log("btnRefresh:", btnRefresh);
console.log("btnDeleteConfirm:", btnDeleteConfirm);

// Add event listeners
if (form) form.addEventListener("submit", Add);
if (btnRefresh) btnRefresh.addEventListener("click", LoadData);
if (btnEdit) btnEdit.addEventListener("click", Edit);
if (chkSelectAll) chkSelectAll.addEventListener("click", SelectDeselectAll);
if (deleteConfirmModal) deleteConfirmModal.addEventListener("show.bs.modal", ConfirmDelete);

var allRowsCount = 0;
var selectedRows = [];

// Load data on page load
LoadData();

// Functions
function LoadData() {
    //console.log("start loading");
    RefreshPage();
    chkSelectAll.checked = false;
    tbody.innerHTML = "";
    //Consuming REST api
    fetch("http://Localhost:5009/Person/GetAll")
        .then((res) => res.json())
        .then((dto) => {
            let html = "";
            allRowsCount = dto.length;
            dto.forEach(function (dto) {
                html += `<tr id="${dto.id}">
                  <td><input id="${dto.id}" class="form-check-input" type="checkbox" name="chk" onClick="SelectRow(this);"</td>
                  <td id="firstNameCell">${dto.firstName}</td>
                  <td id="lastNameCell">${dto.lastName}</td>
                  <td id="emailCell">${dto.email}</td>
                  <td>
                    <input id="${dto.id}" onClick="GetDetails(this);" class="btn btn-outline-primary btn-sm" type="button" value="Details" data-bs-toggle="modal" data-bs-target="#detailsModal">
                    <input id="${dto.id}" onClick="ConfirmDelete(this);" class="btn btn-danger col-sm-auto m-2" type="button" value="Delete" data-bs-toggle="modal" data-bs-target="#deleteConfirmModal">                   
                  </td>
                </tr>`;
            });
            tbody.innerHTML = html;
        });
}
function Add(e) {
    e.preventDefault();
    if (!ValidateFormData()) return;

    const person = {
        Id: "",
        FirstName: firstName.value,
        LastName: lastName.value,
        Email: email.value,
    };

    fetch("http://localhost:5009/Person/Post", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
        },
        body: JSON.stringify(person),
    })
        .then((res) => {
            if (res.status === 409) {
                emailValidationMessage.innerText = `Person with email ${email.value} already exists`;
                email.classList.add("is-invalid");
            } else if (res.status === 200) {
                TriggerResultMessage("Operation Successful");
                LoadData();
            } else {
                TriggerResultMessage("Operation Failed");
            }
        })
        .catch((error) => {
            console.error("Error adding person:", error);
            TriggerResultMessage("Operation Failed");
        });
}


// Edit an existing person
function Edit() {
    if (!ValidateFormData()) return;

    const person = {
        Id: id.value,
        FirstName: firstName.value,
        LastName: lastName.value,
        Email: email.value,
    };

    fetch("http://localhost:5009/Person/Put", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
        },
        body: JSON.stringify(person),
    })
        .then((res) => {
            if (res.status === 409) {
                emailValidationMessage.innerText = `Person with email ${email.value} already exists`;
                email.classList.add("is-invalid");
            } else if (res.status === 200) {
                TriggerResultMessage("Operation Successful");
                LoadData();
            } else {
                TriggerResultMessage("Operation Failed");
            }
        })
        .catch((error) => {
            console.error("Error editing person:", error);
            TriggerResultMessage("Operation Failed");
        });
}

// Delete a person
function Delete() {
    fetch("http://Localhost:5009/Person/Delete", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
        },
        body: JSON.stringify({ Id: idRowForDelete }),
    }).then((res) => {
        if (res.status == 200) {
            TriggerResultMessage("Operation Successful");
            LoadData();
        } else {
            TriggerResultMessage("Operation Failed");
        }
    });
    idRowForDelete = "";
}

// Delete selected person

async function DeleteSelected() {
    if (selectedRows.length === 0) {
        TriggerResultMessage("No rows selected");
        return;
    }

    const deleteSelectedDto = {
        DeletePersonDtosList: selectedRows.map((id) => ({ Id: id })),
    };

    try {
        const response = await fetch("http://localhost:5009/Person/DeleteSelected", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "*/*",
            },
            body: JSON.stringify(deleteSelectedDto),
        });

        if (response.ok) {
            TriggerResultMessage("Operation Successful");
            LoadData();
        } else {
            TriggerResultMessage("Operation Failed");
        }
    } catch (error) {
        console.error("Error deleting selected persons:", error);
        TriggerResultMessage("Operation Failed");
    }
}

// Select/Deselect all rows

function SelectDeselectAll() {
    const checkBoxes = document.getElementsByName("chk");
    console.clear();
    console.log("SelectDeselectAll()");
    console.log("selectedRows: " + selectedRows.length);
    if (chkSelectAll.checked) {
        console.log("checked");

        for (let i = 0; i < checkBoxes.length; i++) {

            checkBoxes[i].checked = true;
        }
    } else {
        console.log("unChecked");

        for (let i = 0; i < checkBoxes.length; i++) {

            checkBoxes[i].checked = false;
        }
    }
}
// Select a single row
function SelectRow(checkBox) {
    console.clear();
    if (checkBox.checked === true) {
        selectedRows.push(checkBox.id);
    }
    else selectedRows.splice(selectedRows.indexOf(checkBox.id), 1);

    console.log(`selectedRows: ${selectedRows.length}`);

    switch (selectedRows.length) {
        case 1:

            RefreshPage();
            btnEdit.disabled = false;
            btnDelete.disabled = false;
            id.value = selectedRows[0];
            firstName.value = document.querySelector(
                `tr[id="${selectedRows[0]}"] td[id="firstNameCell"]`
            ).innerText;
            lastName.value = document.querySelector(
                `tr[id="${selectedRows[0]}"] td[id="lastNameCell"]`
            ).innerText;
            email.value = document.querySelector(
                `tr[id="${selectedRows[0]}"] td[id="emailCell"]`
            ).innerText;
            break;
        case selectedRows.length > 1:
            RefreshPage();
            break;

        default:
            RefreshPage();
            break;
    }
}
function RefreshPage() {
    btnAdd.disabled = false;
    btnEdit.disabled = true;
    btnDelete.disabled = true;

    firstName.classList.remove("is-invalid", "is-valid");
    lastName.classList.remove("is-invalid", "is-valid");
    email.classList.remove("is-invalid", "is-valid");

    firstName.value = "";
    firstName.value = "";
    lastName.value = "";
    email.value = "";

    firstNameValidationMessage.innerText = "";
    lastNameValidationMessage.innerText = "";
    emailValidationMessage.innerText = "";

}
// Validate form data
function ValidateFormData() {
    let isValid = true;

    if (firstName.value.trim() === "") {
        firstNameValidationMessage.innerText = "First name is required";
        firstName.classList.add("is-invalid");
        isValid = false;
    } else {
        firstName.classList.add("is-valid");
    }

    if (lastName.value.trim() === "") {
        lastNameValidationMessage.innerText = "Last name is required";
        lastName.classList.add("is-invalid");
        isValid = false;
    } else {
        lastName.classList.add("is-valid");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value)) {
        emailValidationMessage.innerText = "Invalid email address";
        email.classList.add("is-invalid");
        isValid = false;
    } else {
        email.classList.add("is-valid");
    }

    return isValid;
}

function ConfirmDelete(button) {
    console.clear();
    console.log(button);
    console.log(button.id);
    idRowForDelete = button.id;
    console.log(idRowForDelete);
    /*PassDetails(idRowForDelete);*/
    console.log(btnDeleteConfirm);
    btnDeleteConfirm.addEventListener("click", Delete);
}
function GetDetails(button) {
    console.log(button.id);
    let id = button.id;
    console.log(id);
    fetch(`http://Localhost:5009/Person/Get?id=${id}`)
        .then((res) => res.json())
        .then((json) => {
            let inModalUl = document.querySelectorAll(".card li");
            inModalUl[0].innerText = `First Name : ${json.firstName}`;
            inModalUl[1].innerText = `Last Name : ${json.lastName}`;
            inModalUl[2].innerText = `Email : ${json.email}`;
        });
}

function PassDetails(id) {
    let firstName = document.querySelector(
        `tr[id="${id}"] td[id="firstNameCell"]`
    ).innerText;
    let lastName = document.querySelector(
        `tr[id="${id}"] td[id="lastNameCell"]`
    ).innerText;
    let email = document.querySelector(
        `tr[id="${id}"] td[id="emailCell"]`
    ).innerText;
    confirmDeleteModalBody.innerHTML = `You are deleting :<br><strong>First Name : ${firstName}<br>Last Name : ${lastName}<br>Email : ${email}</strong><br>Are you sure ?`;
}
// Show result message
function TriggerResultMessage(message) {
    resultMessage.innerText = message;
    resultMessage.style.opacity = "1";
    setTimeout(() => {
        resultMessage.style.opacity = "0";
    }, 2000);
}


