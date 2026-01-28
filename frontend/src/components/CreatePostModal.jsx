import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./CreatePostModal.css";

const CreatePostModal = ({ isOpen, onClose }) => {
  const { user, isAuthenticated } = useAuth();
  const [step, setStep] = useState(1); // 1: 이미지 선택, 2: 내용 작성
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [content, setContent] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // 이미지 파일만 허용
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        alert('이미지 파일만 업로드할 수 있습니다. (JPG, PNG, GIF, WEBP)');
        e.target.value = ''; // input 초기화
        return;
      }

      // 파일 크기 제한 (10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        alert('파일 크기는 10MB 이하여야 합니다.');
        e.target.value = ''; // input 초기화
        return;
      }

      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNextStep = () => {
    if (selectedImage) {
      setStep(2);
    } else {
      alert("사진을 선택해주세요.");
    }
  };

  const handleSubmit = async () => {
    if (!selectedImage) {
      alert("사진을 선택해주세요.");
      return;
    }

    if (!isAuthenticated || !user) {
      alert("로그인이 필요합니다.");
      return;
    }

    setLoading(true);

    try {
      console.log("=== 게시물 작성 요청 ===");
      console.log("userNo:", user.userNo);
      console.log("userid:", user.userid);
      console.log("content:", content);
      console.log("location:", location);
      console.log("image:", selectedImage);

      const formData = new FormData();
      formData.append("image", selectedImage);
      formData.append("content", content);
      formData.append("location", location);
      formData.append("userNo", user.userNo);

      const accessToken = localStorage.getItem("accessToken");
      const response = await fetch("http://localhost:8090/api/posts/create", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("서버 에러:", errorData);
        alert("게시물 작성 실패: " + (errorData.message || errorData.error || "알 수 없는 오류"));
        return;
      }

      const data = await response.json();
      console.log("게시물 작성 성공:", data);
      alert("게시물이 작성되었습니다!");
      handleClose();
      window.location.reload(); // 피드 새로고침
    } catch (error) {
      console.error("게시물 작성 오류:", error);
      alert("서버 연결에 실패했습니다: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setSelectedImage(null);
    setImagePreview(null);
    setContent("");
    setLocation("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{step === 1 ? "새 게시물 만들기" : "새 게시물 만들기"}</h2>
          <button className="modal-close" onClick={handleClose}>
            ✕
          </button>
        </div>

        {step === 1 ? (
          // 1: 이미지 선택
          <div className="modal-body">
            <div className="image-upload-area">
              {imagePreview ? (
                <div className="image-preview-container">
                  <img src={imagePreview} alt="Preview" className="image-preview" />
                  <button className="change-image-btn" onClick={() => document.getElementById("image-input").click()}>
                    사진 변경
                  </button>
                </div>
              ) : (
                <div className="upload-placeholder">
                  <svg aria-label="사진 아이콘" className="upload-icon" fill="currentColor" height="77" role="img" viewBox="0 0 97.6 77.3" width="96">
                    <path d="M16.3 24h.3c2.8-.2 4.9-2.6 4.8-5.4-.2-2.8-2.6-4.9-5.4-4.8s-4.9 2.6-4.8 5.4c.1 2.7 2.4 4.8 5.1 4.8zm-2.4-7.2c.5-.6 1.3-1 2.1-1h.2c1.7 0 3.1 1.4 3.1 3.1 0 1.7-1.4 3.1-3.1 3.1-1.7 0-3.1-1.4-3.1-3.1 0-.8.3-1.5.8-2.1z"></path>
                    <path d="M84.7 18.4L58 16.9l-.2-3c-.3-5.7-5.2-10.1-11-9.8L12.9 6c-5.7.3-10.1 5.3-9.8 11L5 51v.8c.7 5.2 5.1 9.1 10.3 9.1h.6l21.7-1.2v.6c-.3 5.7 4 10.7 9.8 11l34 2h.6c5.5 0 10.1-4.3 10.4-9.8l2-34c.4-5.8-4-10.7-9.7-11.1zM7.2 10.8C8.7 9.1 10.8 8.1 13 8l34-1.9c4.6-.3 8.6 3.3 8.9 7.9l.2 2.8-5.3-.3c-5.7-.3-10.7 4-11 9.8l-.6 9.5-9.5 10.7c-.2.3-.6.4-1 .5-.4 0-.7-.1-1-.4l-7.8-7c-1.4-1.3-3.5-1.1-4.8.3L7 49 5.2 17c-.2-2.3.6-4.5 2-6.2zm8.7 48c-4.3.2-8.1-2.8-8.8-7.1l9.4-10.5c.2-.3.6-.4 1-.5.4 0 .7.1 1 .4l7.8 7c.7.6 1.6.9 2.5.9.9 0 1.7-.5 2.3-1.1l7.8-8.8-1.1 18.6-21.9 1.1zm76.5-29.5l-2 34c-.3 4.6-4.3 8.2-8.9 7.9l-34-2c-4.6-.3-8.2-4.3-7.9-8.9l2-34c.3-4.4 3.9-7.9 8.4-7.9h.5l34 2c4.7.3 8.2 4.3 7.9 8.9z"></path>
                    <path d="M78.2 41.6L61.3 30.5c-2.1-1.4-4.9-.8-6.2 1.3-.4.7-.7 1.4-.7 2.2l-1.2 20.1c-.1 2.5 1.7 4.6 4.2 4.8h.3c.7 0 1.4-.2 2-.5l18-9c2.2-1.1 3.1-3.8 2-6-.4-.7-.9-1.3-1.5-1.8zm-1.4 6l-18 9c-.4.2-.8.3-1.3.3-.4 0-.9-.2-1.2-.4-.7-.5-1-1.2-1-2l1.2-20.1c.1-.9.6-1.7 1.4-2.1.8-.4 1.7-.3 2.5.1L77 43.3c1.2.8 1.5 2.3.7 3.4-.2.4-.5.7-.9.9z"></path>
                  </svg>
                  <p>사진을 선택하세요</p>
                  <button className="select-image-btn" onClick={() => document.getElementById("image-input").click()}>
                    컴퓨터에서 선택
                  </button>
                </div>
              )}
              <input type="file" id="image-input" accept="image/*" onChange={handleImageSelect} style={{ display: "none" }} />
            </div>
          </div>
        ) : (
          // 2: 내용 작성
          <div className="modal-body step2">
            <div className="preview-section">
              <img src={imagePreview} alt="Preview" className="final-preview" />
            </div>
            <div className="content-section">
              <textarea className="content-textarea" placeholder="문구를 입력하세요..." value={content} onChange={(e) => setContent(e.target.value)} maxLength={2000} />
              <div className="location-input-container">
                <input type="text" className="location-input" placeholder="위치 추가" value={location} onChange={(e) => setLocation(e.target.value)} maxLength={100} />
              </div>
            </div>
          </div>
        )}

        <div className="modal-footer">
          {step === 1 ? (
            <button className="next-btn" onClick={handleNextStep} disabled={!selectedImage}>
              다음
            </button>
          ) : (
            <div className="footer-buttons">
              <button className="back-btn" onClick={() => setStep(1)}>
                뒤로
              </button>
              <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
                {loading ? "게시 중..." : "공유하기"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;
