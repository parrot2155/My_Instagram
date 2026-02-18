import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8090/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userid: username,
          password: password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // 로그인 성공 - AuthContext에 저장
        login(data.user, {
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        });

        console.log("로그인 성공:", data.user);
        navigate("/");
      } else {
        // 로그인 실패
        setError(data.message);
      }
    } catch (error) {
      console.error("로그인 오류:", error);
      if (error.name === "TypeError" && error.message.includes("fetch")) {
        setError("서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.");
      } else {
        setError("서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <div className="logo" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
          <h1>Instagram</h1>
        </div>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <input type="text" placeholder="아이디" value={username} onChange={(e) => setUsername(e.target.value)} required disabled={loading} />
          </div>
          <div className="input-group">
            <input type="password" placeholder="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={loading} />
          </div>
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>
        <div className="login-links">
          <a href="#" onClick={(e) => e.preventDefault()}>
            아이디 찾기
          </a>
          <span>|</span>
          <a href="#" onClick={(e) => e.preventDefault()}>
            비밀번호 찾기
          </a>
          <span>|</span>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate("/signup");
            }}
          >
            회원가입
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
