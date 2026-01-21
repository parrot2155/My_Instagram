import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import "./App.css";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Feed from "./components/Feed";
import Login from "./components/Login";
import Signup from "./components/Signup";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/"
          element={
            <div className="app">
              <Sidebar />
              <div className="main">
                <Header />
                <Feed />
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
