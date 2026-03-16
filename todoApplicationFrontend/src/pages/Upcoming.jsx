import { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import API from "../services/api";
import "../styles/FilteredTasks.css";

function Upcoming() {

  const [tasks, setTasks] = useState([]);
  const today = new Date().toISOString().split("T")[0];
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchUpcomingTasks();
  }, []);

  const fetchUpcomingTasks = async () => {
    try {
      const res = await API.get(`/tasks/user/${userId}`);
      const upcomingTasks = res.data.filter(task => task.dueDate > today);
      setTasks(upcomingTasks);
    } catch (err) {
      console.log("Error fetching upcoming tasks", err);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await API.patch(`/tasks/${taskId}`, { status: newStatus });
      fetchUpcomingTasks();
    } catch (err) {
      console.log("Error updating status", err);
    }
  };

  return (
    <DashboardLayout>

      <div className="filtered-tasks-page">

        <h1>Upcoming Tasks</h1>
        <p className="subtitle">Tasks due after today</p>

        <div className="tasks-list">

          {tasks.length === 0 && (
            <p className="no-data">No upcoming tasks!</p>
          )}

          {tasks.map((task) => (
            <div key={task.taskId} className="task-item">

              <div className="task-details">

                <div className="task-info">
                  <h3>{task.taskName}</h3>
                  <p>{task.description || "No description"}</p>
                  <div className="task-meta">
                    <span className="due-date">Due: {task.dueDate}</span>
                    <span className="project-name">
                      Project: {task.project?.projectName || "—"}
                    </span>
                    <span className="priority">
                      {task.priority?.priorityName || "—"}
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
                </div>

              </div>

            </div>
          ))}

        </div>

      </div>

    </DashboardLayout>
  );
}

export default Upcoming;