const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");

const filterButtons = document.querySelectorAll(".filter-btn");

let currentFilter = "all";

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateStats() {

  totalTasks.textContent = tasks.length;

  const completedCount =
    tasks.filter(task => task.completed).length;

  completedTasks.textContent = completedCount;
}

function displayTasks() {

  taskList.innerHTML = "";

  let filteredTasks = tasks;

  if (currentFilter === "active") {
    filteredTasks = tasks.filter(task => !task.completed);
  }

  if (currentFilter === "completed") {
    filteredTasks = tasks.filter(task => task.completed);
  }

  if (filteredTasks.length === 0) {

    taskList.innerHTML = `
      <p class="empty-message">
        No tasks found
      </p>
    `;

    return;
  }

  filteredTasks.forEach((task, index) => {

    const li = document.createElement("li");

    li.classList.add("task-item");

    li.innerHTML = `
      <div class="task-left">

        <input
          type="checkbox"
          ${task.completed ? "checked" : ""}
          class="checkbox"
        >

        <span class="
          task-text
          ${task.completed ? "completed" : ""}
        ">
          ${task.text}
        </span>

      </div>

      <div class="task-buttons">

        <button class="edit-btn">
          Edit
        </button>

        <button class="delete-btn">
          Delete
        </button>

      </div>
    `;

    const checkbox =
      li.querySelector(".checkbox");

    checkbox.addEventListener("change", () => {

      task.completed = checkbox.checked;

      saveTasks();

      displayTasks();
    });

    const editBtn =
      li.querySelector(".edit-btn");

    editBtn.addEventListener("click", () => {

      const updatedTask =
        prompt("Edit your task", task.text);

      if (
        updatedTask !== null &&
        updatedTask.trim() !== ""
      ) {

        task.text = updatedTask;

        saveTasks();

        displayTasks();
      }
    });

    const deleteBtn =
      li.querySelector(".delete-btn");

    deleteBtn.addEventListener("click", () => {

      tasks.splice(index, 1);

      saveTasks();

      displayTasks();
    });

    taskList.appendChild(li);

  });

  updateStats();
}

addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keypress", (e) => {

  if (e.key === "Enter") {
    addTask();
  }
});

function addTask() {

  const taskText = taskInput.value.trim();

  if (taskText === "") {

    alert("Please enter a task");

    return;
  }

  tasks.push({
    text: taskText,
    completed: false
  });

  saveTasks();

  displayTasks();

  taskInput.value = "";
}

filterButtons.forEach(button => {

  button.addEventListener("click", () => {

    filterButtons.forEach(btn =>
      btn.classList.remove("active")
    );

    button.classList.add("active");

    currentFilter =
      button.dataset.filter;

    displayTasks();

  });

});

displayTasks();