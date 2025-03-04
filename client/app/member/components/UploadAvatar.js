"use client";

import { useState, useEffect  } from "react";
import styles from "./UploadAvatar.module.css"; 

const UploadAvatar = ({ userId, currentAvatar = "/img/default.png", onUploadSuccess }) => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(
    currentAvatar ? `http://localhost:3005${currentAvatar}` : "http://localhost:3005/img/default.png"
  );
  
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
      const response = await fetch("http://localhost:3005/api/member/users/upload", {
        method: "POST",
        body: formData,
      });

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

  return (
    <div className={styles.iflist2}>
      {/* 頭像顯示 */}
      <div className={styles.circle}>
        <img src={preview} alt="預覽" />
      </div>

      {/* 圖片上傳 */}
      <input type="file" accept="image/*" onChange={handleFileChange} id="avatarUpload" hidden />
      <label htmlFor="avatarUpload" className={styles.dfbtn2}>選擇圖片</label>

      {/* 確認上傳 */}
      <button onClick={handleUpload} className={styles.dfbtn2}>上傳頭像</button>
    </div>
  );
};

export default UploadAvatar;
