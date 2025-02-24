"use client";

import { useAuth } from "@/hooks/use-auth";
import styles from "./account.module.css";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Account() {
  const { token } = useAuth(); // 获取 JWT token
  const router = useRouter();
  const [userData, setUserData] = useState({
    id: "",
    name: "",
    email: "",
  });

  const [newName, setNewName] = useState("");
  const [newBirth, setNewBirth] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newGender, setNewGender] = useState("");

  // const [newAvatar, setNewAvatar] = useState(null);

  // 获取用户信息
  const fetchUserData = async () => {
    try {
      const response = await fetch(`/api/member/users/status`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.status === "success") {
        setUserData(data.data); // 设置用户信息
        setNewName(data.data.name);

      } else {
        console.error("获取用户数据失败:", data.message);
      }
    } catch (error) {
      console.error("获取用户数据失败:", error);
    }
  };

  // 更新用户信息
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      if (newName) formData.append("name", newName);
      if (newBirth) formData.append("birthday", newBirth)
      if (newPassword) formData.append("password", newPassword);
      if (newGender) formData.append("gender", newGender);
      // if (newAvatar) formData.append("head", newAvatar);

      const response = await fetch(`/api/member/users/${userData.id}`, {
        method: "PUT",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      alert(result.message);
      if (result.status === "success") {
        fetchUserData(); // 更新成功后重新获取数据
      }
    } catch (error) {
      console.error("更新用户信息失败:", error);
    }
  };

  // 选择文件（头像）
  // const handleAvatarChange = (e) => {
  //   setNewAvatar(e.target.files[0]);
  // };

  useEffect(() => {
    fetchUserData();
  }, [token]);

  return (
    <>
      <div className={styles.content}>
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
                </div>
                <div className={styles.IBLcontent}>
                  <input
                    type="text"
                    value={newName}
                    className={`${styles.box2} ${styles.boxSame}`}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="姓名"
                  />
                  <input
                    type="date"
                    value={newName}
                    className={`${styles.box} ${styles.boxSame}`}
                    onChange={(e) => setNewBirth(e.target.value)}
                    placeholder="生日"
                  />
                  <div className={`${styles.box1} ${styles.boxSame}`}>
                    <p>手機號碼</p>
                  </div>
                  <div className={`${styles.box3} ${styles.boxSame}`}>
                    <p>地址</p>
                  </div>
                  <div className={`form-check-inline ${styles.box4}`}>
  <div className={styles.boxlist}>
    <input
      type="radio"
      id="male"
      name="gender"
      value="male"
      onChange={(e) => setNewGender(e.target.value)} // 捕獲選擇的性別
    />
    <label htmlFor="male" className="form-check-label">男性</label>

    <input
      type="radio"
      id="female"
      name="gender"
      value="female"
      onChange={(e) => setNewGender(e.target.value)} // 捕獲選擇的性別
    />
    <label htmlFor="female" className="form-check-label">女性</label>

    <input
      type="radio"
      id="other"
      name="gender"
      value="other"
      onChange={(e) => setNewGender(e.target.value)} // 捕獲選擇的性別
    />
    <label htmlFor="other" className="form-check-label">其他</label>
  </div>
</div>
                  {/* <div className={`form-check-inline ${styles.box4}`}>
                    <div className={styles.boxlist}>
                      <input type="radio" />
                      <label className="form-check-label">男性</label>
                      <input type="radio" />
                      <label className="form-check-label">女性</label>
                      <input type="radio" />
                      <label className="form-check-label">其他</label>
                    </div>
                  </div> */}
                  <div className={`${styles.box2} ${styles.boxSame}`}>
                    <p>緊急連絡人</p>
                  </div>
                  <div className={`${styles.box1} ${styles.boxSame}`}>
                    <p>緊急連絡人電話</p>
                  </div>
                </div>
              </div>
              <div className={`${styles.IBbtn}`}>
                <div className={`${styles.hvbtn}`}>變更</div>
                <div className={`${styles.dfbtn}`}>取消</div>
              </div>
            </div>
            <div className={styles.line2}></div>

            <div className={styles.infoBox2}>
              <div className={styles.iflist2}>
                <div className={styles.circle}></div>
                <div className={styles.ifcontent}>
                  <p>user1</p>
                  <p>OO等級 - 88/100</p>
                  <p>user1@test.com</p>
                  <div className={styles.dfbtn2}>選擇圖片</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
