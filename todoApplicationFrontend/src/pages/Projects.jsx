import { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import API from "../services/api";
import "../styles/Projects.css";

function Projects() {

  const [showForm, setShowForm] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [editingProject, setEditingProject] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDueDate, setEditDueDate] = useState("");
  const [editError, setEditError] = useState("");

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const res = await API.get(`/projects/user/${userId}`);
      setProjects(res.data);
    } catch (err) {
      console.log("Error fetching projects", err);
    }
  };

  const handleCreateProject = async () => {

    setError("");

    if (!projectName.trim()) {
      setError("Project name is required");
      return;
    }

    if (!dueDate) {
      setError("Due date is required");
      return;
    }

    if (dueDate < today) {
      setError("Due date cannot be in the past");
      return;
    }

    try {
      const userId = localStorage.getItem("userId");

      const project = {
        projectName,
        description,
        dueDate,
        user: {
          userId: parseInt(userId)
        }
      };

      await API.post("/projects", project);

      setShowForm(false);
      setProjectName("");
      setDescription("");
      setDueDate("");

      fetchProjects();

    } catch (err) {
      console.log("Error creating project", err);
      setError("Failed to create project. Try again.");
    }
  };

  const handleEditClick = (project) => {
    setEditingProject(project.projectId);
    setEditName(project.projectName);
    setEditDescription(project.description || "");
    setEditDueDate(project.dueDate || "");
    setEditError("");
  };

  const handleEditSave = async (projectId) => {

    setEditError("");

    if (!editName.trim()) {
      setEditError("Project name is required");
      return;
    }

    if (!editDueDate) {
      setEditError("Due date is required");
      return;
    }

    if (editDueDate < today) {
      setEditError("Due date cannot be in the past");
      return;
    }

    try {
      await API.patch(`/projects/${projectId}`, {
        projectName: editName,
        description: editDescription,
        dueDate: editDueDate
      });

      setEditingProject(null);
      fetchProjects();

    } catch (err) {
      console.log("Error updating project", err);
      setEditError("Failed to update project. Try again.");
    }
  };

    const handleDelete = async (projectId) => {
      if (!window.confirm("Are you sure you want to delete this project?")) return;

      try {
        await API.delete(`/projects/${projectId}`);
        setSuccess("Project deleted successfully!"); 
        fetchProjects();

        setTimeout(() => setSuccess(""), 3000);
      } catch (err) {
        console.log("Error deleting project", err);
      }
     };

  return (
    <DashboardLayout>

      <div className="projects-page">

        <div className="projects-header">
          <h1>My Projects</h1>
          {success && <p className="success-message">{success}</p>}
          <button
            className="add-project-btn"
            onClick={() => { setShowForm(!showForm); setError(""); }}
          >
            + Add Project
          </button>
        </div>

  
        {showForm && (
          <div className="add-project-form">

            <input
              type="text"
              placeholder="Project Name"
              value={projectName}
              onChange={(e) => {
                setProjectName(e.target.value);
                if(e.target.value) setError("");
              }}
              className={!projectName && error ? "input-error" : ""}
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

            {error && <p className="form-error">{error}</p>}

            <div className="form-buttons">
              <button className="create-project-btn" onClick={handleCreateProject}>
                Create Project
              </button>
              <button className="cancel-btn" onClick={() => { setShowForm(false); setError(""); }}>
                Cancel
              </button>
            </div>

          </div>
        )}

        {/* PROJECTS LIST */}
        <div className="projects-list">

          {projects.length === 0 && (
            <p className="no-data">No projects yet. Create one!</p>
          )}

          {projects.map((project) => (
            <div key={project.projectId} className="project-item">

              {editingProject === project.projectId ? (

                /* EDIT MODE */
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

                  {editError && <p className="form-error">{editError}</p>}

                  <div className="form-buttons">
                    <button className="save-btn" onClick={() => handleEditSave(project.projectId)}>
                      Save
                    </button>
                    <button className="cancel-btn" onClick={() => setEditingProject(null)}>
                      Cancel
                    </button>
                  </div>

                </div>

              ) : (

                /* VIEW MODE */
                <div className="project-details">

                  <div className="project-info">
                    <h3>{project.projectName}</h3>
                    <p>{project.description || "No description"}</p>
                    <span className="due-date">Due: {project.dueDate || "No due date"}</span>
                  </div>

                  <div className="project-actions">
                    <button className="edit-btn" onClick={() => handleEditClick(project)}>
                      Edit
                    </button>
                    <button className="delete-btn" onClick={() => handleDelete(project.projectId)}>
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

export default Projects;