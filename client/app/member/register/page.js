"use client";
import { useAuth } from "@/hooks/use-auth";
import styles from "../Login.module.css";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Register() {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const { user, register } = useAuth() || {};
  const [loading, setLoading] = useState(false);


  const onclick = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3005/api/member/users/register", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ account, password }),
      });
      // 嘗試解析 JSON，即使 response 非 2xx
      let data = await response.json().catch(() => ({}));

      if (response.ok) {
        if (data.status === "success") {
          alert("註冊成功，請登入");
          window.location.href = "/member/login";
        }
      } else if (response.status === 409) { // 確認是帳號已存在
        alert("此帳號已存在，請直接登入");
        window.location.href = "/member/login";
      } else {
        alert("註冊失敗，請檢查您的資訊");
      }
    } catch (error) {
      console.error("錯誤:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!user) {
      setCheckingAuth(false);
    }
  }, [user]);

  if (checkingAuth) {
    return <div>載入中...</div>;
  }
  return (
    <div className={styles.loginPage}>
      <div className={styles.main}>
        <img src="/image/DiveIn-logo-dark-final.png" alt="logo" className={styles.logo} />
        <div className={styles.line1}></div>
        <div className={styles.sectionLogin}>
          <h3>註冊</h3>
          <input
            type="text"
            name="account"
            className={styles.wordbox}
            value={account}
            onChange={(e) => {
              setAccount(e.target.value);
            }}
            placeholder="電話號碼 / 使用者帳號 / Email"
          />
          <input
            type="password"
            name="password"
            className={styles.wordbox}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            placeholder="密碼"
          />

          <div className={styles.loginWays}>
            <div className={styles.loginBtn} onClick={onclick}>
              <h6>註冊</h6>
            </div>
            <div className={styles.or}>
              <div className={styles.line2}></div>
              <p>或</p>
              <div className={styles.line2}></div>
            </div>
            <div className={styles.loginGoogle}>
              <div className={styles.googleBox}>
                <img src="/img/ic_google.svg" alt="Google logo" />
                <h6>Continue with Google</h6>
              </div>
            </div>
            <div className={styles.loginLine}>
              <div className={styles.lineBox}>
                <img src="/img/line.png" alt="Line logo" />
                <h6>Continue with Line</h6>
              </div>
            </div>
            <div className={styles.fcBox}>
              <Link href="/member/login" className={styles.ftext}>
                我有帳號！
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
