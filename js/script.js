// Store all tasks in an array
let taskList = [];
let isEditing = false;
let editingId = null;

// Get references to DOM elements
const form = document.getElementById('taskForm');
const taskListContainer = document.getElementById('taskList');
const addButton = document.getElementById('taskButton');

// Handle form submit
form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Get values from form fields
    const name = document.getElementById("taskName").value;
    const description = document.getElementById("taskDescription").value;
    const date = document.getElementById("taskDate").value;
    const category = document.getElementById("taskCategory").value;
    const urgent = document.getElementById("taskUrgent").checked;
    const order = parseInt(document.getElementById("taskOrder").value) || taskList.length + 1;

    // Create task object with all fields stored as properties
    const task = {
        // Use the existing ID if editing, otherwise generate a new unique one based on the current time
        id: isEditing ? editingId : Date.now(),
        name,
        description,
        date,
        category,
        urgent,
        order
    };

    if (isEditing) {
        // Updating an existing task
        taskList = taskList.map(function(t) {
            if (t.id === editingId) {
                return task; // Replace with the updated task
            } else {
                return t; // Keep the rest unchanged
            }
        });
    
        // Reset editing state
        isEditing = false;
        editingId = null;
    
        // Change the button text back to "Add Task"
        addButton.innerHTML = '<i class="bi bi-plus-circle"></i> Add Task';
    } else {
        // Add the new task to the end of the task list
        taskList.push(task);
    }

    form.reset();
    showTasks(); // Tasks appear on HTML page without reload
});

// This function displays all tasks on the page
function showTasks() {
    // Clear the current task list
    taskListContainer.innerHTML = "";

    // Make a copy of the task list and sort it
    const tasksToShow = taskList.slice(); // makes a copy of the array
    tasksToShow.sort(function (a, b) {
        return a.order - b.order; // sort in ascending order
    });

    // Loop through each task and create a task card
    tasksToShow.forEach(function (task) {
        // Create a new div for the task card
        const taskCard = document.createElement("div");

        // Add the class (and 'urgent' if applicable)
        taskCard.className = "task-card" + (task.urgent ? " urgent" : "");

        // Fill in the task's content
        taskCard.innerHTML = `
        <h6>${task.order}. ${task.name} ${task.urgent ? '<span class="badge bg-danger">Urgent</span>' : ''}</h6>
        <p>${task.description}</p>
        <small>
        <strong>Date:</strong> ${task.date || 'N/A'} |
        <strong>Category:</strong> ${task.category}
        </small>
        <div class="mt-2 d-flex justify-content-end gap-2">
        <button class="btn btn-sm btn-outline-primary" onclick="editTask(${task.id})">Edit</button>
        <button class="btn btn-sm btn-outline-danger" onclick="deleteTask(${task.id})">Delete</button>
        </div>
    `;
        // Add the task card to the page
        taskListContainer.appendChild(taskCard);
    });
}

// Edit a task
function editTask(id) {
    const task = taskList.find(t => t.id === id);

    // Fill the form with task info
    document.getElementById("taskName").value = task.name;
    document.getElementById("taskDescription").value = task.description;
    document.getElementById("taskDate").value = task.date;
    document.getElementById("taskCategory").value = task.category;
    document.getElementById("taskUrgent").checked = task.urgent;
    document.getElementById("taskOrder").value = task.order;

    isEditing = true;
    editingId = id;
    addButton.innerHTML = '<i class="bi bi-arrow-repeat"></i> Update Task';
}

// Delete one task
function deleteTask(id) {
    taskList = taskList.filter(task => task.id !== id);
    showTasks();
}

// Clear all tasks
function clearTasks() {
    taskList = [];
    showTasks();
}

// Show or hide all tasks
function toggleTasks() {
    taskListContainer.style.display = taskListContainer.style.display === 'none' ? 'block' : 'none';
}
