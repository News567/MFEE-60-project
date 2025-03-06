"use client";

import { useState, useEffect } from "react";
import styles from "./UploadAvatar.module.css";

const ProgressBar = ({ current, threshold }) => {
  const percentage = Math.min((current / threshold) * 100, 100);
  return (
    <div className={styles.progressContainer}>
      <div className={styles.progressTrack}>
        <div
          className={styles.progressFill}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className={styles.progressLabel}>
        {current} / {threshold}
      </div>
    </div>
  );
};

const UploadAvatar = ({
  userId,
  currentAvatar = "/img/default.png",
  onUploadSuccess,
  email,
  level_id,
  accumulatedAmount = 3000,
}) => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(
    currentAvatar
      ? `http://localhost:3005${currentAvatar}`
      : "http://localhost:3005/img/default.png"
  );
  const levelMapping = {
    0: "New Diver",
    1: "Diver Level 1",
    // 其他等級可以再補上
  };

  useEffect(() => {
    if (currentAvatar) {
      setPreview(`http://localhost:3005${currentAvatar}`);
    } else {
      setPreview("http://localhost:3005/img/default.png");
    }
  }, [currentAvatar]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!image) {
      alert("請選擇圖片");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", image);
    formData.append("userId", userId); // 傳遞 userId 給後端

    try {
      const response = await fetch(
        "http://localhost:3005/api/member/users/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();
      if (result.status === "success") {
        alert("✅ 圖片上傳成功！");
        setPreview(`http://localhost:3005${result.img}`);
        setTimeout(() => {
          onUploadSuccess(result.img);
        }, 500);
      } else {
        alert("❌ 上傳失敗：" + result.message);
      }
    } catch (error) {
      console.error("圖片上傳失敗:", error);
    }
  };
  // 根據等級決定累積門檻（以下只是一個範例邏輯）
  let threshold = 10000; // 預設門檻
  if (Number(level_id) === 0) {
    threshold = 1;
  } else if (Number(level_id) === 1) {
    threshold = 10000;
  }

  return (
    <div className={styles.iflist2}>
      {/* 頭像顯示 */}
      <div className={styles.circle}>
        <img src={preview} alt="預覽" />
      </div>
      <h6 className="mt-1">{email}</h6>
      <h6>{levelMapping[Number(level_id)] || "Unknown Level"}</h6>
      <ProgressBar current={accumulatedAmount} threshold={threshold} />
      <div className="d-flex gap-3">
        {/* 圖片上傳 */}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          id="avatarUpload"
          hidden
        />
        <label htmlFor="avatarUpload" className={styles.dfbtn2}>
          <i class="bi bi-image"></i>選擇
        </label>
        {/* 確認上傳 */}
        <button onClick={handleUpload} className={styles.dfbtn2}>
          <i class="bi bi-box-arrow-up"></i>
        </button>
      </div>
      
    </div>
  );
};

export default UploadAvatar;
