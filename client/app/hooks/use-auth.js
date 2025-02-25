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
      router.replace("/member/login");
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
  // 當頁面加載時檢查 token 狀態，並更新 user 資訊
  useEffect(() => {
    const storedToken = localStorage.getItem(appKey);
    console.log("檢查 token：", storedToken);
    if (!storedToken) return;
    const fetchData = async () => {
      const API = "http://localhost:3005/api/member/users/status";
      try {
        const res = await fetch(API, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });
        const result = await res.json();
        console.log("status API result:", result);
        if (result.status !== "success") throw new Error(result.message);
        localStorage.setItem(appKey, result.data.token);
        setToken(result.data.token);
        setUser(jwt.decode(result.data.token));
      } catch (err) {
        console.log("status API error:", err);
        localStorage.removeItem(appKey);
        setToken(null);
        setUser(null);
        if (pathname !== "/member/login") {
          router.replace("/member/login");
        }
      }
    };
    fetchData();
  }, [pathname, router]);

  // 當 user 存在時，利用 user.id 去獲取使用者詳細資料
  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      setLoading(true);
      const profileAPI = `http://localhost:3005/api/member/users/account/${user.id}`;
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
    <AuthContext.Provider value={{ user, profile, loading, error, login, logout, register }}>
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
