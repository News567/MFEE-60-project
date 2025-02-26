"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import jwt from "jsonwebtoken";

const appKey = "loginWithToken";
const AuthContext = createContext(null);
AuthContext.displayName = "AuthContext";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(appKey);
    }
    return null;
  });

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const storedToken = localStorage.getItem(appKey);
    if (!storedToken && pathname !== "/member/login") {
      router.replace("/member/login");
    }
  }, [router, pathname]);

  // 處理用戶登入
  const login = async (email, password) => {
    const API = "http://localhost:3005/api/member/users/login";

    try {
      const bodyData = { email, password };
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errorDetails = await res.json();
        console.error("Error Details:", errorDetails);
        throw new Error(errorDetails.message || "Unknown error");
      }

      const result = await res.json();
      if (result.status !== "success") throw new Error(result.message);

      const newToken = result.data.token;
      localStorage.setItem(appKey, newToken);
      setToken(newToken);
      const decoded = jwt.decode(newToken);
      setUser(decoded);

      alert("登入成功");
      router.replace("/");
    } catch (err) {
      console.log(err);
      alert(err.message);
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
    const API = "http://localhost:3005/api/member/users/logout";
    const storedToken = localStorage.getItem(appKey);
    try {
      if (!storedToken) throw new Error("身分認證訊息不存在, 請重新登入");
      const res = await fetch(API, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      const result = await res.json();
      if (result.status != "success") throw new Error(result.message);
      localStorage.removeItem(appKey);
      setToken(null); 
      setUser(null);
      setError(null); 
      router.replace("/");
    } catch (err) {
      console.log(err);
      alert(err.message);
    }
  };

  // 处理用户注册
  const register = async (email, password) => {
    const API = "http://localhost:3005/api/member/users/register";

    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "註冊失敗，請稍後再試");
      }

      const result = await res.json();
      if (result.status !== "success") {
        throw new Error(result.message || "註冊失敗，請稍後再試");
      }

      return { status: "success", message: result.message || "註冊成功" };
    } catch (err) {
      console.log(err);
      return {
        status: "error",
        message: err.message || "註冊失敗，請稍後再試",
      };
    }
  };
  

  // 獲取使用者個人資料
  useEffect(() => {
    if (!user || !user.id) return;
    const fetchProfile = async () => {
      setLoading(true);
      const profileAPI = `http://localhost:3005/api/member/users/${user.id}`;
      try {
        const res = await fetch(profileAPI, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem(appKey)}`,
          },
        });
        const result = await res.json();
        if (result.status !== "success") throw new Error(result.message);
        setProfile(result.data);
      } catch (err) {
        setError(err.message);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  return (
    <AuthContext.Provider value={{ token, setToken, user, setUser, profile, loading, error, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}
// 使用 Auth
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
