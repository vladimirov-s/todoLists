import { pics, header, url } from "./constants.js";
let allTasks = [];
let valueInput = "";
let input = null;

const sortAllTask = () => {
  allTasks.sort((a, b) => {
    return a.isCheck - b.isCheck;
  });
};

window.onload = async () => {
  const b1 = document.getElementById("rectangleButtAbove");
  b1.onclick = () => {
    da6avitNovbiyTask();
  };
  input = document.getElementById("inpCreator");
  input.addEventListener("change", updateValue);
  const response = await fetch(`${url}/allTasks`, {
    method: "GET",
  });
  let result = await response.json();
  allTasks = result.data;
  render();
  input.addEventListener("keyup", e => {
    if (e.keyCode == 13) {
      da6avitNovbiyTask();
    }
  });
};

const da6avitNovbiyTask = async () => {
  if (valueInput.trim()) {
    const response = await fetch(`${url}/createTask`, {
      method: "POST",
      headers: header,
      body: JSON.stringify({
        text: valueInput,
        isCheck: false,
      }),
    });
    const resukt = await response.json();
    allTasks = resukt.data;
    valueInput = "";
    input.value = "";
    render();
  }
};

const deleteAllTasks = async () => {
  const response = await fetch(`${url}/deleteAll`, {
    method: "DELETE",
  });
  const result = await response.json();
  allTasks = result.data;
  render();
};

const updateValue = event => {
  valueInput = event.target.value;
};

const render = () => {
  sortAllTask();
  const content = document.getElementById("output");
  content.innerHTML = "";
  allTasks.map((item, idx) => {
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
      deleteSomeTask(_id);
    };
    content.appendChild(container);
    imageEditTheTask.onclick = () => {
      onClickEdit(container, _id, item, text);
    };
  });
};

const deleteSomeTask = async index => {
  const response = await fetch(`${url}/deleteTask?id=${index}`, {
    method: "DELETE",
  });
  const result = await response.json();
  allTasks = result.data;
  render();
};

const changeCheckbox = elem => {
  elem.isCheck = !elem.isCheck;
  saveEdit(elem);
};

const onClickEdit = async (container, idx, elem, oldText) => {
  const buttontEdit = document.createElement("button");
  const cancelButton = document.createElement("button");
  const editInput = document.createElement("input");
  editInput.id = `input-${idx}`;
  const wrapForEdit = document.createElement("div");
  wrapForEdit.classList.add("editTask");
  cancelButton.innerText = "Cancel";
  buttontEdit.innerText = "Save";
  editInput.type = "text";
  editInput.value = oldText;
  editInput.title = "ESC для отмены, ENTER для ввода";
  editInput.placeholder = "Редактирование задачи";
  wrapForEdit.appendChild(editInput);
  wrapForEdit.appendChild(buttontEdit);
  wrapForEdit.appendChild(cancelButton);
  container.appendChild(wrapForEdit);
  editInput.focus();
  editInput.onkeyup = e => {
    if (e.keyCode == 13) {
      elem.text = editInput.value;
      saveEdit(elem);
    }
  };

  buttontEdit.onclick = () => {
    if (editInput.value) {
      elem.text = editInput.value;
      saveEdit(elem);
    }
  };
  cancelButton.onclick = () => {
    container.removeChild(wrapForEdit);
  };
};

const saveEdit = async elem => {
  const { _id, text, isCheck } = elem;
  if (elem.text) {
    elem.text = text;
  }

  const response = await fetch(`${url}/updateTask`, {
    method: "PATCH",
    headers: header,
    body: JSON.stringify({ _id, text, isCheck }),
  });

  const res = await response.json();
  if (Array.isArray(res.data)) {
    allTasks = res.data;
    render();
  }
};
