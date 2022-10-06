

const list = document.getElementById('btn');
const clear = document.getElementById('clr-btn');
let key = 1;
let removedKeys = 0;

clear.addEventListener('click', function(){
  const lists = document.querySelectorAll('section');
  const page = document.getElementById('wrapper');
  if(lists.length > 0) {
    lists.forEach(function(list){
      page.removeChild(list)
    });
  }
  window.localStorage.clear();
  key = 1;
})

list.addEventListener('click', function () {
    const section = document.createElement('section');
    section.setAttribute('id', `section-${key}`);
    section.setAttribute('class', 'section-center');
    document.getElementById('wrapper').appendChild(section);
    section.innerHTML = `<h3 class="section-title">List ${key}</h3>
    <input type="text" id="input-${key}">
    <button id="submit${key}" class="submit-btn">New List Item</button>`;
    const btn = section.querySelector(`#submit${key}`);
    btn.addEventListener('click', createListItem);
    key ++;
})

function createListItem(e) {
  const thisKey = this.parentElement.id;
  const anotherKey = thisKey.charAt(thisKey.length-1);
  const div = document.createElement('div');
  const section = document.getElementById(thisKey);
  const id = Math.floor(Math.random() * 10000).toString();
  const value = this.previousElementSibling.value;
    div.setAttribute('id', id);
    div.setAttribute('class', 'listItem');
    section.appendChild(div);
    div.innerHTML =`
      <span>${value}</span>
      <button id="delete${anotherKey}" type="button" class="delete-btn">
        <i class="fas fa-trash"></i>
      </button>
      <button id="edit${anotherKey}" type="button" class="edit-btn">
        <i class="fas fa-edit"></i>
      </button>
    `;
    const deleteBtn = div.querySelector(`#delete${anotherKey}`);
    const editBtn = div.querySelector(`#edit${anotherKey}`);
    const done = div.querySelector('span');

    addToLocalStorage(thisKey, id, value);
    setBackToDefault(anotherKey);
    deleteBtn.addEventListener('click', deleteItem);
    editBtn.addEventListener('click', editItem);
    done.addEventListener('click', doneItem);
};

function setBackToDefault(key){
  const item = document.getElementById(`input-${key}`);
  item.value = "";
  const submitBtn = document.getElementById(`submit${key}`);
  submitBtn.textContent = "New List Item";
}

function deleteItem(e){
  const element = e.currentTarget.parentElement;
  const id = element.id;
  const list = e.currentTarget.parentElement.parentElement;
  const key = list.id;
  list.removeChild(element);
  removeFromLocalStorage(key, id);
}

function editItem(e){
  const element = e.currentTarget.parentElement;
  const thisSpan = element.querySelector("span");
  const editElement = thisSpan.innerHTML;
  const list = e.currentTarget.parentElement.parentElement;
  const key = list.id;
  const listNumber = key.charAt(key.length-1);
  const input = document.getElementById(`input-${listNumber}`);
  const submit = document.getElementById(`submit${listNumber}`);
  input.value = editElement;
  submit.textContent = "edit";
  deleteItem(e);
}

function addToLocalStorage(key, id, value) {
  const grocery = {id:id, value:value};
  let items = getLocalStorage(key);
  items.push(grocery);
  localStorage.setItem(key, JSON.stringify(items));
}

function removeFromLocalStorage(key, id) {
  let items = getLocalStorage(key);

  items = items.filter( function (item) {
    if(item.id !== id){
      return item;
      }
    });
  localStorage.setItem(key, JSON.stringify(items));
}

function getLocalStorage(key) {
  return localStorage.getItem(key)
     ? JSON.parse(localStorage.getItem(key))
     : [];
}

window.addEventListener("DOMContentLoaded", setupItems);

function setupItems() {
  let keys = Object.keys(localStorage);
  keys.sort();
  if(keys.length > 0) {
      keys.forEach(function(key) {
      let items = getLocalStorage(key);
      createList(key);
      if(items.length > 0){
        items.forEach(function(item){
          addOldItems(key, item.id, item.value);
        });
      } else if(items.length === 0){
        deleteEmptyList(key);
        localStorage.removeItem(key);
        removedKeys++
      }
    });
  };
  key = keys.length + 1 - removedKeys;
}

function createList(key){
  const section = document.createElement('section');
  const thisKey = key.charAt(key.length-1);
  section.setAttribute('id', `section-${thisKey}`);
  section.setAttribute('class', 'section-center');
  document.getElementById('wrapper').appendChild(section);
  section.innerHTML = `<h3 class="section-title">List ${thisKey}</h3>
  <input type="text" id="input-${thisKey}">
  <button id="submit${thisKey}" class="submit-btn">New List Item</button>`;
  const btn = section.querySelector(`#submit${thisKey}`);

  btn.addEventListener('click', createListItem);
}

function addOldItems(key, id, value){
  const thisKey = key;
  const anotherKey = thisKey.charAt(thisKey.length-1);
  const div = document.createElement('div');
  const section = document.getElementById(thisKey);
    div.setAttribute('class', 'listItem');
    div.setAttribute('id', id);
    section.appendChild(div);
    div.innerHTML =`
      <span>${value}</span>
      <button id="delete${anotherKey}" type="button" class="delete-btn">
        <i class="fas fa-trash"></i>
      </button>
      <button id="edit${anotherKey}" type="button" class="edit-btn">
        <i class="fas fa-edit"></i>
      </button>
    `;
    const deleteBtn = div.querySelector(`#delete${anotherKey}`);
    const editBtn = div.querySelector(`#edit${anotherKey}`);
    const done = div.querySelector('span');

    deleteBtn.addEventListener('click', deleteItem);
    editBtn.addEventListener('click', editItem);
    done.addEventListener('click', doneItem);
}

function deleteEmptyList(key){
const section = document.getElementById(key);
document.getElementById('wrapper').removeChild(section);
}

function doneItem(e) {
    e.target.classList.toggle('checked');
}
