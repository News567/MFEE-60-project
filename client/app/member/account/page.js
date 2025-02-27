"use client";

import { useAuth } from "@/hooks/use-auth";
import styles from "./account.module.css";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import jwt from "jsonwebtoken";

export default function Account() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();
  const [userData, setUserData] = useState({
    id: profile?.id || "",
    name: profile?.name || "",
    email: profile?.email || "",
    birthday: profile?.birthday || "", // 確保 birthday 存在
    gender: profile?.gender || "",
    address: profile?.address || "",
    emergency_contact: profile?.emergency_contact || "",
    emergency_phone: profile?.emergency_phone || "",
    img: profile?.img || "/img/default.png",
  });

  // const [name, setNewName] = useState("");
  // const [birthday, setNewBirth] = useState("");
  // const [password, setNewPassword] = useState("");
  // const [gender, setNewGender] = useState("");
  // const [phone, setNewPhone] = useState("");
  // const [address, setAddress] = useState("");
  // const [emergencyContact, setEC] = useState("");
  // const [emergencyPhone, setEP] = useState("");

  // 進入頁面時檢查 token 並獲取用戶數據
  useEffect(() => {
    if (!user || !user.id) {
      router.replace("/member/login");
      return;
    }

    // 確保 `profile` 存在，避免 `undefined` 錯誤
    if (profile) {
      setUserData((prev) => ({
        ...prev,
        img: profile.img || "/img/default.png",
      }));
    }

    // 讀取 `localStorage` 的頭像
    const storedAvatar = localStorage.getItem(`user_avatar_${user.id}`);
    if (storedAvatar) {
      setUserData((prev) => ({ ...prev, img: storedAvatar }));
    }
  }, [user, profile]);



  //   const fetchData = async () => {
  //     try {
  //       const res = await fetch(
  //         "http://localhost:3005/api/member/users/status",
  //         {
  //           method: "POST",
  //           headers: { Authorization: `Bearer ${storedToken}` },
  //         }
  //       );

  //       const result = await res.json();
  //       console.log("🔍 Token 解碼結果:", result);
  //       if (result.status !== "success") throw new Error(result.message);

  //       localStorage.setItem("loginWithToken", result.data.token);
  //       const decodedUser = jwt.decode(result.data.token);
  //       setUser(decodedUser);
  //       console.log("🔍 解碼後的使用者資訊:", decodedUser);

  //       // 從 API 獲取完整的用戶資料
  //       const userRes = await fetch(
  //         `http://localhost:3005/api/member/users/${decodedUser.id}`,
  //         {
  //           headers: { Authorization: `Bearer ${storedToken}` },
  //         }
  //       );
  //       const userDataResult = await userRes.json();
  //       if (userDataResult.status === "success") {
  //         const {
  //           name = "",
  //           birthday = "",
  //           gender = "",
  //           phone = "",
  //           address = "",
  //           emergencyContact = "",
  //           emergencyPhone = "",
  //         } = userDataResult.data;
  //         setUserData(userDataResult.data);
  //         setNewName(name);
  //         setNewBirth(birthday);
  //         setNewGender(gender);
  //         setNewPhone(phone);
  //         setAddress(address);
  //         setEC(emergencyContact);
  //         setEP(emergencyPhone);
  //         setNewPassword(password);
  //       }
  //     } catch (err) {
  //       console.error("用戶狀態獲取失敗:", err);
  //       localStorage.removeItem("loginWithToken");
  //       setUser(null);
  //       router.replace("/member/login");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, [router, setUser, userData.id]);

  // 更新用戶信息
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const storedToken = localStorage.getItem("loginWithToken");
      const res = await fetch(`http://localhost:3005/api/member/users/${user.id}`, {
        method: "PUT",
        body: JSON.stringify(userData),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedToken}`,
        },
      });

      const result = await res.json();
      alert(result.message);
      if (result.status === "success") {
        setUserData((prev) => ({
          ...prev,
          ...result.data, // 更新已修改的欄位
        }));
      }
    } catch (error) {
      console.error("更新用户信息失败:", error);
    }

    //   setLoading(true);
    //   const formData = new FormData();

    //   const userUpdates = new Map([
    //     ["name", name],
    //     ["birthday", birthday],
    //     ["password", password],
    //     ["gender", gender],
    //     ["phone", phone],
    //     ["address", address],
    //     ["emergency_contact", emergencyContact],
    //     ["emergency_phone", emergencyPhone],
    //   ]);

    //   userUpdates.forEach((value, key) => {
    //     if (value !== undefined && value !== "") {
    //       formData.append(key, value);
    //     }
    //   });

    //   const storedToken = localStorage.getItem("loginWithToken");

    //   const res = await fetch(
    //     `http://localhost:3005/api/member/users/${userData.id}`,
    //     {
    //       method: "PUT",
    //       body: formData,
    //       headers: {
    //         Authorization: `Bearer ${storedToken}`,
    //       },
    //     }
    //   );

    //   const result = await res.json();
    //   alert(result.message);

    //   if (result.status === "success") {
    //     setUserData((prev) => ({
    //       ...prev,
    //       ...Object.fromEntries(userUpdates), // 更新已修改的欄位
    //     }));
    //   }
    // } catch (error) {
    //   console.error("更新用户信息失败:", error);
    // }
  };

  const handleUploadImg = async (event) => {
    const userId = userData.id;
    if (!userId) {
      alert("無法獲取用戶 ID，請重新登入");
      return;
    }

    // 產生本地預覽 URL
    const previewUrl = URL.createObjectURL(file);
    setUserData((prev) => ({ ...prev, img: previewUrl }));

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Data = reader.result.split(",")[1];

      try {
        // 發送圖片到後端存儲
        const res = await fetch("http://localhost:3005/api/member/users/upload-img", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, image: base64Data }),
        });
  
        const result = await res.json();
        if (result.status === "success") {
          // 更新 userData.img，這樣 <img> 會顯示新圖片
          setUserData((prev) => ({ ...prev, img: result.img }));
        } else {
          alert("上傳失敗：" + result.message);
        }
      } catch (error) {
        console.error("❌ 圖片上傳失敗:", error);
      }
    };
  
    // 清理 `blob URL`
    setTimeout(() => URL.revokeObjectURL(previewUrl), 5000);
  };


    //   // 確保圖片存入 `client/public/img/member/{userId}/0.png`
    // const imgPath = `/img/member/${userId}/0.png`;

    // // 產生圖片的 URL，讓前端立即顯示
    // const imageUrl = URL.createObjectURL(file);
    // setUserData((prev) => ({ ...prev, img: imageUrl }));

    // // 存到 localStorage 避免重新整理後圖片消失
    // localStorage.setItem(`user_avatar_${userId}`, imgPath);

    // // 清理 URL 來避免記憶體洩漏
    // setTimeout(() => URL.revokeObjectURL(imageUrl), 5000);

    //   // 存到 localStorage 或 IndexedDB，避免重新整理後圖片消失
    //   localStorage.setItem(`user_avatar_${userId}`, imageUrl);
    // try {
    //   const formData = new FormData();
    //   formData.append("img", file);

    //   const storedToken = localStorage.getItem("loginWithToken");

    //   const res = await fetch(
    //     "http://localhost:3005/api/member/users/upload-img",
    //     {
    //       method: "POST",
    //       body: formData,
    //       headers: { Authorization: `Bearer ${storedToken}` },
    //     }
    //   );

    //   const result = await res.json();
    //   if (result.status === "success") {
    //     setUserData((prev) => ({ ...prev, img: result.img }));
    //   } else {
    //     alert("上傳失敗：" + result.message);
    //   }
    // } catch (error) {
    //   console.error("頭像上傳錯誤:", error);
    // }
    // };

    if (loading) return <p>加載中...</p>;

    return (
      <>
        <div className={styles.content}>
          {/* aside */}
          <div className={styles.aside}>
            <div className={styles.listBox}>
              <div className={styles.asideTitle}>
                <h5>會員中心</h5>
              </div>
              <div className={styles.asideContent}>
                <div className={styles.ASpoint}>
                  <Link href="/member/account" className={styles.ASpoint}>
                    <h6>我的帳戶</h6>
                  </Link>
                </div>
                <Link href="/member/order/orderRent" className={styles.ASother}>
                  <h6>我的訂單</h6>
                </Link>
                <Link href="/member/group" className={styles.ASother}>
                  <h6>我的揪團</h6>
                </Link>
                <Link href="/member/favorite" className={styles.ASother}>
                  <h6>我的最愛</h6>
                </Link>
                <Link href="/member/coupon" className={styles.ASother}>
                  <h6>我的優惠券</h6>
                </Link>
              </div>
            </div>
          </div>
          {/* main */}
          <div className={styles.main}>
            <div className={styles.mainTitle}>
              <h4>我的帳戶</h4>
              <div className={styles.MTside}>
                <p>我的帳戶</p>
                <i className="bi bi-chevron-right" aria-label="Next"></i>
                <p>個人資料</p>
              </div>
            </div>
            <div className={styles.sectionList}>
              <div className={styles.infoBox}>
                <div className={styles.IBlist}>
                  <div className={styles.IBLTitle}>
                    <p>姓名</p>
                    <p>生日</p>
                    <p>手機號碼</p>
                    <p>地址</p>
                    <p>性別</p>
                    <p>緊急連絡人</p>
                    <p>緊急連絡人電話</p>
                    <p>密碼</p>
                  </div>
                  <div className={styles.IBLcontent}>
                    <input
                      type="text"
                      value={userData.name}
                      className={`${styles.box2} ${styles.boxSame}`}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="姓名"
                    />
                    <input
                      type="date"
                      value={userData.birthday}
                      className={`${styles.box} ${styles.boxSame}`}
                      onChange={(e) => setNewBirth(e.target.value)}
                      placeholder="生日"
                    />
                    <input
                      type="tel"
                      value={userData.phone}
                      className={`${styles.box1} ${styles.boxSame}`}
                      onChange={(e) => setNewPhone(e.target.value)}
                      placeholder="手機號碼"
                    />
                    <input
                      type="text"
                      value={userData.address}
                      className={`${styles.box3} ${styles.boxSame}`}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="地址"
                    />
                    <div className={`form-check-inline ${styles.box4}`}>
                      <div className={styles.boxlist}>
                        <input
                          type="radio"
                          id="male"
                          name="gender"
                          value="male"
                          onChange={(e) => setNewGender(e.target.value)}
                        />
                        <label htmlFor="male" className="form-check-label">
                          男性
                        </label>

                        <input
                          type="radio"
                          id="female"
                          name="gender"
                          value="female"
                          onChange={(e) => setNewGender(e.target.value)}
                        />
                        <label htmlFor="female" className="form-check-label">
                          女性
                        </label>

                        <input
                          type="radio"
                          id="other"
                          name="gender"
                          value="other"
                          onChange={(e) => setNewGender(e.target.value)}
                        />
                        <label htmlFor="other" className="form-check-label">
                          其他
                        </label>
                      </div>
                    </div>
                    <input
                      type="text"
                      value={userData.emergency_contact}
                      className={`${styles.box1} ${styles.boxSame}`}
                      onChange={(e) => setEC(e.target.value)}
                      placeholder="緊急連絡人"
                    />
                    <input
                      type="tel"
                      value={userData.emergency_phone}
                      className={`${styles.box1} ${styles.boxSame}`}
                      onChange={(e) => setEP(e.target.value)}
                      placeholder="緊急連絡人電話"
                    />
                    <input
                      type="password"
                      value={userData.password}
                      className={`${styles.box1} ${styles.boxSame}`}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="密碼"
                    />
                  </div>
                </div>
                <div className={`${styles.IBbtn}`}>
                  <div className={`${styles.hvbtn}`} onClick={handleUpdateUser}>
                    變更
                  </div>
                  <div className={`${styles.dfbtn}`}>取消</div>
                </div>
              </div>
              {/* 分隔線 */}
              <div className={styles.line2}></div>
              {/* 右邊格子 */}
              <div className={styles.infoBox2}>
                <div className={styles.iflist2}>
                  <div className={styles.circle}>
                    <img src={userData.img || "/img/default.png"} alt="頭像" />
                  </div>
                  <p>level</p>
                  <p>{userData.email}</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUploadImg}
                    id="avatarUpload"
                    hidden
                  />
                  <label htmlFor="avatarUpload" className={styles.dfbtn2}>
                    選擇圖片
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
