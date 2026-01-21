import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    userid: "",
    password: "",
    passwordConfirm: "",
    email: "",
    nickname: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [useridAvailable, setUseridAvailable] = useState(null); // null: not checked, true: available, false: taken
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // userid 변경 시 중복검사 상태 리셋
    if (name === "userid") {
      setUseridAvailable(null);
    }
  };

  const checkUserid = async () => {
    if (!formData.userid.trim()) {
      setError("아이디를 입력해주세요.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:8090/api/auth/check-userid", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userid: formData.userid,
        }),
      });

      const data = await response.json();

      if (data.available) {
        setUseridAvailable(true);
        setError("");
      } else {
        setUseridAvailable(false);
        setError("이미 사용 중인 아이디입니다.");
      }
    } catch (error) {
      console.error("아이디 중복검사 오류:", error);
      setError("아이디 중복검사를 실패했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    // 유효성 검사
    if (!formData.name.trim()) {
      setError("이름을 입력해주세요.");
      return;
    }
    if (!formData.userid.trim()) {
      setError("아이디를 입력해주세요.");
      return;
    }
    if (useridAvailable === null) {
      setError("아이디 중복검사를 해주세요.");
      return;
    }
    if (!useridAvailable) {
      setError("이미 사용 중인 아이디입니다.");
      return;
    }
    if (!formData.password.trim()) {
      setError("비밀번호를 입력해주세요.");
      return;
    }
    if (formData.password !== formData.passwordConfirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (!formData.email.trim()) {
      setError("이메일을 입력해주세요.");
      return;
    }
    if (!formData.nickname.trim()) {
      setError("닉네임을 입력해주세요.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8090/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        // 회원가입 성공
        console.log("회원가입 성공:", data.user);
        navigate("/login");
      } else {
        // 회원가입 실패
        setError(data.message);
      }
    } catch (error) {
      console.error("회원가입 오류:", error);
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
        <form onSubmit={handleSignup}>
          <div className="input-group">
            <input type="text" name="name" placeholder="이름" value={formData.name} onChange={handleChange} required disabled={loading} />
          </div>
          <div className="input-group">
            <input type="text" name="userid" placeholder="아이디" value={formData.userid} onChange={handleChange} required disabled={loading} />
            <button type="button" className="check-button" onClick={checkUserid} disabled={loading || !formData.userid.trim()}>
              중복검사
            </button>
          </div>
          {useridAvailable === true && <div className="success-message">사용 가능한 아이디입니다.</div>}
          <div className="input-group">
            <input type="password" name="password" placeholder="비밀번호" value={formData.password} onChange={handleChange} required disabled={loading} />
          </div>
          <div className="input-group">
            <input type="password" name="passwordConfirm" placeholder="비밀번호 확인" value={formData.passwordConfirm} onChange={handleChange} required disabled={loading} />
          </div>
          <div className="input-group">
            <input type="email" name="email" placeholder="이메일 주소" value={formData.email} onChange={handleChange} required disabled={loading} />
          </div>
          <div className="input-group">
            <input type="text" name="nickname" placeholder="닉네임" value={formData.nickname} onChange={handleChange} required disabled={loading} />
          </div>
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "회원가입 중..." : "회원가입"}
          </button>
        </form>
        <div className="login-links">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate("/login");
            }}
          >
            로그인으로 돌아가기
          </a>
        </div>
      </div>
    </div>
  );
};

export default Signup;
