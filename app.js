const TASKS_KEY = "daily_recurring_tasks_v1";

const addTaskForm = document.getElementById("add-task-form");
const newTaskInput = document.getElementById("new-task-input");
const taskList = document.getElementById("task-list");
const emptyState = document.getElementById("empty-state");

const today = new Date().toISOString().slice(0, 10);
let tasks = loadTasks();

render();

addTaskForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = newTaskInput.value.trim();
  if (!title) return;

  tasks.push({
    id: crypto.randomUUID(),
    title,
    lastCompletedDate: ""
  });

  newTaskInput.value = "";
  saveAndRender();
});

function loadTasks() {
  try {
    const raw = localStorage.getItem(TASKS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveTasks() {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

function saveAndRender() {
  saveTasks();
  render();
}

function render() {
  taskList.innerHTML = "";

  if (!tasks.length) {
    emptyState.hidden = false;
    return;
  }

  emptyState.hidden = true;

  for (const task of tasks) {
    const listItem = document.createElement("li");
    listItem.className = "task-item";

    const left = document.createElement("div");
    left.className = "task-left";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.lastCompletedDate === today;
    checkbox.addEventListener("change", () => {
      task.lastCompletedDate = checkbox.checked ? today : "";
      saveTasks();
    });

    const label = document.createElement("span");
    label.textContent = task.title;

    left.append(checkbox, label);

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-btn";
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => {
      tasks = tasks.filter((item) => item.id !== task.id);
      saveAndRender();
    });

    listItem.append(left, deleteButton);
    taskList.append(listItem);
  }
}
