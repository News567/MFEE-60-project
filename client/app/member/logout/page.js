"use client";
import styles from "../Login.module.css";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";

export default function Logout() {
    const { logout } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true); // 設定 loading 狀態

    useEffect(() => {
        const handleLogout = async () => {
            await logout(); // 確保 logout 是異步的
            setIsLoading(false);
            router.push("/"); // 確保登出後轉跳
        };

        handleLogout();
    }, []);

    return (
        <div className={styles.loginPage}>
            <div className={styles.main}>
                <img src="/image/DiveIn-logo-dark-final.png" alt="logo" className={styles.logo} />
                <div className={styles.line1}></div>
                <div className={styles.sectionLogin}>
                    {isLoading ? (
                        <div className={styles.loadingContainer}>
                            <h3>正在登出...</h3>
                            <div className={styles.loader}></div> {/* 加載動畫 */}
                        </div>
                    ) : (
                        <h3>BYE BYE</h3>
                    )}
                </div>
            </div>
        </div>
    );
}
