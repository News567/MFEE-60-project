"use client"
import styles from "./group.module.css";
import GroupCard from "@/group/_components/GroupCard";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@/hooks/use-auth";


export default function MemberGroupPage() {
  // 設定揪團資料
  const [mygroups, setMyGroups] = useState([]);

  // 獲取會員
  const {user} = useAuth()

  // 設定api路徑
  const api = "http://localhost:3005/api";
  

  // 連接後端獲取揪團資料
  useEffect(() => {
    const getList = async () => {
      await axios
        .get(api + "/group")
        .then((res) => {
          // console.log(res.data.data);
          setMyGroups(res.data.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getList();
  }, []);

  return (
    <div className={`${styles.content} container`}>
      <div className={styles.aside}>
        <div className={styles.listBox}>
          <div className={styles.asideTitle}>
            <h5 style={{ margin: 0 }}>會員中心</h5>
          </div>
          <div className={styles.asideContent}>
            <div className={styles.ASother}>
              <h6 style={{ margin: 0 }}>我的帳戶</h6>
            </div>
            <div className={styles.ASother}>
              <h6 style={{ margin: 0 }}>我的訂單</h6>
            </div>
            <div className={styles.ASpoint}>
              <h6 style={{ margin: 0 }}>我的揪團</h6>
            </div>
            <div className={styles.ASother}>
              <h6 style={{ margin: 0 }}>我的最愛</h6>
            </div>
            <div className={styles.ASother}>
              <h6 style={{ margin: 0 }}>我的優惠券</h6>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.main}>
        <div className={styles.mainTitle}>
          <h4 style={{ fontWeight: 700, margin: 0 }}>我的揪團</h4>
        </div>
        <div className={styles.sectionTop}>
          <div className={styles.SThover}>
            <h6>全部</h6>
          </div>
          <div className={styles.STdefault}>
            <h6>已參加</h6>
          </div>
          <div className={styles.STdefault}>
            <h6>已發起</h6>
          </div>
          <div className={styles.STdefault}>
            <h6>已結束</h6>
          </div>
          <div className={styles.STdefault}>
            <h6>已取消</h6>
          </div>
        </div>
        {mygroups && mygroups.length > 0 ? (mygroups.map((mygroup, i) => {
          return (
            <GroupCard key={i} group={mygroup} />
          )
        })) : ("目前沒有揪團")}
        
      </div>
    </div>
  );
}
