// Store all tasks in an array
let taskList = [];
// Load tasks from localStorage if available
const savedTasks = localStorage.getItem("myTasks");

if (savedTasks) {
  const parsedTasks = JSON.parse(savedTasks);
  taskList = parsedTasks.map(t => {
    switch (t.category) {
      case "Personal":
        return new PersonalTask(t.id, t.name, t.description, t.date, t.urgent, t.order, t.location);
      case "Work":
        return new WorkTask(t.id, t.name, t.description, t.date, t.urgent, t.order, t.projectName);
      case "Study":
        return new StudyTask(t.id, t.name, t.description, t.date, t.urgent, t.order, t.subject);
      default:
        return new Task(t.id, t.name, t.description, t.date, t.category, t.urgent, t.order);
    }
  });
}

// Define the Task class
let isEditing = false;
let editingId = null;

// Get references to DOM elements
const form = document.getElementById("taskForm");
const taskListContainer = document.getElementById("taskList");
const addButton = document.getElementById("taskButton");

// Handle form submit
form.addEventListener("submit", function (e) {
  e.preventDefault();

  // Get values from form fields
  const id = isEditing ? editingId : Date.now();
  const name = document.getElementById("taskName").value;
  const description = document.getElementById("taskDescription").value;
  const date = document.getElementById("taskDate").value;
  const category = document.getElementById("taskCategory").value;
  const urgent = document.getElementById("taskUrgent").checked;
  const order =
    parseInt(document.getElementById("taskOrder").value) || taskList.length + 1;

  let task;

  // Create appropriate task object using prototypal inheritance
  if (category === "Personal") {
    const location = document.getElementById("taskLocation").value;
    task = new PersonalTask(
      id,
      name,
      description,
      date,
      urgent,
      order,
      location
    );
  } else if (category === "Work") {
    const projectName = document.getElementById("taskProject").value;
    task = new WorkTask(
      id,
      name,
      description,
      date,
      urgent,
      order,
      projectName
    );
  } else if (category === "Study") {
    const subject = document.getElementById("taskSubject").value;
    task = new StudyTask(id, name, description, date, urgent, order, subject);
  } else {
    task = new Task(id, name, description, date, category, urgent, order);
  }

  if (isEditing) {
    // Updating an existing task
    taskList = taskList.map((t) => (t.id === editingId ? task : t));
    isEditing = false;
    editingId = null;
    addButton.innerHTML = '<i class="bi bi-plus-circle"></i> Add Task';
    console.log("Task created:", task);
  } else {
    taskList.push(task);
  }

  form.reset();
  localStorage.setItem("myTasks", JSON.stringify(taskList));
  showTasks();
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

    // Add drag/drop attributes
    taskCard.setAttribute("draggable", "true");
    taskCard.setAttribute("data-id", task.id);

    taskCard.addEventListener("dragstart", handleDragStart);
    taskCard.addEventListener("dragover", handleDragOver);
    taskCard.addEventListener("drop", handleDrop);
    taskCard.addEventListener("dragend", handleDragEnd);

    // Add the class (and 'urgent' if applicable)
    const categoryClass = task.category.toLowerCase(); // 'personal', 'work', or 'study'
    taskCard.className =
      `task-card ${categoryClass}` + (task.urgent ? " urgent" : "");

    // Choose badge class based on category
    let badgeClass = "";
    switch (task.category) {
      case "Personal":
        badgeClass = "bg-warning text-dark";
        break;
      case "Work":
        badgeClass = "bg-primary";
        break;
      case "Study":
        badgeClass = "bg-success";
        break;
      default:
        badgeClass = "bg-secondary";
    }

    // Additional info (like location, projectName, subject)
    let extraInfo = "";
    if (task instanceof PersonalTask) {
      extraInfo = `<br><strong>Location:</strong> ${task.location}`;
    } else if (task instanceof WorkTask) {
      extraInfo = `<br><strong>Project:</strong> ${task.projectName}`;
    } else if (task instanceof StudyTask) {
      extraInfo = `<br><strong>Subject:</strong> ${task.subject}`;
    }

    // Fill in the task's content
    taskCard.innerHTML = `
        <h6>${task.order}. ${task.name} ${
      task.urgent ? '<span class="badge bg-danger">Urgent</span>' : ""
    }</h6>
        <p>${task.description}</p>
        <small>
            <strong>Date:</strong> ${task.date || "N/A"} |
            <strong>Category:</strong> ${task.category}
            ${extraInfo}
        </small>
        <div class="mt-2 d-flex justify-content-end gap-2">
            <button class="btn btn-sm btn-outline-primary" onclick="editTask(${
              task.id
            })">Edit</button>
            <button class="btn btn-sm btn-outline-danger" onclick="deleteTask(${
              task.id
            })">Delete</button>
        </div>
        `;

    // Add the task card to the page
    taskListContainer.appendChild(taskCard);
  });
}

//Drag-and-Drop Event Handlers
let draggedTaskId = null;

function handleDragStart(e) {
  draggedTaskId = this.getAttribute("data-id");
  this.classList.add("dragging");
}

function handleDragOver(e) {
  e.preventDefault(); // Allow dropping
}

function handleDrop(e) {
  e.preventDefault();

  const targetId = this.getAttribute("data-id");
  if (draggedTaskId === targetId) return;

  const draggedIndex = taskList.findIndex((task) => task.id == draggedTaskId);
  const targetIndex = taskList.findIndex((task) => task.id == targetId);

  const [draggedTask] = taskList.splice(draggedIndex, 1);
  taskList.splice(targetIndex, 0, draggedTask);

  // Update task order numbers
  taskList.forEach((task, index) => {
    task.order = index + 1;
  });

  showTasks();
  localStorage.setItem("myTasks", JSON.stringify(taskList));
}

function handleDragEnd() {
  this.classList.remove("dragging");
  draggedTaskId = null;
}

// Edit a task
function editTask(id) {
  const task = taskList.find((t) => t.id === id);

  // Fill the form with task info
  document.getElementById("taskName").value = task.name;
  document.getElementById("taskDescription").value = task.description;
  document.getElementById("taskDate").value = task.date;
  document.getElementById("taskCategory").value = task.category;
  document.getElementById("taskUrgent").checked = task.urgent;
  document.getElementById("taskOrder").value = task.order;

  // Show/hide and fill category-specific fields
  const category = task.category;
  document.getElementById("locationField").style.display =
    category === "Personal" ? "block" : "none";
  document.getElementById("projectField").style.display =
    category === "Work" ? "block" : "none";
  document.getElementById("subjectField").style.display =
    category === "Study" ? "block" : "none";

  if (category === "Personal") {
    document.getElementById("taskLocation").value = task.location || "";
  } else if (category === "Work") {
    document.getElementById("taskProject").value = task.projectName || "";
  } else if (category === "Study") {
    document.getElementById("taskSubject").value = task.subject || "";
  }

  isEditing = true;
  editingId = id;
  addButton.innerHTML = '<i class="bi bi-arrow-repeat"></i> Update Task';
}

// Delete one task
function deleteTask(id) {
  taskList = taskList.filter((task) => task.id !== id);
  localStorage.setItem("myTasks", JSON.stringify(taskList));
  showTasks();
}

// Clear all tasks
function clearTasks() {
  taskList = [];
  localStorage.removeItem("myTasks");
  showTasks();
}

// Show or hide all tasks
function toggleTasks() {
  taskListContainer.style.display =
    taskListContainer.style.display === "none" ? "block" : "none";
}

showTasks();
