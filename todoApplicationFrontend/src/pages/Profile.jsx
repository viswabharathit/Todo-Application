import { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import API from "../services/api";
import "../styles/Profile.css";

function Profile() {

  const userId = localStorage.getItem("userId");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [gender, setGender] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await API.get(`/users/${userId}`);
      setName(res.data.userName);
      setEmail(res.data.email);
      setCountry(res.data.country || "");
      setGender(res.data.gender || "");
    } catch (err) {
      console.log("Error fetching user", err);
    }
  };

  const handleUpdate = async () => {

    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    try {
      await API.patch(`/users/${userId}`, {
        userName: name,
        country,
        gender
      });

      setSuccess("Profile updated successfully!");
      setIsEditing(false);

      // update email in localStorage if needed
      localStorage.setItem("email", email);

    } catch (err) {
      console.log("Error updating user", err);
      setError("Failed to update profile. Try again.");
    }
  };

  return (
    <DashboardLayout>

      <div className="profile-page">

        <h1>My Profile</h1>

        <div className="profile-card">

          <div className="profile-avatar">
            {email.charAt(0).toUpperCase()}
          </div>

          <div className="profile-form">

            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={name}
                disabled={!isEditing}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                disabled={true} // email never editable
                className="disabled-input"
              />
            </div>

            <div className="form-group">
              <label>Country</label>
              <select
                value={country}
                disabled={!isEditing}
                onChange={(e) => setCountry(e.target.value)}
              >
                <option value="">Select Country</option>
                <option value="India">India</option>
                <option value="Italy">Italy</option>
              </select>
            </div>

            <div className="form-group">
              <label>Gender</label>
              <select
                value={gender}
                disabled={!isEditing}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            {error && <p className="form-error">{error}</p>}
            {success && <p className="form-success">{success}</p>}

            <div className="profile-buttons">
              {!isEditing ? (
                <button
                  className="edit-profile-btn"
                  onClick={() => { setIsEditing(true); setSuccess(""); }}
                >
                  Edit Profile
                </button>
              ) : (
                <>
                  <button className="save-profile-btn" onClick={handleUpdate}>
                    Save Changes
                  </button>
                  <button
                    className="cancel-btn"
                    onClick={() => { setIsEditing(false); setError(""); fetchUser(); }}
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>

          </div>

        </div>

      </div>

    </DashboardLayout>
  );
}

export default Profile;