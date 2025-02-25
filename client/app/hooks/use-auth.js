"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import jwt from "jsonwebtoken";

const appKey = "loginWithToken";
const AuthContext = createContext(null);
AuthContext.displayName = "AuthContext";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // 避免 Hydration Mismatch
  const router = useRouter();
  const pathname = usePathname();
  const protectedRoutes = ["/admin"];
  const loginRoute = "/";

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem(appKey);
      if (!token) {
        setIsLoading(false);
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
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }
  }, []);

  const login = async (email, password) => {
    const API = "http://localhost:3005/api/member/users/login";

    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errorDetails = await res.json();
        throw new Error(errorDetails.message || "Unknown error");
      }

      const result = await res.json();
      if (result.status !== "success") throw new Error(result.message);

      localStorage.setItem(appKey, result.data.token);
      setUser(jwt.decode(result.data.token));

      alert("登入成功");
      router.replace("/");
    } catch (err) {
      console.log(err);
      alert(err.message);
    }
  };

  const logout = async () => {
    const API = "http://localhost:3005/api/member/users/logout";

    if (typeof window === "undefined") return;

    const token = localStorage.getItem(appKey);
    if (!token) {
      alert("身分認證訊息不存在, 請重新登入");
      return;
    }

    try {
      const res = await fetch(API, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();
      if (result.status !== "success") throw new Error(result.message);

      localStorage.removeItem(appKey);
      setUser(null);
      router.replace(loginRoute);
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

      const result = await res.json();
      if (result.status !== "success") throw new Error(result.message);

      alert("註冊成功,請登入!");
      router.replace(loginRoute);
    } catch (err) {
      console.log(err);
      alert(err.message);
    }
  };

  if (isLoading) return <div>載入中...</div>; // 避免 Hydration 錯誤

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
