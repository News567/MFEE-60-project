"use client";
import { useAuth } from "@/hooks/use-auth";
import styles from "../Login.module.css";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Register() {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password1, setPassword1] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { user, register } = useAuth() || {};
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    if (loading) return;

    if (!email.trim()) {
      alert("請輸入使用者email");
      return;
    }
    if (!password.trim()) {
      alert("請輸入密碼");
      return;
    }
    if (!password1.trim()) {
      alert("請再次輸入密碼");
      return;
    }
    // console.log("password:", password, "password1:", password1);

    setLoading(true);

    try {
      const response = await register(email, password, password1);
      console.log("register response:", response);
      alert("註冊成功，請登入！");
      router.push("/member/login");
    } catch (error) {
      console.error("註冊錯誤:", error);
      // 如果錯誤訊息中包含 'Email 已存在'
      if (error.message && error.message.includes("Email 已存在")) {
        alert("此 Email 已被註冊，請直接登入！");
        router.push("/member/login");
      } else {
        alert("註冊失敗，請稍後再試");
      }
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
        <img
          src="/image/DiveIn-logo-dark-final.png"
          alt="logo"
          className={styles.logo}
        />
        <div className={styles.line1}></div>
        <div className={styles.sectionLogin}>
          <h3>註冊</h3>
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
            <div className={styles.loginBtn} onClick={handleRegister}>
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
