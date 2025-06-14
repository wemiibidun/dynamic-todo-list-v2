document.addEventListener("DOMContentLoaded", function () {
  const taskCategory = document.getElementById("taskCategory");

  taskCategory.addEventListener("change", function () {
    const category = this.value;

    // Show/hide extra fields based on category
    document.getElementById("locationField").style.display = category === "Personal" ? "block" : "none";
    document.getElementById("projectField").style.display = category === "Work" ? "block" : "none";
    document.getElementById("subjectField").style.display = category === "Study" ? "block" : "none";
  });
});

// Base Task constructor
function Task(id, name, description, date, category, urgent, order) {
  this.id = id;
  this.name = name;
  this.description = description;
  this.date = date;
  this.category = category;
  this.urgent = urgent;
  this.order = order;
}

Task.prototype.getSummary = function () {
  return `${this.name} (${this.category}) - Due: ${this.date}`;
};

// ---- PERSONAL TASK ----
function PersonalTask(id, name, description, date, urgent, order, location) {
  Task.call(this, id, name, description, date, "Personal", urgent, order);
  this.location = location;
}

PersonalTask.prototype = Object.create(Task.prototype);
PersonalTask.prototype.constructor = PersonalTask;

// ---- WORK TASK ----
function WorkTask(id, name, description, date, urgent, order, projectName) {
  Task.call(this, id, name, description, date, "Work", urgent, order);
  this.projectName = projectName;
}

WorkTask.prototype = Object.create(Task.prototype);
WorkTask.prototype.constructor = WorkTask;

// ---- STUDY TASK ----
function StudyTask(id, name, description, date, urgent, order, subject) {
  Task.call(this, id, name, description, date, "Study", urgent, order);
  this.subject = subject;
}

StudyTask.prototype = Object.create(Task.prototype);
StudyTask.prototype.constructor = StudyTask;