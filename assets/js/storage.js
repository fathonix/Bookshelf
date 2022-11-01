onload = () => {
  console.log(`Saved data: ${localStorage["items"]}`);

  let items;
  try {
    items = JSON.parse(localStorage["items"]);
  } catch (e) {
    localStorage["items"] = "[]";
    items = [];
  }

  for (const item of items) {
    insertStart(
      item.isComplete ? completedItems : ongoingItems,
      createBook(item)
    );
  }
};

function saveItems(items) {
  items.sort((fi, si) => fi.id - si.id);
  localStorage["items"] = JSON.stringify(items);
}

function addItem(item) {
  const items = JSON.parse(localStorage["items"]);
  items.push(item);
  saveItems(items);

  insertStart(
    item.isComplete ? completedItems : ongoingItems,
    createBook(item)
  );
}

function changeItem(id, newValues) {
  let items = JSON.parse(localStorage["items"]);
  items = items.map((item) =>
    item.id == id ? { ...item, ...newValues } : item
  );
  saveItems(items);
}

function dropItem(id) {
  let items = JSON.parse(localStorage["items"]);
  items = items.filter((item) => item.id != id);
  saveItems(items);
}
