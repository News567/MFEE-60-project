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

  const onclick = () => {
    console.log(account, password);
    register(account, password);
  };
  useEffect(() => {
    if (user === null || user === undefined) {
      setCheckingAuth(false);  // 如果 user 是 null 或 undefined，就設置為 false
    }
  }, [user]);

  if (checkingAuth) {
    return <></>;
  }
  return (
    <div className={styles.loginPage}>
      <div className={styles.main}>
        <img src="/DiveIn logo-light.png" alt="logo" className={styles.logo} />
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
                <img src="/ic_google.svg" alt="Google logo" />
                <h6>Continue with Google</h6>
              </div>
            </div>
            <div className={styles.loginLine}>
              <div className={styles.lineBox}>
                <img src="/line.png" alt="Line logo" />
                <h6>Continue with Line</h6>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
