"use client";
import styles from "../Login.module.css";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login() {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password1, setPassword1] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { user, login } = useAuth() || {};

  const handleLogin = () => {
    // setError("");
    if (password !== password1) {
      alert("密碼不一致，請重新輸入");
      // console.log("密碼不一致");
      return;
    }
    console.log(email, password);
    if (typeof login === "function") {
      login(email, password);
    } else {
      console.error("login is not a function");
    }
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
        <img
          src="/image/DiveIn-logo-dark-final.png"
          alt="logo"
          className={styles.logo}
        />
        <div className={styles.line1}></div>
        <div className={styles.sectionLogin}>
          <h3>登入</h3>
          <input
            type="email"
            name="email"
            className={styles.wordbox}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            placeholder="Email"
          />
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              className={styles.wordbox}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="密碼"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "2rem",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
              }}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              name="password1"
              className={styles.wordbox}
              value={password1}
              onChange={(e) => setPassword1(e.target.value)}
              placeholder="再次輸入密碼"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "2rem",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
              }}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <div className={styles.loginWays}>
            <div className={styles.loginBtn} onClick={handleLogin}>
              <h6>登入</h6>
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
              <Link href="/member/forgot" className={styles.ftext}>
                忘記密碼？
              </Link>
              <Link href="/member/register" className={styles.ctext}>
                註冊新帳號！
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
