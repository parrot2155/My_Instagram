import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Feed from "./components/Feed";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Profile from "./components/Profile";

function AppContent() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#8e8e8e'
      }}>
        로딩 중...
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/profile/:userid" element={
        <div className="app">
          <Sidebar />
          <div className="main">
            <Header />
            <Profile />
          </div>
        </div>
      } />
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
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
