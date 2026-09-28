// Get elements from HTML

const taskInput = document.getElementById("taskInput");
const category = document.getElementById("category");
const priority = document.getElementById("priority");
const dueDate = document.getElementById("dueDate");
const addBtn = document.getElementById("addBtn");

const taskList = document.getElementById("taskList");
const emptyMessage = document.getElementById("emptyMessage");

const searchInput = document.getElementById("searchInput");
const filterButtons = document.querySelectorAll(".filter");

const totalTasks = document.getElementById("totalTasks");
const activeTasks = document.getElementById("activeTasks");
const completedTasks = document.getElementById("completedTasks");

const progress = document.getElementById("progress");
const progressText = document.getElementById("progressText");

const taskCount = document.getElementById("taskCount");
const clearCompleted = document.getElementById("clearCompleted");

const themeBtn = document.getElementById("themeBtn");


// Load tasks from local storage

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = "all";


// Save tasks

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}


// Add Task

addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keypress", function(event) {

    if (event.key === "Enter") {
        addTask();
    }

});


function addTask() {

    const title = taskInput.value.trim();

    if (title === "") {
        alert("Please enter a task.");
        return;
    }

    const newTask = {

        id: Date.now(),

        title: title,

        category: category.value,

        priority: priority.value,

        dueDate: dueDate.value,

        completed: false

    };

    tasks.push(newTask);

    saveTasks();

    taskInput.value = "";
    dueDate.value = "";

    displayTasks();

}


// Display Tasks

function displayTasks() {

    const searchText = searchInput.value.toLowerCase();

    let filteredTasks = tasks.filter(function(task) {

        const matchesSearch =
            task.title.toLowerCase().includes(searchText);

        let matchesFilter = true;

        if (currentFilter === "active") {
            matchesFilter = !task.completed;
        }

        if (currentFilter === "completed") {
            matchesFilter = task.completed;
        }

        return matchesSearch && matchesFilter;

    });


    taskList.innerHTML = "";


    if (filteredTasks.length === 0) {

        taskList.appendChild(emptyMessage);

    } else {

        filteredTasks.forEach(function(task) {

            const taskElement = document.createElement("div");

            taskElement.className =
                "task" + (task.completed ? " completed" : "");


            let dueText = "";

            if (task.dueDate) {

                const today = new Date();
                const date = new Date(task.dueDate);

                today.setHours(0, 0, 0, 0);
                date.setHours(0, 0, 0, 0);

                if (!task.completed && date < today) {

                    dueText =
                        `<span class="badge overdue">
                        ⚠️ Overdue: ${task.dueDate}
                        </span>`;

                } else {

                    dueText =
                        `<span class="badge">
                        📅 ${task.dueDate}
                        </span>`;

                }
            }


            taskElement.innerHTML = `

                <input
                    type="checkbox"
                    class="check"
                    ${task.completed ? "checked" : ""}
                    onclick="toggleTask(${task.id})"
                >

                <div class="task-content">

                    <div class="task-title">
                        ${task.title}
                    </div>

                    <div class="task-details">

                        <span class="badge">
                            🏷️ ${task.category}
                        </span>

                        <span class="badge ${task.priority.toLowerCase()}">
                            ⭐ ${task.priority}
                        </span>

                        ${dueText}

                    </div>

                </div>

                <div class="task-actions">

                    <button
                        class="edit-btn"
                        onclick="editTask(${task.id})">
                        ✏️
                    </button>

                    <button
                        class="delete-btn"
                        onclick="deleteTask(${task.id})">
                        🗑️
                    </button>

                </div>

            `;

            taskList.appendChild(taskElement);

        });

    }

    updateStats();

}


// Complete Task

function toggleTask(id) {

    tasks = tasks.map(function(task) {

        if (task.id === id) {
            task.completed = !task.completed;
        }

        return task;

    });

    saveTasks();

    displayTasks();
}


// Delete Task

function deleteTask(id) {

    tasks = tasks.filter(function(task) {

        return task.id !== id;

    });

    saveTasks();

    displayTasks();
}


// Edit Task

function editTask(id) {

    const task = tasks.find(function(task) {

        return task.id === id;

    });

    const newTitle = prompt(
        "Edit your task:",
        task.title
    );

    if (newTitle === null) {
        return;
    }

    if (newTitle.trim() === "") {
        alert("Task cannot be empty.");
        return;
    }

    task.title = newTitle.trim();

    saveTasks();

    displayTasks();
}


// Search

searchInput.addEventListener("input", function() {

    displayTasks();

});


// Filters

filterButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        filterButtons.forEach(function(btn) {

            btn.classList.remove("active");

        });

        button.classList.add("active");

        currentFilter =
            button.getAttribute("data-filter");

        displayTasks();

    });

});


// Statistics

function updateStats() {

    const total = tasks.length;

    const completed =
        tasks.filter(task => task.completed).length;

    const active = total - completed;

    totalTasks.textContent = total;

    activeTasks.textContent = active;

    completedTasks.textContent = completed;


    let percentage = 0;

    if (total > 0) {

        percentage =
            Math.round((completed / total) * 100);

    }

    progress.style.width = percentage + "%";

    progressText.textContent =
        percentage + "%";


    taskCount.textContent =
        active + (active === 1
            ? " task remaining"
            : " tasks remaining");

}


// Clear completed

clearCompleted.addEventListener("click", function() {

    tasks = tasks.filter(function(task) {

        return !task.completed;

    });

    saveTasks();

    displayTasks();

});


// Dark Mode

themeBtn.addEventListener("click", function() {

    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {

        themeBtn.textContent = "☀️";

        localStorage.setItem("darkMode", "true");

    } else {

        themeBtn.textContent = "🌙";

        localStorage.setItem("darkMode", "false");

    }

});


// Remember dark mode

if (localStorage.getItem("darkMode") === "true") {

    document.body.classList.add("dark");

    themeBtn.textContent = "☀️";

}


// Show tasks when page loads

displayTasks();
