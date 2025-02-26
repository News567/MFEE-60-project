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
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const router = useRouter();
  const pathname = usePathname();
  const protectedRoutes = ["/admin"];

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
      // setToken(null);
      setUser(null);
      // setError(null);
      router.replace("/");
    } catch (err) {
      console.log(err);
      alert(err.message);
      localStorage.removeItem(appKey); // 登出失敗改為移除 localStorage 中的登入 token
      setUser(null); // 使用者設為 null
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

      // if (!res.ok) {
      //   const errorData = await res.json();
      //   throw new Error(errorData.message || "註冊失敗，請稍後再試");
      // }

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
    console.log({ user, pathname });
    if (user == -1) return;
    if (!user && protectedRoutes.includes(pathname)) {
      alert("請先登入");
      router.replace(loginRoute);
    }
  }, [pathname, user]);

  useEffect(()=>{
    let token = localStorage.getItem(appKey);
    if(!token){
      setUser(null); // 確保未登入時使用是 null      
      return;
    }
    const fetchData = async () => {
      let API = "http://localhost:3005/api/member/users/status";
      try{
        const res = await fetch(API, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const result = await res.json();
        if(result.status != "success") throw new Error(result.message);
        token = result.data.token;
        localStorage.setItem(appKey, token);
        const newUser = jwt.decode(token);
        setUser(newUser)
      }catch(err){
        console.log(err);
        localStorage.removeItem(appKey); // 判斷狀態失敗改為移除 localStorage 中的登入 token
      }
    };
    fetchData();
  }, []);


  useEffect(() => {
    let token = localStorage.getItem(appKey);
    if(!token){
      setUser(null); // 確保未登入時使用是 null      
      return;
    }
    const fetchProfile = async () => {
      setLoading(true);
      const profileAPI = `http://localhost:3005/api/member/users/${user.id}`;
      try {
        const res = await fetch(profileAPI, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
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
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, profile, loading, error, login, logout, register }}>
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
