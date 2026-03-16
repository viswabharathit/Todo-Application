import { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import API from "../services/api";
import "../styles/FilteredTasks.css";

function Pending() {

  const [tasks, setTasks] = useState([]);
  const today = new Date().toISOString().split("T")[0];
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchPendingTasks();
  }, []);

  const fetchPendingTasks = async () => {
    try {
      const res = await API.get(`/tasks/user/${userId}`);
      // Overdue + not completed
      const pendingTasks = res.data.filter(
        task => task.dueDate < today && task.status !== "Completed"
      );
      setTasks(pendingTasks);
    } catch (err) {
      console.log("Error fetching pending tasks", err);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await API.patch(`/tasks/${taskId}`, { status: newStatus });
      fetchPendingTasks();
    } catch (err) {
      console.log("Error updating status", err);
    }
  };

  return (
    <DashboardLayout>

      <div className="filtered-tasks-page">

        <h1>Pending Tasks</h1>
        <p className="subtitle">Overdue tasks that are not yet completed</p>

        <div className="tasks-list">

          {tasks.length === 0 && (
            <p className="no-data">No pending tasks!</p>
          )}

          {tasks.map((task) => (
            <div key={task.taskId} className="task-item">

              <div className="task-details">

                <div className="task-info">
                  <h3>{task.taskName}</h3>
                  <p>{task.description || "No description"}</p>
                  <div className="task-meta">
                    <span className="due-date overdue">
                      Overdue: {task.dueDate}
                    </span>
                    <span className="project-name">
                      Project: {task.project?.projectName || "—"}
                    </span>
                    <span className="priority">
                      {task.priority?.priorityName || "—"}
                    </span>
                    <span className="status status-pending">
                      Pending
                    </span>
                  </div>
                </div>

                <div className="task-actions">
                  <button
                    className="complete-btn"
                    onClick={() => handleStatusChange(task.taskId, "Completed")}
                  >
                    ✓ Complete
                  </button>
                </div>

              </div>

            </div>
          ))}

        </div>

      </div>

    </DashboardLayout>
  );
}

export default Pending;