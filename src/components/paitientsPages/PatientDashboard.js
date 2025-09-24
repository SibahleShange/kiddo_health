import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faUser,
  faSignOutAlt,
  faCalendarAlt,
  faChild,
  faVenusMars,
  faIdCard,
  faCamera,
  faPills,
  faAllergies,
  faPhone,
  faEnvelope,
  faStethoscope
} from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import "./PatientDashboard.css"; 
import { uploadChildProfilePicture } from "../../services/apiService";


export default function PatientDashboard({ user }) { 
  const [viewProfile, setViewProfile] = useState("Child");
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isProfileOpen, setProfileOpen] = useState(true);

   const navigate = useNavigate();


  const [currentChild, setCurrentChild] = useState(user?.children?.[0] || null);

   
  useEffect(() => {
    setCurrentChild(user?.children?.[0] || null);
  }, [user]);
 

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !currentChild) return;

    try {
      
      const updatedChild = await uploadChildProfilePicture(currentChild.childId, file);
      
      setCurrentChild(updatedChild);
      
    } catch (uploadError) {
      console.error("Error uploading image:", uploadError);
      alert("Failed to upload image.");
    }
  };
 
  if (!user || !currentChild) {
    return <div>Loading user data or no child found...</div>;
  }
  const parentData = user;

   const renderProfileDetails = () => {
    if (viewProfile === "Child") {
      return (
        <>
          <h2 className="mb-3">{currentChild.name} {currentChild.surname}</h2>
          <hr />
          <div className="detail-item">
            <FontAwesomeIcon icon={faIdCard} className="icon" />
            <span className="label">Age:</span>
            <span className="value">{currentChild.age}</span>
          </div>

          {/* other child details from currentChild object */}
          <div className="detail-item">
            <FontAwesomeIcon icon={faCalendarAlt} className="icon" />
            <span className="label">DOB:</span>
            <span className="value">{currentChild.dateOfBirth}</span>
          </div>
         
        </>
      );
    } else if (viewProfile === "Parent") {
      return (
        <>
          <h2 className="mb-3">{parentData.name} {parentData.surname}</h2>
          <hr />

          {/* render parent details from parentData object */}
          <div className="detail-item">
            <FontAwesomeIcon icon={faEnvelope} className="icon" />
            <span className="label">Email:</span>
            <span className="value">{parentData.email}</span>
          </div>
         
        </>
      );
    }
    return null;
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="d-flex align-items-center bg-primary text-white p-3 shadow-sm">
        <button
          className="btn btn-link text-white me-3"
          onClick={() => setSidebarOpen(!isSidebarOpen)}
        >
          <FontAwesomeIcon icon={faBars} size="lg" />
        </button>
        <h4 className="mb-0">Patient Dashboard</h4>
      </header>

      <div className="dashboard-body">
        {/* Sidebar */}
        <aside className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
          <ul className="list-unstyled">
            <li className="mb-2">
                
              <button className="btn btn-link" onClick={() => navigate("/book-appointment")}>
                Book Appointment
              </button>
            </li>
            <li className="mb-2">
              <button className="btn btn-link" onClick={() => navigate("/medical-record")}>
                Medical Record
              </button>
            </li>
            <li className="mb-2">
              <button className="btn btn-link profile-toggle-btn" onClick={() => setProfileOpen(!isProfileOpen)}>
                <span>Profile</span>
                <span>{isProfileOpen ? "▲" : "▼"}</span>
              </button>
              {isProfileOpen && (
                <ul className="list-unstyled ms-4 mt-2">
                  <li><button className="btn btn-sm btn-link" onClick={() => setViewProfile("Child")}>Child</button></li>
                  <li><button className="btn btn-sm btn-link" onClick={() => setViewProfile("Parent")}>Parent</button></li>
                </ul>
              )}
            </li>
          </ul>
        </aside>

        {/* Main Content */}
          <main className="main-content">
        <div className="profile-card">
          <div className="profile-image-container">
            <img
              src={currentChild.profilePictureUrl ? `http://localhost:8080${currentChild.profilePictureUrl}` : "https://via.placeholder.com/120?text=Photo"}
              alt="Profile"
              className="profile-image"
            />
            <label htmlFor="profileImageUpload" className="upload-overlay">
              <FontAwesomeIcon icon={faCamera} />
            </label>
            <input
              type="file"
              id="profileImageUpload"
              accept="image/*"
              className="d-none"
              onChange={handleImageUpload}
            />
          </div>
          <div className="profile-details">
            {renderProfileDetails()}
          </div>
        </div>
      </main>
      </div>
    </div>
  );
}