"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import jwt from "jsonwebtoken";

const appKey = "loginWithToken";
const AuthContext = createContext(null);
AuthContext.displayName = "AuthContext";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [error, setError] = useState(null);
  const router = useRouter();
  const pathname = usePathname();
  const protectedRoutes = ["/users/:email"];

  // 处理用户登录
  const login = async (email, password) => {
    const API = "http://localhost:3005/api/member/users/login";

    try {
      const bodyData = { email, password };
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      if (!res.ok) {
        const errorDetails = await res.json();
        console.error("Error Details:", errorDetails);
        throw new Error(errorDetails.message || "Unknown error");
      }

      const result = await res.json();
      if (result.status !== "success") throw new Error(result.message);

      const token = result.data.token;
      localStorage.setItem(appKey, token);
      setUser(jwt.decode(token));

      alert("登入成功");
      router.replace("/");
    } catch (err) {
      console.log(err);
      alert(err.message);
    }
  };
  // 处理用户登出
  const logout = async () => {
    const API = "http://localhost:3005/api/member/users/logout";
    const token = localStorage.getItem(appKey);
    try {
      if (!token) throw new Error("身分認證訊息不存在, 請重新登入");
      const res = await fetch(API, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await res.json();
      if (result.status != "success") throw new Error(result.message);
      localStorage.removeItem(appKey);
      setUser(null);
      router.replace("/member/login")
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
  // 在组件加载时检查 token 状态
  useEffect(() => {
    const token = localStorage.getItem(appKey);

    if (!token) {
      if (protectedRoutes.includes(pathname)) {
        router.replace("/login");
      }
      return;
    }

    const fetchData = async () => {
      const API = "http://localhost:3005/api/member/users/status";
      try {
        const res = await fetch(API, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await res.json();
        if (result.status !== "success") throw new Error(result.message);
        localStorage.setItem(appKey, result.data.token);
        setUser(jwt.decode(result.data.token));
      } catch (err) {
        console.log(err);
        localStorage.removeItem(appKey);
        setUser(null);
        if (protectedRoutes.includes(pathname)) {
          router.replace("/member/login"); // 只有 token 失效才跳轉
        }
      }
    };
    const fetchProfile = async () => {
      if (!user) return;

      setLoading(true);
      const profileAPI = `http://localhost:3005/api/member/users/${user.email}`;
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

    fetchData();
  }, [pathname, user, router]);

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
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
