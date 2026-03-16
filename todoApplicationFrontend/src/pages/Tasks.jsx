import { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import API from "../services/api";
import "../styles/Tasks.css";

function Tasks() {

  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [projectId, setProjectId] = useState("");
  const [priority, setPriority] = useState("");

  const [editingTask, setEditingTask] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDueDate, setEditDueDate] = useState("");
  const [editProjectId, setEditProjectId] = useState("");
  const [editPriority, setEditPriority] = useState("");
  const [editError, setEditError] = useState("");

  const today = new Date().toISOString().split("T")[0];
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchTasks();
    fetchProjects();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await API.get(`/tasks/user/${userId}`);
      setTasks(res.data);
    } catch (err) {
      console.log("Error fetching tasks", err);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await API.get(`/projects/user/${userId}`);
      setProjects(res.data);
    } catch (err) {
      console.log("Error fetching projects", err);
    }
  };

  const getProjectDueDate = (projId) => {
    const project = projects.find(p => p.projectId === parseInt(projId));
    return project ? project.dueDate : null;
  };

  const validateDueDate = (taskDueDate, projId) => {
    if (!taskDueDate) return "Due date is required";
    if (taskDueDate < today) return "Due date cannot be in the past";

    const projectDueDate = getProjectDueDate(projId);
    if (projectDueDate && taskDueDate > projectDueDate) {
      return `Due date must be on or before project due date (${projectDueDate})`;
    }
    return null;
  };

  const handleCreateTask = async () => {

    setError("");

    if (!taskName.trim()) {
      setError("Task name is required");
      return;
    }

    if (!projectId) {
      setError("Please select a project");
      return;
    }

    if (!priority) {
      setError("Please select a priority");
      return;
    }

    const dateError = validateDueDate(dueDate, projectId);
    if (dateError) {
      setError(dateError);
      return;
    }

    try {

      const task = {
        taskName,
        description,
        dueDate,
        status: "Pending",
        project: { projectId: parseInt(projectId) },
        priority: { priorityId: parseInt(priority) }
      };

      await API.post("/tasks", task);

      setShowForm(false);
      setTaskName("");
      setDescription("");
      setDueDate("");
      setProjectId("");
      setPriority("");

      fetchTasks();

    } catch (err) {
      console.log("Error creating task", err);
      setError("Failed to create task. Try again.");
    }
  };

  const handleEditClick = (task) => {
    setEditingTask(task.taskId);
    setEditName(task.taskName);
    setEditDescription(task.description || "");
    setEditDueDate(task.dueDate || "");
    setEditProjectId(task.project?.projectId || "");
    setEditPriority(task.priority?.priorityId || "");
    setEditError("");
  };

  const handleEditSave = async (taskId) => {

    setEditError("");

    if (!editName.trim()) {
      setEditError("Task name is required");
      return;
    }

    if (!editProjectId) {
      setEditError("Please select a project");
      return;
    }

    if (!editPriority) {
      setEditError("Please select a priority");
      return;
    }

    const dateError = validateDueDate(editDueDate, editProjectId);
    if (dateError) {
      setEditError(dateError);
      return;
    }

    try {

      await API.patch(`/tasks/${taskId}`, {
        taskName: editName,
        description: editDescription,
        dueDate: editDueDate,
        project: { projectId: parseInt(editProjectId) },
        priority: { priorityId: parseInt(editPriority) }
      });

      setEditingTask(null);
      fetchTasks();

    } catch (err) {
      console.log("Error updating task", err);
      setEditError("Failed to update task. Try again.");
    }
  };

    const handleDelete = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      await API.delete(`/tasks/${taskId}`);
      setSuccess("Task deleted successfully!"); // ✅
      fetchTasks();

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.log("Error deleting task", err);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await API.patch(`/tasks/${taskId}`, { status: newStatus });
      fetchTasks();
    } catch (err) {
      console.log("Error updating status", err);
    }
  };

  const getPriorityLabel = (priorityId) => {
    const map = { 1: "Priority 1", 2: "Priority 2", 3: "Priority 3" };
    return map[priorityId] || "—";
  };

  const getProjectName = (task) => {
    return task.project?.projectName || "—";
  };

  return (
    <DashboardLayout>

      <div className="tasks-page">

        <div className="tasks-header">
          <h1>My Tasks</h1>
          {success && <p className="success-message">{success}</p>}
          <button
            className="add-task-btn"
            onClick={() => { setShowForm(!showForm); setError(""); }}
          >
            + Add Task
          </button>
        </div>

        
        {showForm && (
          <div className="add-task-form">

           <input
              type="text"
              placeholder="Task Name"
              value={taskName}
              onChange={(e) => {
                setTaskName(e.target.value);
                if(e.target.value) setError(""); 
              }}
              className={!taskName && error ? "input-error" : ""}
            />

            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <input
              type="date"
              value={dueDate}
              min={today}
              onChange={(e) => setDueDate(e.target.value)}
            />

            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
            >
              <option value="">Select Project</option>
              {projects.map((p) => (
                <option key={p.projectId} value={p.projectId}>
                  {p.projectName}
                </option>
              ))}
            </select>

            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="">Select Priority</option>
              <option value="1">Priority 1</option>
              <option value="2">Priority 2</option>
              <option value="3">Priority 3</option>
            </select>

            {error && <p className="form-error">{error}</p>}

            <div className="form-buttons">
              <button className="create-task-btn" onClick={handleCreateTask}>
                Create Task
              </button>
              <button className="cancel-btn" onClick={() => { setShowForm(false); setError(""); }}>
                Cancel
              </button>
            </div>

          </div>
        )}

      
        <div className="tasks-list">

          {tasks.length === 0 && (
            <p className="no-data">No tasks yet. Create one!</p>
          )}

          {tasks.map((task) => (
            <div key={task.taskId} className="task-item">

              {editingTask === task.taskId ? (

            
                <div className="edit-form">

                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />

                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                  />

                  <input
                    type="date"
                    value={editDueDate}
                    min={today}
                    onChange={(e) => setEditDueDate(e.target.value)}
                  />

                  <select
                    value={editProjectId}
                    onChange={(e) => setEditProjectId(e.target.value)}
                  >
                    <option value="">Select Project</option>
                    {projects.map((p) => (
                      <option key={p.projectId} value={p.projectId}>
                        {p.projectName}
                      </option>
                    ))}
                  </select>

                  <select
                    value={editPriority}
                    onChange={(e) => setEditPriority(e.target.value)}
                  >
                    <option value="">Select Priority</option>
                    <option value="1">Priority 1</option>
                    <option value="2">Priority 2</option>
                    <option value="3">Priority 3</option>
                  </select>

                  {editError && <p className="form-error">{editError}</p>}

                  <div className="form-buttons">
                    <button className="save-btn" onClick={() => handleEditSave(task.taskId)}>
                      Save
                    </button>
                    <button className="cancel-btn" onClick={() => setEditingTask(null)}>
                      Cancel
                    </button>
                  </div>

                </div>

              ) : (

                /* VIEW MODE */
                <div className="task-details">

                  <div className="task-info">
                    <h3>{task.taskName}</h3>
                    <p>{task.description || "No description"}</p>
                    <div className="task-meta">
                      <span className="due-date">Due: {task.dueDate || "—"}</span>
                      <span className="project-name">Project: {getProjectName(task)}</span>
                      <span className="priority">
                        {getPriorityLabel(task.priority?.priorityId)}
                      </span>
                      <span className={`status status-${task.status?.toLowerCase()}`}>
                        {task.status}
                      </span>
                    </div>
                  </div>

                  <div className="task-actions">

                    {task.status !== "Completed" && (
                      <button
                        className="complete-btn"
                        onClick={() => handleStatusChange(task.taskId, "Completed")}
                      >
                        ✓ Complete
                      </button>
                    )}

                    <button className="edit-btn" onClick={() => handleEditClick(task)}>
                      Edit
                    </button>

                    <button className="delete-btn" onClick={() => handleDelete(task.taskId)}>
                      Delete
                    </button>

                  </div>

                </div>

              )}

            </div>
          ))}

        </div>

      </div>

    </DashboardLayout>
  );
}

export default Tasks;