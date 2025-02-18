"use client"

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import jwt from "jsonwebtoken";
const appKey = "loginWithToken";

const AuthContext = createContext(null);
AuthContext.displayName = "AuthContext";

export function AuthProvider({ children }){
  const [user, setUser] = useState(null);

  const router = useRouter();
  const pathname = usePathname();
  const protectedRoutes = ["/admin"];
  const loginRoute = "/";

  const login = async (account, password) => {
    let API = "http://localhost:3005/api/users/login";
    
    const formData = new FormData();
    formData.append("account", account);
    formData.append("password", password);
    try{
      const res = await fetch(API, {
        method: "POST",
        body: formData
      });
      const result = await res.json();
      console.log(result);
      if(result.status != "success") throw new Error(result.message);
      const token = result.data.token;
      const newUser = jwt.decode(token);
      setUser(newUser);
      localStorage.setItem(appKey, token);
    }catch(err){
      console.log(err);
      alert(err.message);
    }
  }

  const logout = async () => {
    let API = "http://localhost:3005/api/users/logout";
    let token = localStorage.getItem(appKey);
    try{
      if(!token) throw new Error("身分認證訊息不存在, 請重新登入");
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
      setUser(null);
    }catch(err){
      console.log(err);
      alert(err.message)
    }
  };
const register = async (account, password) => {
  const API = "http://localhost:3005/api/users/register";  // 註冊 API 路徑
  
  if (!account || !password) {
    alert("帳號或密碼不可為空");
    return;
  }  
  const formData = new FormData();
  formData.append("account", account);
  formData.append("password", password);

  try {
    const res = await fetch(API, {
      method: "POST",
      body: formData,
    });
    const result = await res.json();
    console.log(result);

    if (result.status !== "success") throw new Error(result.message);

    const token = result.data.token;
    const newUser = jwt.decode(token);
    setUser(newUser);
    localStorage.setItem(appKey, token);  // 儲存 token

    // 註冊成功後，跳轉或顯示提示
    alert("註冊成功,請登入!");
    router.replace(loginRoute);
  } catch (err) {
    console.log(err);
    alert(err.message);  // 顯示錯誤訊息
  }
};
  useEffect(() => {    
    if(!user && protectedRoutes.includes(pathname)){
      alert("請先登入");
      router.replace(loginRoute)
    }
  }, [pathname, user]);

  useEffect(()=>{
    let token = localStorage.getItem(appKey);
    if(!token) return;
    const fetchData = async () => {
      let API = "http://localhost:3005/api/users/status";
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
      }
    };
    fetchData();
  }, []);

  return(
    <AuthContext.Provider value={{user, login, logout, register}}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext);