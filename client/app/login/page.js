"use client";
import styles from "../Login.module.css";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";

export default function Login() {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const { user, login } = useAuth() || {};

  const onclick = () => {
    console.log(account, password);

    login(account, password);
  };

  useEffect(() => {
    if (!user) setCheckingAuth(false);
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
          <h3>登入</h3>
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
              <h6>登入</h6>
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
            <div className={styles.fcBox}>
              <Link href="/forgot" className={styles.ftext}>
                忘記密碼？
              </Link>
              <Link href="/register" className={styles.ctext}>
                註冊新帳號！
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
