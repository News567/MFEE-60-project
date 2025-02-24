"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import jwt from "jsonwebtoken";

const appKey = "loginWithToken";
const AuthContext = createContext(null);
AuthContext.displayName = "AuthContext";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const pathname = usePathname();
  const protectedRoutes = ["/admin"];
  const loginRoute = "/";

  const login = async (email, password) => {
    const API = "http://localhost:3005/api/member/users/login";

    try {
      const bodyData = { email, password };

      console.log("Request Body:", bodyData);

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

  const logout = async () => {
    let API = "http://localhost:3005/api/member/users/logout";
    let token = localStorage.getItem(appKey);
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
      token = result.data.token;
      localStorage.setItem(appKey, token);
      setUser(null);
    } catch (err) {
      console.log(err);
      alert(err.message);
    }
  };
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

      // 回傳結果
      return { status: "success", message: result.message || "註冊成功" };
    } catch (err) {
      console.log(err);
      return {
        status: "error",
        message: err.message || "註冊失敗，請稍後再試",
      };
    }
  };

  useEffect(() => {
    let token = localStorage.getItem(appKey);
    if (!token) return;
    const fetchData = async () => {
      let API = "http://localhost:3005/api/users/status";
      try {
        const res = await fetch(API, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await res.json();
        if (result.status != "success") throw new Error(result.message);
        token = result.data.token;
        localStorage.setItem(appKey, token);
        const newUser = jwt.decode(token);
        setUser(newUser);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
