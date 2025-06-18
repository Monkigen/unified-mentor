let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = "";
  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    if (task.completed) li.classList.add("completed");

    li.innerHTML = `
      <span>
        <input type="checkbox" ${task.completed ? "checked" : ""} data-index="${index}" class="toggle">
        ${task.text}
      </span>
      <span class="actions">
        <button class="edit" data-index="${index}">Edit</button>
        <button class="delete" data-index="${index}">Delete</button>
      </span>
    `;
    taskList.appendChild(li);
  });
}

taskForm.addEventListener("submit", e => {
  e.preventDefault();
  const text = taskInput.value.trim();
  if (!text) {
    alert("Task cannot be empty.");
    return;
  }

  tasks.push({ text, completed: false });
  taskInput.value = "";
  saveTasks();
  renderTasks();
});

taskList.addEventListener("click", e => {
  const index = e.target.dataset.index;

  if (e.target.classList.contains("delete")) {
    tasks.splice(index, 1);
  }

  if (e.target.classList.contains("edit")) {
    const newText = prompt("Edit task:", tasks[index].text);
    if (newText !== null && newText.trim()) {
      tasks[index].text = newText.trim();
    }
  }

  if (e.target.classList.contains("toggle")) {
    tasks[index].completed = !tasks[index].completed;
  }

  saveTasks();
  renderTasks();
});

renderTasks();
