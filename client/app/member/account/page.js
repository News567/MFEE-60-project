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
  const [newPassword, setNewPassword] = useState("");
  const [newAvatar, setNewAvatar] = useState(null);
  // 获取用户信息
  const fetchUserData = async () => {
    try {
      const response = await axios.get(`/api/member/users/status`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserData(response.data.data); // 设置用户信息
      setNewName(response.data.data.name);
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
      if (newPassword) formData.append("password", newPassword);
      if (newAvatar) formData.append("head", newAvatar);

      const response = await axios.put(
        `/api/member/users/${userData.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(response.data.message);
      fetchUserData(); // 更新成功后重新获取数据
    } catch (error) {
      console.error("更新用户信息失败:", error);
    }
  };

  // 选择文件（头像）
  const handleAvatarChange = (e) => {
    setNewAvatar(e.target.files[0]);
  };

  // 处理表单
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
              <div className={styles.ASother}>
                <h6>我的揪團</h6>
              </div>
              <div className={styles.ASother}>
                <h6>我的最愛</h6>
              </div>
              <div className={styles.ASother}>
                <h6>我的優惠券</h6>
              </div>
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
                  <p>使用者帳號</p>
                  <p>姓名</p>
                  <p>生日</p>
                  <p>手機號碼</p>
                  <p>Email</p>
                  <p>地址</p>
                  <p>性別</p>
                  <p>緊急連絡人</p>
                  <p>緊急連絡人電話</p>
                </div>
                <div className={styles.IBLcontent}>
                  <div className={`${styles.box1} ${styles.boxSame}`}>
                    <p>使用者帳號</p>
                  </div>
                  <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="姓名"
                    />
                  <div className={`${styles.box2} ${styles.boxSame}`}>
                    <p>姓名</p>
                  </div>
                  <div className={`${styles.box2} ${styles.boxSame}`}>
                    <p>生日</p>
                  </div>
                  <div className={`${styles.box1} ${styles.boxSame}`}>
                    <p>手機號碼</p>
                  </div>
                  <input
                    type="email"
                    name="email"
                    className={`${styles.box3} ${styles.boxSame}`}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                    placeholder="Email"
                  />
                  <div className={`${styles.box3} ${styles.boxSame}`}>
                    <p>Email</p>
                  </div>
                  <div className={`${styles.box3} ${styles.boxSame}`}>
                    <p>地址</p>
                  </div>
                  <div className={styles.box4}>
                    <div className={styles.boxlist}>
                      <i className="bi bi-0-circle" aria-label="Male"></i>
                      <p>男性</p>
                      <i className="bi bi-0-circle" aria-label="Female"></i>
                      <p>女性</p>
                      <i className="bi bi-0-circle" aria-label="Other"></i>
                      <p>其他</p>
                    </div>
                  </div>
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
