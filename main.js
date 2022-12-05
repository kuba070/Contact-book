const API = "http://localhost:8000/contacts";

let title = document.querySelector("#firstName");
let price = document.querySelector("#lastName");
let descr = document.querySelector("#phoneNumber");
let image = document.querySelector("#image");
let btnAdd = document.querySelector("#btn-add");

let list = document.querySelector("#products-list");

let editfirstName = document.querySelector("#edit-firstName");
let editlastName = document.querySelector("#edit-lastName");
let editphoneNumber = document.querySelector("#edit-phoneNumber");
let editImage = document.querySelector("#edit-image");
let editSaveBtn = document.querySelector("#btn-save-edit");
let exampleModal = document.querySelector("#exampleModal");

console.log(
  editfirstName,
  editlastName,
  editphoneNumber,
  editImage,
  editSaveBtn,
  exampleModal
);

btnAdd.addEventListener("click", async function () {
  let obj = {
    firstName: firstName.value,
    lastName: lastName.value,
    phoneNumber: phoneNumber.value,
    image: image.value,
  };

  if (
    !obj.firstName.trim() ||
    !obj.lastName.trim() ||
    !obj.phoneNumber.trim() ||
    !obj.image.trim()
  ) {
    alert("zapolnite polya!");
    return;
  }

  await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(obj),
  });
  render();

  firstName.value = "";
  lastName.value = "";
  phoneNumber.value = "";
  image.value = "";
});

render();
async function render() {
  let products = await fetch(API)
    .then((res) => res.json())
    .catch((err) => console.log(err));

  list.innerHTML = "";

  products.forEach((element) => {
    let newElem = document.createElement("div");
    newElem.id = element.id;

    newElem.innerHTML = `<div class="card m-5" style="width: 18rem;">
    <img src="${element.image}" class="card-img-top" alt="...">
    <div class="card-body">
      <h5 class="card-title">${element.firstName}</h5>
      <p class="card-text">${element.lastName}</p>
      <p class="card-text">${element.phoneNumber}</p>
      <a href="#" class="btn btn-danger btn-delete" id="${element.id}">DELETE</a>
      <a href="#" class="btn btn-danger btn-edit" data-bs-toggle="modal" data-bs-target="#exampleModal" id="${element.id}">EDIT</a>
    </div>
  </div>
    `;
    list.append(newElem);
  });
}

document.addEventListener("click", function (e) {
  if (e.target.classList.contains("btn-edit")) {
    let id = e.target.id;

    fetch(`${API}/${id}`)
      .then((res) => res.json())
      .then((data) => {
        editfirstName.value = data.firstName;
        editlastName.value = data.lastName;
        editphoneNumber.value = data.phoneNumber;
        editImage.value = data.image;

        editSaveBtn.setAttribute("id", data.id);
      });
  }
});

editSaveBtn.addEventListener("click", function () {
  let id = this.id;
  let firstName = editfirstName.value;
  let lastName = editlastName.value;
  let phoneNumber = editphoneNumber.value;
  let image = editImage.value;

  if (!firstName || !lastName || !phoneNumber || !image) return;

  let editedProduct = {
    firstName: firstName,
    lastName: lastName,
    phoneNumber: phoneNumber,
    image: image,
  };

  saveEdit(editedProduct, id);
});

async function saveEdit(editedProduct, id) {
  await fetch(`${API}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(editedProduct),
  });

  render();

  let modal = bootstrap.Modal.getInstance(exampleModal);
  modal.hide();
}
