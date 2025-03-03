"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import jwt from "jsonwebtoken";

const appKey = "loginWithToken";
const AuthContext = createContext(null);
AuthContext.displayName = "AuthContext";

export function AuthProvider({ children }) {
  // user 的三個狀態
  // null: 沒有登入
  // -1: 載入中
  // {email: achu@test.com}: 登入

  // const [token, setToken] = useState(() => {
  //   if (typeof window !== "undefined") {
  //     return localStorage.getItem(appKey);
  //   }
  //   return null;
  // });

  const [user, setUser] = useState(-1);
  const [profile, setProfile] = useState({
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const router = useRouter();
  const pathname = usePathname();
  const protectedRoutes = ["/admin"];

  useEffect(() => {
    const storedToken = localStorage.getItem(appKey);
    if (
      !storedToken &&
      !["/member/login", "/member/register", "/member/forgot"]
    ) {
      router.replace("/member/login");
    }
  }, [router, pathname]);

  // 處理用戶登入
  const login = async (email, password) => {
    const API = "http://localhost:3005/api/member/users/login";

    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await res.json();
      console.log(result);
      if (result.status !== "success") throw new Error(result.message);
      const token = result.data.token;
      const newUser = jwt.decode(token);
      setUser(newUser);
      localStorage.setItem(appKey, token);
      // const newToken = result.data.token;
      // localStorage.setItem(appKey, newToken);
      // setToken(newToken);
      // const decoded = jwt.decode(newToken);
      // setUser(decoded);
      // alert("登入成功");
      router.replace("/");
    } catch (err) {
      console.log(err);
      alert(err.message);
      router.replace("/member/register");
    }
  };
  // 处理用户登出
  // const logout = async () => {
  //   const API = "http://localhost:3005/api/member/users/logout";
  //   const token = localStorage.getItem(appKey);
  //   try {
  //     if (!token) throw new Error("身分認證訊息不存在, 請重新登入");
  //     const res = await fetch(API, {
  //       method: "POST",
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     const result = await res.json();
  //     if (result.status != "success") throw new Error(result.message);
  //     localStorage.removeItem(appKey);
  //     setUser(null);
  //     router.replace("/member/login")
  //   } catch (err) {
  //     console.log(err);
  //     alert(err.message);
  //   }
  // };
  const logout = async () => {
    localStorage.removeItem("token"); // 移除 localStorage 的 token
        sessionStorage.removeItem("token"); // 若 token 存在 sessionStorage 也要移除
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; // 清除 cookie 的 token

        router.push("/"); // 重新導向登入頁面
    };

  // 处理用户注册
  const register = async (email, password, password1) => {
    if (password !== password1) {
      return { status: "error", message: "密碼不一致，請重新確認" };
    }
    const API = "http://localhost:3005/api/member/users/register";

    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, password1 }),
      });

      const result = await res.json();
      if (result.status !== "success") {
        throw new Error(result.message || "註冊失敗，請稍後再試");
      }

      return { status: "success", message: result.message || "註冊成功" };
    } catch (error) {
      console.error("註冊錯誤:", error);
      // 顯示錯誤訊息以便偵錯
      alert(error.message || "註冊失敗，請稍後再試");
      // 如果錯誤訊息中包含 '409' 或 'Email 已存在'，就跳轉到 login 頁面
      if (
        error.message &&
        (error.message.includes("409") || error.message.includes("已存在"))
      ) {
        router.push("/member/login");
      }
    }
  };

  // 獲取使用者個人資料
  useEffect(() => {
    const token = localStorage.getItem(appKey);
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const res = await fetch(
          "http://localhost:3005/api/member/users/status",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await res.json();
        if (result.status !== "success") throw new Error(result.message);

        localStorage.setItem(appKey, result.data.token);
        const newUser = jwt.decode(result.data.token);
        console.log("✅ 使用者登入成功:", newUser);
        setUser(newUser);
      } catch (err) {
        console.error("❌ 取得用戶狀態失敗:", err);
        localStorage.removeItem(appKey);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!user ||user === -1 || !user.id) return;
    const storedToken = localStorage.getItem("loginWithToken");

    if (!storedToken) {
      setUser(null);
      setLoading(false); // ✅ 避免無限 `loading`
      return;
    }
    

    const fetchProfile = async () => {
      try {
        const profileAPI = `http://localhost:3005/api/member/users/${user.id}`;
        const res = await fetch(profileAPI, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        const result = await res.json();
        if (result.status !== "success") throw new Error(result.message);
        console.log("🔍 使用者資料:", result.data);
        setProfile(result.data);
      } catch (err) {
        console.error("❌ 取得使用者資料失敗:", err.message);
        setProfile({
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
        
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        profile,
        loading,
        error,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
// 使用 Auth
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth 必須在 AuthProvider 內使用");
  }
  return context;
};
