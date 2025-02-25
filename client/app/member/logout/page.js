"use client";
import styles from "../Login.module.css";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";

export default function Logout() {
    const { logout } = useAuth();

    useEffect(() => {
        logout();
      }, [logout]);

    return (
        <div className={styles.loginPage}>
            <div className={styles.main}>
                <img src="/image/DiveIn-logo-dark-final.png" alt="logo" className={styles.logo} />
                <div className={styles.line1}></div>
                <div className={styles.sectionLogin}>
                    <h3>BYE BYE</h3>
                </div>
            </div>
        </div>
    );
}
