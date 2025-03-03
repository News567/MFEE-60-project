"use client";
import { useState } from "react";
import { FaRegUser } from "react-icons/fa";
import { Menu, MenuItem, IconButton } from "@mui/material";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";

export default function User() {
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  console.log("當前用戶狀態:", user);

  return (
    // FIXME: 修正下拉選單位置
    <div className="position-relative">
      {user && user !== -1 ? (
        <IconButton onClick={handleClick}>
          <FaRegUser />
        </IconButton>
      ) : (
        <Link href="/member/login" className="header-cart a">
          <FaRegUser />
        </Link>
      )}

      {/* ✅ 修正下拉選單位置 */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{ marginTop: "8px" }}
      >
        <div>
          {user ? (
            <>
              <MenuItem onClick={handleClose}>
                <Link href="/member/favorite">我的收藏</Link>
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <Link href="/coupon">優惠券</Link>
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <Link href="/member/group">我的揪團</Link>
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <Link href="/member/account">帳戶設定</Link>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleClose();
                }}
                style={{ color: "red" }}
              >
              <Link href="/member/logout" className="text-reset">
                登出
              </Link>
              </MenuItem>
            </>
          ) : (
            <MenuItem onClick={handleClose}>
              <Link href="/member/login">登入</Link>
            </MenuItem>
          )}
        </div>
      </Menu>
    </div>
  );
}
