"use client";

import { useAuth } from "@/hooks/use-auth";
import styles from "./account.module.css";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import UploadAvatar from "@/member/components/UploadAvatar";
import jwt from "jsonwebtoken";

export default function Account() {
  const router = useRouter();
  const { user, profile, loading, setProfile } = useAuth();
  // 初始化用戶數據
  const [userData, setUserData] = useState({
    id: "",
    name: "",
    email: "",
    birthday: "",
    gender: "",
    address: "",
    emergency_contact: "",
    emergency_phone: "",
    img: "/img/default.png",
  });

  // 處理表單輸入
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev, // 保留其他欄位
      [name]: value, // 只更新這次輸入的欄位
    }));
  };
  // 更新用戶信息
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const storedToken = localStorage.getItem("loginWithToken");
      if (!storedToken) {
        alert("❌ 無法獲取 Token，請重新登入");
        router.replace("/member/login");
        return;
      }

      const userId = user?.id || profile?.id;
      if (!userId) {
        alert("❌ 無法獲取用戶 ID，請重新登入");
        return;
      }
      const filteredData = Object.fromEntries(
        Object.entries(userData).filter(([_, v]) => v !== "")
      );

      const res = await fetch(
        `http://localhost:3005/api/member/users/${user.id}`,
        {
          method: "PUT",
          body: JSON.stringify(filteredData),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );

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
  };
  // 設定「發送驗證碼」按鈕的點擊事件，驗證成功後切換 Modal
  useEffect(() => {
    const sendCodeBtn = document.getElementById("sendCodeBtn");
    if (!sendCodeBtn) return;

    const handleSendCodeClick = () => {
      const staticBackdropModalEl = document.getElementById("staticBackdrop");
      const passwordModalEl = document.getElementById("passwordModal");
      if (staticBackdropModalEl && passwordModalEl) {
        // 如果第一個 Modal 已經初始化，則取得它的實例，否則新建一個
        const staticBackdropModal =
          window.bootstrap.Modal.getInstance(staticBackdropModalEl) ||
          new window.bootstrap.Modal(staticBackdropModalEl);
        staticBackdropModal.hide(); // 隱藏第一個 modal

        // 建立並顯示第二個 modal
        const passwordModal = new window.bootstrap.Modal(passwordModalEl);
        passwordModal.show();
      }
    };

    sendCodeBtn.addEventListener("click", handleSendCodeClick);
    return () => {
      sendCodeBtn.removeEventListener("click", handleSendCodeClick);
    };
  }, []);
  // 進入頁面時檢查 token 並獲取用戶數據
  useEffect(() => {
    const storedToken = localStorage.getItem("loginWithToken");
    console.log("🔍 Token:", storedToken); // ✅ 檢查 token
    if (loading) return;

    if (!user || !user.id) {
      router.replace("/member/login");
      return;
    }
    if (!profile || !profile.id) return;


    setUserData((prev) => ({
      ...prev, // 保留之前的 user
      id: profile.id,
      name: profile.name || "",
      email: profile.email || "",
      birthday: profile.birthday || "",
      gender: profile.gender ?? "",
      phone: profile.phone || "",
      address: profile.address || "",
      emergency_contact: profile.emergency_contact || "",
      emergency_phone: profile.emergency_phone || "",
      img: profile.img || "/img/default.png",
    }));

    console.log("API 回傳的完整 profile:", profile);
  }, [user, profile, loading]);

  if (loading) return <p>加載中...</p>;

  return (
    <>
      <div className={styles.content}>
        {/* aside */}
        <div className="col-lg-3 col-md-4">
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
              <Link href="/coupon" className={styles.ASother}>
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
                  {/* <p>密碼</p> */}
                </div>
                <div className={styles.IBLcontent}>
                  <input
                    type="text"
                    name="name"
                    value={userData.name || ""}
                    className={`${styles.box2} ${styles.boxSame}`}
                    onChange={handleInputChange}
                    placeholder="姓名"
                  />
                  <input
                    type="date"
                    name="birthday"
                    value={userData.birthday || ""}
                    className={`${styles.box} ${styles.boxSame}`}
                    onChange={handleInputChange}
                    placeholder="生日"
                  />

                  <input
                    type="tel"
                    name="phone"
                    value={userData.phone || ""}
                    className={`${styles.box1} ${styles.boxSame}`}
                    onChange={handleInputChange}
                    placeholder="手機號碼"
                  />

                  <input
                    type="text"
                    name="address"
                    value={userData.address || ""}
                    className={`${styles.box3} ${styles.boxSame}`}
                    onChange={handleInputChange}
                    placeholder="地址"
                  />
                  <div className={`form-check-inline ${styles.box4}`}>
                    <div className={styles.boxlist}>
                      <input
                        type="radio"
                        id="male"
                        name="gender"
                        value="male"
                        checked={userData.gender === "male"} // ✅ 確保 `checked` 與 `gender` 匹配
                        onChange={(e) =>
                          setUserData((prev) => ({
                            ...prev,
                            gender: e.target.value,
                          }))
                        }
                      />
                      <label htmlFor="male" className="form-check-label">
                        男性
                      </label>

                      <input
                        type="radio"
                        id="female"
                        name="gender"
                        value="female"
                        checked={userData.gender === "female"}
                        onChange={(e) =>
                          setUserData((prev) => ({
                            ...prev,
                            gender: e.target.value,
                          }))
                        }
                      />
                      <label htmlFor="female" className="form-check-label">
                        女性
                      </label>

                      <input
                        type="radio"
                        id="other"
                        name="gender"
                        value="other"
                        checked={userData.gender === "other"}
                        onChange={(e) =>
                          setUserData((prev) => ({
                            ...prev,
                            gender: e.target.value,
                          }))
                        }
                      />
                      <label htmlFor="other" className="form-check-label">
                        其他
                      </label>
                    </div>
                  </div>
                  <input
                    type="text"
                    name="emergency_contact"
                    value={userData.emergency_contact || ""}
                    className={`${styles.box1} ${styles.boxSame}`}
                    onChange={handleInputChange}
                    placeholder="緊急連絡人"
                  />

                  <input
                    type="tel"
                    name="emergency_phone"
                    value={userData.emergency_phone || ""}
                    className={`${styles.box1} ${styles.boxSame}`}
                    onChange={handleInputChange}
                    placeholder="緊急連絡人電話"
                  />
                  {/* <input
                    type="password"
                    value={userData.password}
                    className={`${styles.box1} ${styles.boxSame}`}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="密碼"
                  /> */}
                </div>
              </div>
              <div className={`${styles.IBbtn}`}>
                <div className={`${styles.hvbtn}`} onClick={handleUpdateUser}>
                  變更
                </div>
                <div
                  className={`${styles.dfbtn}`}
                  role="button"
                  tabIndex="0"
                  data-bs-toggle="modal"
                  data-bs-target="#staticBackdrop"
                >
                  修改密碼
                </div>
                {/* 第一個 Modal：發送驗證碼 */}
                <div
                  className="modal fade"
                  id="staticBackdrop"
                  tabIndex="-1"
                  aria-labelledby="staticBackdropLabel"
                  aria-hidden="true"
                  data-bs-backdrop="static"
                  data-bs-keyboard="false"
                >
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title" id="staticBackdropLabel">發送驗證碼</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="關閉"></button>
                      </div>
                      <div className="modal-body">
                        請輸入您的電子郵件地址以接收驗證碼。
                        {/* 可放置表單或其他輸入控件 */}
                      </div>
                      <div className="modal-footer">
                        <button id="sendCodeBtn" type="button" className="btn btn-primary">
                          發送驗證碼
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 第二個 Modal：修改密碼 */}
                <div className="modal fade" id="passwordModal" tabIndex="-1" aria-labelledby="passwordModalLabel" aria-hidden="true">
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title" id="passwordModalLabel">修改密碼</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="關閉"></button>
                      </div>
                      <div className="modal-body">
                        請輸入新密碼。
                        {/* 這裡可放置密碼修改的表單控件 */}
                      </div>
                      <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                          取消
                        </button>
                        <button type="button" className="btn btn-primary">
                          提交修改
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                {/* <!-- Modal -->
                <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                  <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h1 className="modal-title fs-5" id="staticBackdropLabel">修改密碼</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                      </div>
                      <div className="modal-body d-flex justify-content-center align-items-center flex-column m-2">
                        <div className={`${styles.IBL1}`}>
                          <p>舊密碼</p>
                          <input
                            type="password"
                            value={userData.password}
                            className={`${styles.IBL1box} `}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="密碼"
                          />
                        </div>
                        <div className={`${styles.IBL1}`}>
                          <p>舊密碼</p>
                          <input
                            type="password"
                            value={userData.password}
                            className={`${styles.IBL1box} `}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="密碼"
                          />
                        </div>
                        <div className={`${styles.IBL1}`}>
                          <p>舊密碼</p>
                          <input
                            type="password"
                            value={userData.password}
                            className={`${styles.IBL1box} `}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="密碼"
                          />
                        </div>
                        
                      </div>
                      <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">取消</button>
                        <button type="button" className="btn btn-primary">修改密碼</button>
                      </div>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
            {/* 分隔線 */}
            <div className={styles.line2}></div>
            {/* 右邊格子 */}
            <div className={styles.infoBox2}>
              <UploadAvatar
                userId={user?.id}
                currentAvatar={profile?.img || "/img/default.png"}
                level_id={profile?.level_id}
                email={user?.email}
                onUploadSuccess={(newImg) =>
                  setUserData((prev) => ({ ...prev, img: newImg }))
                }
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
