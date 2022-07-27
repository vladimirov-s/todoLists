import { pics, header, url } from "./constants.js";
const allTasks = [];
let valueInput = "";
const input = document.querySelector(".createTaskInp");

const sortAllTask = () => {
  allTasks.sort((a, b) => {
    return a.isCheck - b.isCheck;
  });
};

window.onload = async () => {
  const buttonaddTask = document.querySelector(".addTask");
  const deleteAll = document.querySelector("#deleteAll");
  deleteAll.onclick = () => deleteAllTasks();
  buttonaddTask.onclick = () => createTask();
  input.addEventListener("change", updateValue);
  const response = await fetch(`${url}/`, {
    method: "GET",
  });
  let result = await response.json();
  result.forEach((element) => {
    allTasks.push(element);
  });
  render();
  input.addEventListener("keyup", (e) => {
    if (e.keyCode === 13) {
      createTask();
    }
  });
};

const createTask = async () => {
  if (valueInput.trim()) {
    const response = await fetch(`${url}/`, {
      method: "POST",
      headers: header,
      body: JSON.stringify({
        text: valueInput,
        isCheck: false,
      }),
    });
    const resukt = await response.json();
    allTasks.push(resukt);
    valueInput = "";
    input.value = "";
    render();
  }
};

const deleteTask = async (index) => {
  const response = await fetch(`${url}/${index}`, {
    method: "DELETE",
  });
  const result = await response.json();
  allTasks.findIndex((element, index) => {
    try {
      if (element._id === result._id) {
        allTasks.splice(index, 1);
        render();
      }
    } catch (err) {
      return;
    }
  });
};

const deleteAllTasks = async () => {
  const response = await fetch(`${url}/`, {
    method: "DELETE",
  });
  if (response.status === 200) {
    allTasks.length = 0;
  }
  render();
};

const updateValue = (event) => {
  valueInput = event.target.value;
};

const render = () => {
  sortAllTask();
  const content = document.getElementById("output");
  content.innerHTML = "";
  allTasks.forEach((item, idx) => {
    const { _id, isCheck, text } = item;
    const container = document.createElement("div");
    container.id = `id-${idx}`;
    container.classList.add("task");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = isCheck;
    checkbox.onclick = () => {
      changeCheckbox(item);
    };
    container.appendChild(checkbox);
    const texts = document.createElement("p");
    texts.innerText = text;
    texts.id = `text-${_id}`;
    isCheck
      ? (texts.className = "text-task done-text")
      : (texts.className = "text-task");
    container.appendChild(texts);
    const imageEditTheTask = document.createElement("i");
    imageEditTheTask.innerHTML = pics.edit;
    imageEditTheTask.title = "Edit";
    if (!isCheck) {
      container.appendChild(imageEditTheTask);
    }
    const imageDeleteOneTask = document.createElement("i");
    imageDeleteOneTask.innerHTML = pics.close;
    imageDeleteOneTask.title = "Delete";
    container.appendChild(imageDeleteOneTask);
    imageDeleteOneTask.onclick = () => {
      deleteTask(_id);
    };
    content.appendChild(container);
    imageEditTheTask.onclick = () => {
      onClickEdit(container, _id, item, text);
    };
  });
};

const changeCheckbox = (elem) => {
  elem.isCheck = !elem.isCheck;
  saveEdit(elem);
};

const onClickEdit = async (container, idx, elem, oldText) => {
  const confirmEdit = document.createElement("button");
  const cancelButton = document.createElement("button");
  const editInput = document.createElement("input");
  editInput.id = `input-${idx}`;
  const wrapForEdit = document.createElement("div");
  wrapForEdit.classList.add("editTask");
  cancelButton.innerText = "Cancel";
  confirmEdit.innerText = "Save";
  editInput.type = "text";
  editInput.value = oldText;
  editInput.title = "ESC для отмены, ENTER для ввода";
  editInput.placeholder = "Редактирование задачи";
  wrapForEdit.appendChild(editInput);
  wrapForEdit.appendChild(confirmEdit);
  wrapForEdit.appendChild(cancelButton);
  container.appendChild(wrapForEdit);
  editInput.focus();
  editInput.onkeyup = (e) => {
    if (e.keyCode == 13) {
      elem.text = editInput.value;
      saveEdit(elem);
    }
  };

  confirmEdit.onclick = () => {
    if (editInput.value) {
      elem.text = editInput.value;
      saveEdit(elem);
    }
    container.removeChild(wrapForEdit);
  };

  cancelButton.onclick = () => {
    container.removeChild(wrapForEdit);
  };
};

const saveEdit = async (elem) => {
  const { _id, text, isCheck } = elem;

  const response = await fetch(`${url}/${_id}`, {
    method: "PATCH",
    headers: header,
    body: JSON.stringify({ text, isCheck }),
  });

  const res = await response.json();
  allTasks.findIndex((element, index) => {
    try {
      if (element._id === result._id) {
        allTasks.splice(index, 1, res);
      }
    } catch (err) {
      return;
    }
  });
  render();
};
