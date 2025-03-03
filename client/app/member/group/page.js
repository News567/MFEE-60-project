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

  // modal要用的資料
  const [modalGroup, setModalGroup] = useState(null)

  // 獲取會員
  const { user } = useAuth()
  console.log(user);
  useEffect(()=>{
    console.log("user更新了"+user.id);
  },[user])

  // 設定地點選項
  const selectOption = {
    0: [],
    1: ["屏東", "台東", "澎湖", "綠島", "蘭嶼", "小琉球", "其他"],
    2: ["沖繩", "石垣島", "其他"],
    3: ["長灘島", "宿霧", "薄荷島", "其他"],
    4: ["其他"]
  }
  const [countrySelect, setCountrySelect] = useState(0)
  const [citySelect, setCitySelect] = useState(selectOption[countrySelect])
  const [city, setCity] = useState(0)
  // console.log("citySelect: " + citySelect);
  const doCountrySelect = (e) => {
    setCountrySelect(e.target.value)
  }
  useEffect(() => {
    setCitySelect(selectOption[countrySelect])
  }, [countrySelect])




  // 設定api路徑
  const api = "http://localhost:3005/api";

  // 確認是否登入
  useEffect(() => {  
    
    // if (!user.user) { // 檢查 user 和 user.user 是否為 undefined
    //   alert("請先登入！")
    //   window.location = "/admin/login"
    //   return
    // }
    if (user && user.id) {
      const userId = user.id
      setCondition({ ...condition, user: userId })
    }
  }, [user])

  useEffect(() => {
    console.log(modalGroup);
  }, [modalGroup])


  // 連接後端獲取揪團資料
  useEffect(() => {
    console.log("condition:"+ [condition]);
    if (!condition.user) return
    const getList = async () => {
      await axios
        .post((api + "/member/myGroup"), condition)
        .then((res) => {
          console.log(res.data.data);
          setMyGroups(res.data.data)
          setOriginMyGroups(res.data.data)
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getList();
  }, [condition]);


  // 刪除揪團
  async function doCancel(myGroupId) {
    alert("是否確認要取消此揪團？此操作無法復原！")
    try {
      await axios.put(api + "/member/myGroup/" + myGroupId).then((res)=>{
        if(res.status == "success"){
          alert("已取消此項揪團！")
        }
      })
    } catch (error) {

    }
  }
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

  // 設定modal用的group
  function doSetModal(data){
    setModalGroup(data)
    console.log(modalGroup);
  }

  const checkStatus = ()=>{
        setMyGroups(originMyGroups.filter(item => item.status == 1))
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
              checkStatus()
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
                <a className="w-100 text-decoration-none text-reset" data-bs-toggle="collapse" href={`#collapseExample${i}`} role="button" aria-expanded="false" aria-controls="collapseExample" onClick={() => {
                        doSetModal(mygroup)
                      }}>
                  <GroupCard group={mygroup} />
                </a>
                <div className={`collapse collapse-horizontal`} id={`collapseExample${i}`} data-bs-parent="#groupCards">
                  <div className="d-flex gap-2 h-100 flex-column justify-content-between ${styles.collapseSection}">
                    <button className={`btn text-nowrap h-100 ${styles.primaryBtn} ${styles.operateBtn}`} data-bs-toggle="modal" data-bs-target="#groupModal"
                      >查看揪團詳情</button>
                    {mygroup.user_id == user.id ? (<>
                      <button className={`btn text-nowrap h-100 ${styles.primaryBtn}`}>修改揪團資訊</button>
                      <button className={`btn text-nowrap h-100 ${styles.cancelBtn} btn-danger`} onClick={() => doCancel(mygroup.id)}>取消揪團</button>
                    </>) : (
                      <button className={`btn text-nowrap h-100 ${styles.cancelBtn} btn-danger`}>退出揪團</button>
                    )}
                  </div>
                </div>
              </div>
            )
          })) : (<div className="text-center">目前沒有揪團</div>)}
          <div className={styles.cancel}>已取消的揪團</div>
        </div>

        {/* 檢視詳細揪團資料的modal */}
        <div className="modal fade" id="groupModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" key={modalGroup ? modalGroup.id : 'default'}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">揪團詳情</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <form className="group-create d-flex flex-column w-100">
                <div className="modal-body">
                  {modalGroup ? (
                    <>
                      <input type="hidden" name="userId" id="" value={user.id} />
                      <div className="fs-22px">
                        揪團首圖
                      </div>
                      <div className={styles.imgContainer}>
                        <img className={styles.img} src={`/image/group/${modalGroup.group_img}`} alt="" />
                      </div>
                      <input type="file" name="file" required />
                      <div>
                        <div className="fs-22px mb-15px">
                          揪團標題
                        </div>
                        <input defaultValue={modalGroup.name} className="form-control" type="text" name="title" id="" readOnly />
                      </div>
                      <div>
                        <div className="fs-22px mb-15px">
                          揪團性別
                        </div>
                        <select className="form-select" name="gender" id="" defaultValue={modalGroup.gender} readOnly>
                          <option value="default" disabled>
                            請選擇揪團性別
                          </option>
                          <option value={1}>不限性別</option>
                          <option value={2}>限男性</option>
                          <option value={3}>限女性</option>
                        </select>
                      </div>
                      <div>
                        <div className="fs-22px mb-15px">
                          揪團人數
                        </div>
                        <input className="form-control" type="number" name="maxNumber" defaultValue={modalGroup.max_number} id="" readOnly />
                      </div>
                      <div>
                        <div className="fs-22px mb-15px">
                          揪團分類
                        </div>
                        <select className="form-select" name="type" id="" defaultValue={modalGroup.type} readOnly>
                          <option value="default" disabled>
                            請選擇揪團分類
                          </option>
                          <option value={1}>浮潛</option>
                          <option value={2}>自由潛水</option>
                          <option value={3}>水肺潛水</option>
                          <option value={4}>其他</option>
                        </select>
                      </div>
                      <div>
                        <div className="fs-22px mb-15px">
                          證照資格
                        </div>
                        <select className="form-select" name="certificates" id="" defaultValue={modalGroup.certificates} readOnly>
                          <option value="default" disabled>
                            請選擇是否需要證照
                          </option>
                          <option value="1">無須證照</option>
                          <option value="2">需OWD證照</option>
                          <option value="3">需AOWD證照</option>
                        </select>
                      </div>
                      <div>
                        <div className="fs-22px mb-15px">
                          揪團地點
                        </div>
                        <select name="country" className="form-select mb-15px" id="" defaultValue={1} onChange={doCountrySelect} readOnly>
                          <option value="default" disabled>
                            請選擇揪團國家
                          </option>
                          <option value={1}>台灣</option>
                          <option value={2}>日本</option>
                          <option value={3}>菲律賓</option>
                          <option value={4}>其他</option>
                        </select>
                        <select className="form-select" name="city" id="" defaultValue="default">
                          {citySelect.length > 0 ? (citySelect.map((v, i) => (
                            <>
                              <option key={`${v}+${i}`} value={v}>
                                {v}
                              </option>
                            </>
                          )
                          )) : (<option value="default" disabled>
                            請先選擇國家
                          </option>)}
                        </select>
                      </div>
                      <div className="row">
                        <div className="col-12 col-sm-6 d-flex flex-column gap-3 row-first">
                          <div className="fs-22px">
                            活動日期
                          </div>
                          <input className="form-control" type="date" name="date" defaultValue={modalGroup.date} readOnly />
                        </div>
                        <div className="col-12 col-sm-6 d-flex flex-column gap-3">
                          <div className="fs-22px">
                            活動時間
                          </div>
                          <input className="form-control" type="time" name="time" defaultValue={modalGroup.time} readOnly />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-12 col-sm-6 d-flex flex-column gap-3 row-first">
                          <div className="fs-22px">
                            揪團截止日期
                          </div>
                          <input className="form-control" type="date" name="signEndDate" defaultValue={"2000-05-07"} readOnly />
                        </div>
                        <div className="col-12 col-sm-6 d-flex flex-column gap-3">
                          <div className="fs-22px">
                            揪團截止時間
                          </div>
                          <input className="form-control" type="time" name="signEndTime" defaultValue={"00:00:00"} readOnly />
                        </div>
                      </div>
                      <div>
                        <div className="fs-22px mb-15px">揪團資訊</div>
                        <textarea
                          className="form-control"
                          name="description"
                          id=""
                          rows={5}
                          defaultValue={modalGroup.description}
                        />
                      </div>
                    </>
                  ) : (<div>載入中</div>)}

                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  <button type="button" className="btn btn-primary">Save changes</button>
                </div>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
