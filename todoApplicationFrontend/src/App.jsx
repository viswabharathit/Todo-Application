import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Loader from "./components/Loader";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Tasks from "./pages/Tasks";
import Profile from "./pages/Profile";
import Today from "./pages/Today";
import Upcoming from "./pages/Upcoming";
import Pending from "./pages/Pending";
import AccessDenied from "./pages/AccessDenied";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>

    
      <Route path="/" element={<Loader />} />

      <Route path="/auth" element={<AuthPage />} />

      <Route path="/dashboard" element={
        <ProtectedRoute><Dashboard /></ProtectedRoute>
      }/>

      <Route path="/projects" element={
        <ProtectedRoute><Projects /></ProtectedRoute>
      }/>

      <Route path="/tasks" element={
        <ProtectedRoute><Tasks /></ProtectedRoute>
      }/>

      <Route path="/today" element={
        <ProtectedRoute><Today /></ProtectedRoute>
      }/>

      <Route path="/upcoming" element={
        <ProtectedRoute><Upcoming /></ProtectedRoute>
      }/>

      <Route path="/pending" element={
        <ProtectedRoute><Pending /></ProtectedRoute>
      }/>

      <Route path="/profile" element={
        <ProtectedRoute><Profile /></ProtectedRoute>
      }/>

      <Route path="/access-denied" element={<AccessDenied />} />

      <Route path="*" element={<NotFound />} />

    </Routes>
  );
}

export default App;