const ongoingItems = document.querySelector(".section#ongoing > .item-container");
const completedItems = document.querySelector(".section#completed > .item-container");

const overlay = document.querySelector("#overlay");
const popupTitle = document.querySelector("#popup > #popup-title");
const title = document.querySelector("#popup > #form-book #title");
const author = document.querySelector("#popup > #form-book #author");
const page = document.querySelector("#popup > #form-book #page");

var bookType;
var editEl;

function insertStart(parent, el) {
  parent.insertBefore(el, parent.children[0]);
}

function showPopup(el) {
  overlay.style.display = "flex";
  bookType = el.closest(".section").id;
  popupTitle.innerText = "Add a book";
}

function closePopup(isSubmit) {
  if (
    !isSubmit &&
    (title.value.trim() || author.value.trim() || page.value) &&
    !confirm("Are you sure you want to close?")
  ) {
    return;
  }

  overlay.style.display = "none";
  title.value = "";
  author.value = "";
  page.value = "";
  bookType = undefined;
  editEl = undefined;
}

function submitBook() {
  if (!title.value.trim() || !author.value.trim() || !page.value) {
    alert("Invalid data");
    return;
  }

  if (!editEl) {
    addItem({
      id: +new Date(),
      title: title.value,
      author: author.value,
      page: +page.value,
      isComplete: bookType === "completed",
    });
  } else {
    changeItem(editEl.id, {
      title: title.value,
      author: author.value,
      page: +page.value,
    });

    editEl.querySelector(".title").innerText = title.value;
    editEl.querySelector(".author").innerText = author.value;
    editEl.querySelector(".page").innerText = `Page ${page.value}`;
  }

  closePopup(true);
}

function createBook(obj) {
  const title = document.createElement("h2");
  title.className = "title";
  title.innerText = obj["title"];

  const author = document.createElement("h3");
  author.className = "author";
  author.innerText = obj["author"];

  const page = document.createElement("h4");
  page.className = "page";
  page.innerText = `Page ${obj["page"]}`;

  const desc = document.createElement("div");
  desc.className = "desc";
  desc.append(title, author, page);

  const actionEdit = document.createElement("img");
  actionEdit.className = "action edit";
  actionEdit.setAttribute("alt", "Edit item");
  actionEdit.setAttribute("onclick", "editItem(this)");

  const actionMove = document.createElement("img");
  actionMove.className = "action move";
  actionMove.setAttribute("alt", "Move item");
  actionMove.setAttribute("onclick", "moveItem(this)");

  const actionRemove = document.createElement("img");
  actionRemove.className = "action remove";
  actionRemove.setAttribute("alt", "Remove item");
  actionRemove.setAttribute("onclick", "removeItem(this)");

  const actions = document.createElement("div");
  actions.className = "actions";
  actions.append(actionEdit, actionMove, actionRemove);

  const item = document.createElement("div");
  item.className = "item";
  item.id = obj.id;
  item.append(desc, actions);

  return item;
}

function editItem(el) {
  editEl = el.closest(".item");

  popupTitle.innerText = "Edit book";
  title.value = editEl.querySelector(".title").innerText;
  author.value = editEl.querySelector(".author").innerText;
  page.value = editEl.querySelector(".page").innerText.replace("Page ", "");
  overlay.style.display = "flex";
}

function moveItem(el) {
  const item = el.closest(".item");
  const section = el.closest(".section");
  const newId = +new Date();

  changeItem(+item.id, {
    id: newId,
    isComplete: section.id == "ongoing",
  });

  item.id = newId;
  
  insertStart(
    section.id == "ongoing" ? completedItems : ongoingItems,
    item.cloneNode(true)
  );

  item.remove();
}

function removeItem(el) {
  if (!confirm("Are you sure you want to remove this item?")) {
    return;
  }

  const item = el.closest(".item");
  dropItem(+item.id);
  item.remove();
}
