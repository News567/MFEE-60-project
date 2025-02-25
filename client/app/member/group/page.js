"use client"
import styles from "./group.module.css";
import GroupCard from "@/group/_components/GroupCard";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";


export default function MemberGroupPage() {
  // 揪團資料
  const [mygroups, setMyGroups] = useState([]);
  const [originMyGroups, setOriginMyGroups] = useState([])

  // 前端用的篩選條件
  const [status, setStatus] = useState(0) //status 0:揪團中 1:已成團 2:已取消
  // 送後端用的篩選條件
  const [condition, setCondition] = useState({})

  // 獲取會員
  const { user } = useAuth()
  console.log(user);

  // 設定api路徑
  const api = "http://localhost:3005/api";

  // 確認是否登入
  useEffect(() => {
    if (!user) {
      alert("請先登入！")
      window.location = "/member/login"
      return
    }
    const userId = user.id
    setCondition(
      { ...condition, user: userId }
    )
  }, [user])


  // 連接後端獲取揪團資料
  useEffect(() => {
    console.log(condition);
    const getList = async () => {
      await axios
        .post((api + "/member/myGroup"), condition)
        .then((res) => {
          console.log(res.data.data);
          setMyGroups(res.data.data);
          setOriginMyGroups(res.data.data)
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getList();
  }, [condition]);

  // 前端篩選是否是user創辦的
  function doFilterHosted(isHost) {
    //主揪1，非主揪的2，全部3
    switch (isHost) {
      case 1:
        setMyGroups(originMyGroups.filter(item => item.user_id == user.id))
        break
      case 2:
        setMyGroups(originMyGroups.filter(item => item.user_id != user.id))
        break
      case 3:
        setMyGroups(originMyGroups)
        break
    }
  }


  return (
    <div className={`${styles.content} container`}>
      <div className={`${styles.aside} d-none d-sm-flex`}>
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
              <Link href="/coupon">

                <h6 style={{ margin: 0 }}>我的優惠券</h6>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.main}>
        <div className={styles.mainTitle}>
          <h4 style={{ fontWeight: 700, margin: 0 }}>我的揪團</h4>
        </div>
        <div className={styles.sectionTop}>
          <div className={`${styles.STdefault} ${styles.active} `} onClick={
            (e) => {
              const btns = document.querySelectorAll(`.${styles.STdefault}`)
              btns.forEach((btn) => {
                btn.classList.remove(`${styles.active}`)
              })
              e.target.classList.add(`${styles.active}`)
              doFilterHosted(3)
            }
          }>
            所有揪團
          </div>
          <div className={styles.STdefault} onClick={
            (e) => {
              const btns = document.querySelectorAll(`.${styles.STdefault}`)
              btns.forEach((btn) => {
                btn.classList.remove(`${styles.active}`)
              })
              e.target.classList.add(`${styles.active}`)
              doFilterHosted(2)
            }
          }>參加的揪團
          </div>
          <div className={styles.STdefault} onClick={
            (e) => {
              const btns = document.querySelectorAll(`.${styles.STdefault}`)
              btns.forEach((btn) => {
                btn.classList.remove(`${styles.active}`)
              })
              e.target.classList.add(`${styles.active}`)
              doFilterHosted(1)
            }
          }>發起的揪團
          </div>
          <div className={styles.STdefault} onClick={
            (e) => {
              const btns = document.querySelectorAll(`.${styles.STdefault}`)
              btns.forEach((btn) => {
                btn.classList.remove(`${styles.active}`)
              })
              e.target.classList.add(`${styles.active}`)
            }
          }>已成團
          </div>
          <div className={styles.STdefault} onClick={
            (e) => {
              const btns = document.querySelectorAll(`.${styles.STdefault}`)
              btns.forEach((btn) => {
                btn.classList.remove(`${styles.active}`)
              })
              e.target.classList.add(`${styles.active}`)
            }
          }>已取消
          </div>
        </div>
        <div className="w-100 d-flex flex-column gap-3" id="groupCards">
          {mygroups && mygroups.length > 0 ? (mygroups.map((mygroup, i) => {
            return (
              <div key={i} className="d-flex gap-3">
                  <a className="w-100 text-decoration-none text-reset" data-bs-toggle="collapse" href={`#collapseExample${i}`} role="button" aria-expanded="false" aria-controls="collapseExample">
                    <GroupCard group={mygroup} />
                  </a>
                  <div className={`collapse collapse-horizontal`} id={`collapseExample${i}`} data-bs-parent="#groupCards">
                    <div className="d-flex gap-2 h-100 flex-column justify-content-between ${styles.collapseSection}">
                      <button className={`btn text-nowrap h-100 ${styles.primaryBtn} ${styles.operateBtn}`}>查看揪團詳情</button>
                      <button className={`btn text-nowrap h-100 ${styles.primaryBtn}`}>修改揪團資訊</button>
                      <button className={`btn text-nowrap h-100 btn-danger`}>取消揪團</button>
                    </div>
                  </div>
                </div>
            )
          })) : ("目前沒有揪團")}
        </div>
      </div>
    </div>
  );
}
