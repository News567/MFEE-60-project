"use client";
import { useEffect, image, useState } from "react";
import axios from "axios";
import styles from "./detail.module.css";
// import "./detail.css";
import "./Calendar.css";
import { useCart } from "@/hooks/cartContext";
import { useRouter } from "next/router";
import { useAuth } from "@/hooks/use-auth";

// import icons
import {
  FaRegHeart,
  FaMapMarkerAlt,
  FaRegClock,
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaRegCheckCircle,
} from "react-icons/fa";
import {
  BsGlobe,
  BsDashCircle,
  BsPlusCircle,
  BsChevronDown,
  BsChevronRight,
} from "react-icons/bs";
import { TbCoinFilled } from "react-icons/tb";

// import calendar
import Calendar from "react-calendar";

import React from "react";
import { Gallery, Item } from "react-photoswipe-gallery";
import "photoswipe/dist/photoswipe.css";
import { useParams } from "next/navigation";
import RecommendCard from "./_components/RecommendCard";

export default function Home() {
  const api = "http://localhost:3005/api";
  const { id } = useParams();
  const { user } = useAuth();

  // 設定活動資料
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState([]);
  const [journey, setJourney] = useState([]);
  const [introduction, setIntroduction] = useState([]);
  const [duration, setDuration] = useState("");
  const [language, setLanguage] = useState("");
  const [meetingPoint, setMeetingPoint] = useState("");

  // 人數記數器
  const [count, setCount] = useState(0);

  // 獲取活動資料
  const [activities, setActivities] = useState([]); //該id活動
  const [projects, setProjects] = useState([]); //該id活動所有方案
  const [recommendActivity, setRecommendActivity] = useState([]); //推薦活動，和該id活動相同地點

  // 若最早預定日早於今天，改成明天
  const [tomorrow, setTomorrow] = useState("");
  const today = new Date();
  const tomorrowDate = new Date(today);

  useEffect(() => {
    const getList = async () => {
      await axios
        .get(api + "/activity" + "/" + id)
        .then((res) => {
          if (res.data.status !== "success") throw new Error("讀取資料失敗");
          setActivities(res.data.data);
          setProjects(res.data.project);
          setRecommendActivity(res.data.recommend);
          setTomorrow(tomorrowDate.setDate(today.getDate() + 1));
        })
        .catch((error) => {
          console.error("載入活動失敗:", error);
        });
    };
    getList();
  }, [id]);

  // 設定活動圖片
  const [img, setImg] = useState([]);
  // 賦予活動資料值
  useEffect(() => {
    // console.log(activities?.[0]);
    if (activities.length > 0) {
      setName(activities?.[0]?.name);
      setPrice(activities?.[0]?.price);
      setDuration(activities?.[0]?.duration);
      // console.log(activities?.[0]?.duration);
      setLanguage(activities?.[0]?.language);
      setJourney(activities?.[0]?.journey);
      const introductionContent = activities?.[0].introduction.split("\n");
      setIntroduction(introductionContent);
      if (activities?.[0].description) {
        const desciptionContent = activities?.[0].description.split("\n");
        setDescription(desciptionContent);
      }
      if (activities?.[0].journey) {
        const journeyContent = activities?.[0].journey.split("\n");
        setJourney(journeyContent);
      }
      if (activities?.[0].images) {
        const imgContent = activities[0].images.split(",");
        setImg(imgContent);
      }
    }
  }, [activities]);

  // 加入購物車
  const [selectedDate, setSelectedDate] = useState("");
  const doSelectedDate = (newDate) => {
    const dateToString = new Date(newDate).toISOString().split("T")[0];
    setSelectedDate(dateToString);
  };
  const [selectedTime, setSelectedTime] = useState("");
  //    const []
  const handleAddToCart = async (e) => {
    //放入要送往後端的useState 取得目前你點擊得商品/租賃/活動
    e.preventDefault();
    if (!user) {
      alert("請先登入！");
      return;
    }
    const formData = new FormData(e.target);
    const projectId = formData.get("projectId");
    console.log(projectId);
    console.log(count);
    console.log(selectedDate);
    console.log(selectedTime);
    try {
      //---- 發送購物車請求----

      //活動
      const activity = {
        userId: user.id, //(寫死)
        type: "activity", //(寫死)
        projectId: projectId, //(綁定資料來源)
        quantity: count, //(綁定按鈕)
        date: selectedDate, //(綁定按鈕)
        time: selectedTime, //(綁定按鈕)
      };

      //   下面不動
      const response = await axios.post(`${api}/cart/add`, activity);

      if (response.data.success) {
        //讓購物車重新從後端獲取最新數據，而不是自己組裝 cartItem
        // fetchCart(1);
        alert("成功加入購物車！");
      } else {
        alert(response.data.message || "加入購物車失敗");
      }
    } catch (error) {
      console.error("加入購物車失敗:", error);
      alert("加入購物車失敗，請稍後再試");
    }
  };

  // 設定燈箱
  const MyGallery = () => (
    <Gallery
      options={{
        getThumbBoundsFn: (index) => {
          const thumbnail =
            document.querySelectorAll(".pswp__thumbnail")[index];
          const pageY = window.scrollY || document.documentElement.scrollTop;
          const rect = thumbnail.getBoundingClientRect();
          return { x: rect.left, y: rect.top + pageY, w: rect.width };
        },
      }}
    >
      <div className={`row g-2`}>
        <Item
          original={`/image/activity/${activities?.[0]?.id}/${img[0]}`}
          thumbnail={`/image/activity/${activities?.[0]?.id}/${img[0]}`}
          width="1024"
          height="768"
        >
          {({ ref, open }) => (
            <img
              className={`col-6`}
              ref={ref}
              onClick={open}
              src={`/image/activity/${activities?.[0]?.id}/${img[0]}`}
            />
          )}
        </Item>
        <div className={`col-6 d-flex justify-content-center gap-2`}>
          <div className={`d-flex flex-column justify-content-between gap-2`}>
            <Item
              original={`/image/activity/${activities?.[0]?.id}/${img[1]}`}
              thumbnail={`/image/activity/${activities?.[0]?.id}/${img[1]}`}
              width="1024"
              height="768"
            >
              {({ ref, open }) => (
                <img
                  height="100%"
                  width="100%"
                  className=""
                  ref={ref}
                  onClick={open}
                  src={`/image/activity/${activities?.[0]?.id}/${img[1]}`}
                />
              )}
            </Item>
            <Item
              original={`/image/activity/${activities?.[0]?.id}/${img[2]}`}
              thumbnail={`/image/activity/${activities?.[0]?.id}/${img[2]}`}
              width="1024"
              height="768"
            >
              {({ ref, open }) => (
                <img
                  height="100%"
                  width="100%"
                  className=""
                  ref={ref}
                  onClick={open}
                  src={`/image/activity/${activities?.[0]?.id}/${img[2]}`}
                />
              )}
            </Item>
          </div>
          <div className={`d-flex flex-column justify-content-between gap-2`}>
            <Item
              original={`/image/activity/${activities?.[0]?.id}/${img[3]}`}
              thumbnail={`/image/activity/${activities?.[0]?.id}/${img[3]}`}
              width="1024"
              height="768"
            >
              {({ ref, open }) => (
                <img
                  height="100%"
                  width="100%"
                  className=""
                  ref={ref}
                  onClick={open}
                  src={`/image/activity/${activities?.[0]?.id}/${img[3]}`}
                />
              )}
            </Item>
            <Item
              original={`/image/activity/${activities?.[0]?.id}/${img[4]}`}
              thumbnail={`/image/activity/${activities?.[0]?.id}/${img[4]}`}
              width="1024"
              height="768"
            >
              {({ ref, open }) => (
                <img
                  height="100%"
                  width="100%"
                  className=""
                  ref={ref}
                  onClick={open}
                  src={`/image/activity/${activities?.[0]?.id}/${img[4]}`}
                />
              )}
            </Item>
          </div>
        </div>
      </div>
    </Gallery>
  );
  return (
    <>
      <main className={styles.main}>
        <section className={`container mb-5`}>
          {/* FIXME: react燈箱點開大圖會糊掉*/}
          <div
            className={`w-100 mb-2 ${styles.galleryContainer} d-none d-sm-block`}
          >
            <MyGallery />
          </div>
          <div className={`row w-100 m-0`}>
            <div className={`col-12 col-sm-8`}>
              <div className={`row`}>
                <div className={`col-sm-11 col-12 p-0`}>
                  <h4 className={`${styles.mb25px}`}>{name}</h4>
                  <div className={`${styles.mb25px}`}>
                    <FaMapMarkerAlt />
                    <span>
                      {" "}
                      {activities?.[0]?.country} - {activities?.[0]?.city_name}
                    </span>
                  </div>
                  <div
                    className={`${styles.mb25px} ${styles.colorPrimary} fw-bold`}
                  >
                    <span className={`d-sm-none d-inline`}>
                      <FaStar />
                    </span>
                    4.8{" "}
                    <span className={`d-none d-sm-inline`}>
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaStar />
                    </span>
                    <span className={`text-secondary fw-normal`}>
                      {" "}
                      (865) | 已售出 5K+
                    </span>
                  </div>
                  <div className={`d-sm-none d-flex flex-column gap-3 p-0`}>
                    <div className={`${styles.fwMedium} ${styles.fs22px}`}>
                      NT${price || "loading..."}
                    </div>
                    <div
                      className={`d-flex justify-content-between align-items-center`}
                    >
                      <div className={`border rounded px-3 py-1`}>95折</div>
                      <div>優惠券</div>
                    </div>
                  </div>
                  <div
                    className={`d-flex flex-column flex-sm-row gap-4 ${styles.timeLanguage}`}
                  >
                    <div className={`d-flex gap-2 align-items-center`}>
                      <FaRegClock />
                      <span>
                        行程時間：
                        {duration || "資料載入中"}
                      </span>
                    </div>
                    <div className={`d-flex gap-2 align-items-center`}>
                      <BsGlobe />
                      <div>導覽語言：{language}</div>
                    </div>
                  </div>
                  <div className={styles.promotionalWords}>
                    <ul>
                      {introduction && introduction.length > 0 ? (
                        introduction.map((text, index) => (
                          <li className={styles.li} key={index}>
                            {text}
                          </li>
                        ))
                      ) : (
                        <li>沒有內容</li>
                      )}
                    </ul>
                  </div>
                  <div className={`d-none d-sm-block`}>
                    <div className={`d-flex justify-content-between`}>
                      <h5 className={styles.h5}>旅客評價</h5>
                      <a className={`text-secondary`} href="#">
                        更多評價 &gt;
                      </a>
                    </div>
                    {/* 評論card */}
                    <div className={`d-flex ${styles.commentCard} gap-3`}>
                      <div className={`${styles.imgContainer} rounded-circle`}>
                        <img src="/image/images.jpg" alt="" />
                      </div>
                      <div className={`d-flex flex-column gap-2`}>
                        <h6 className={`m-0`}>Shu Hui</h6>
                        <div className={styles.star}>
                          <FaStar />
                          <FaStar />
                          <FaStar />
                          <FaStar />
                          <FaStar />
                          <span className={styles.text}>2021/10/23</span>
                        </div>
                        <div className={styles.commentText}>
                          <h6 className={`fw-bold`}>很開心</h6>
                          <p className={`m-0`}>
                            接待人員態度很親切，仔細解說、氣氛融洽、服務100分，浮潛裝備很齊全，裝口罩的防水罐很棒，有海龜在身邊共游，讓人回味無窮
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={`d-none d-sm-block col-sm-1 text-center`}>
                  <FaRegHeart className={`fs-4`} />
                </div>
              </div>
            </div>
            <div
              className={`d-none d-sm-flex flex-column gap-3 col-sm-4 border rounded ${styles.priceRight}`}
            >
              <div className={`${styles.fwMedium} ${styles.fs22px}`}>
                NT${price || "loading..."}
              </div>
              <div
                className={`d-flex justify-content-between align-items-center`}
              >
                <div className={`border rounded px-3 py-1`}>95折</div>
                <div>優惠券</div>
              </div>

              <a
                href="#projectCard"
                className={`w-100 btn ${styles.chooseBtn}`}
              >
                選擇方案
              </a>
            </div>
          </div>
        </section>
        <section className={`${styles.bgGray} py-5`}>
          <div className={`container`}>
            <h4 className={`${styles.mb25px}`}>選擇日期及人數</h4>
            {/* 手機版日期選擇 */}
            <div className={`d-sm-none mb-3`}>
              <div className={`d-flex justify-content-between mb-3`}>
                <div>選擇日期</div>
                {/* TODO:更多日期要做modal跳出月曆 */}
                <div
                  type="button"
                  className={`${styles.fs14px} ${styles.colorPrimary} text-decoration-underline`}
                >
                  更多日期 &gt;
                </div>
              </div>
              <div className={styles.mobileDateSession}>
                <div className={styles.dateCardContainer}>
                  <div className={`d-flex gap-2`}>
                    <div
                      className={`${styles.dateCard} d-flex flex-column justify-content-center`}
                    >
                      <div className={`${styles.fs14px} text-center`}>
                        1月20日
                      </div>
                      <div className={`${styles.fs14px} text-center`}>週日</div>
                    </div>
                    <div
                      className={`${styles.dateCard} d-flex flex-column justify-content-center ${styles.active}`}
                    >
                      <div className={`${styles.fs14px} text-center`}>
                        1月21日
                      </div>
                      <div className={`${styles.fs14px} text-center`}>週日</div>
                    </div>
                    <div
                      className={`${styles.dateCard} d-flex flex-column justify-content-center`}
                    >
                      <div className={`${styles.fs14px} text-center`}>
                        1月22日
                      </div>
                      <div className={`${styles.fs14px} text-center`}>週日</div>
                    </div>
                    <div
                      className={`${styles.dateCard} d-flex flex-column justify-content-center`}
                    >
                      <div className={`${styles.fs14px} text-center`}>
                        1月23日
                      </div>
                      <div className={`${styles.fs14px} text-center`}>週日</div>
                    </div>
                    <div
                      className={`${styles.dateCard} d-flex flex-column justify-content-center`}
                    >
                      <div className={`${styles.fs14px} text-center`}>
                        1月23日
                      </div>
                      <div className={`${styles.fs14px} text-center`}>週日</div>
                    </div>
                    <div
                      className={`${styles.dateCard} d-flex flex-column justify-content-center`}
                    >
                      <div className={`${styles.fs14px} text-center`}>
                        1月20日
                      </div>
                      <div className={`${styles.fs14px} text-center`}>週日</div>
                    </div>
                    <div
                      className={`${styles.dateCard} d-flex flex-column justify-content-center`}
                    >
                      <div className={`${styles.fs14px} text-center`}>
                        1月20日
                      </div>
                      <div className={`${styles.fs14px} text-center`}>週日</div>
                    </div>
                    <div
                      className={`${styles.dateCard} d-flex flex-column justify-content-center`}
                    >
                      <div className={`${styles.fs14px} text-center`}>
                        1月20日
                      </div>
                      <div className={`${styles.fs14px} text-center`}>週日</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* 方案卡片 */}
            <div id="collapseControl">
              {projects && projects.length > 0
                ? projects.map((v, i) => {
                    return (
                      <form
                        key={i}
                        onSubmit={handleAddToCart}
                        action=""
                        id="projectCard"
                      >
                        <input type="hidden" name="projectId" value={v.id} />
                        <div className={`${styles.activityProject} mb-3 p-5`}>
                          <div className={`d-flex justify-content-between`}>
                            <div
                              className={`${styles.activityPlain} gap-3 me-sm-5`}
                            >
                              <div className={`d-flex align-items-center`}>
                                <h6 className={`m-0 fw-bold ${styles.fs20px}`}>
                                  {v.name}
                                </h6>
                                {/* TODO: p2 先放著，想一下要不要做可以取消 */}
                                {/* <div
                                                              className={`ms-2 d-none d-sm-block ${styles.hint}`}>
                                                              7天前可免費取消
                                                          </div> */}
                              </div>
                              <div
                                className={`${styles.earliestBookingDay} d-flex align-items-center gap-2`}
                              >
                                <FaRegCheckCircle />
                                最早可預訂日：
                                <span>
                                  {new Date(v.earliestDate) > new Date()
                                    ? v.earliestDate
                                    : new Date(tomorrow)
                                        .toISOString()
                                        .split("T")[0]}
                                </span>
                              </div>
                              <div
                                type="button"
                                className={`${styles.fs14px} ${styles.colorPrimary} text-decoration-underline d-block d-sm-none`}
                                data-bs-toggle="modal"
                                data-bs-target="#detailModal"
                              >
                                查看方案詳情
                              </div>
                              {/* 手機板 */}
                              <div
                                className={`d-sm-none d-flex justify-content-between align-items-center`}
                              >
                                <div className={`fw-bold ${styles.fs20px}`}>
                                  NT${v.price}
                                  <span
                                    className={`${styles.fs14px} fw-normal`}
                                  >
                                    起
                                  </span>
                                </div>
                                <button
                                  className={`btn ${styles.colorPrimary} text-nowrap ${styles.chooseProjectBtn} px-4 py-2 ${styles.active}`}
                                >
                                  取消選擇
                                </button>
                              </div>
                              {/* 電腦版 */}
                              <ul className={`d-none d-sm-block`}>
                                {v.description.split("\n").map((v, i) => {
                                  return (
                                    <li key={i} className={`mb-3`}>
                                      {v}
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                            <div className={`d-sm-flex d-none`}>
                              <div className={`me-2`}>
                                {v.original_price != v.price ? (
                                  <>
                                    <div
                                      className={`text-nowrap text-white ${styles.fs14px} ${styles.bgSecondaryDeep} text-center rounded fw-bold`}
                                    >
                                      {Math.round(
                                        ((v.original_price - v.price) /
                                          v.original_price) *
                                          100
                                      )}
                                      % OFF
                                    </div>
                                    <div
                                      className={`text-nowrap text-end text-decoration-line-through ${styles.fs14px} text-secondary`}
                                    >
                                      NT$
                                      {v.original_price}
                                    </div>
                                    <div
                                      className={`text-nowrap text-end fw-bold ${styles.fs18px}`}
                                    >
                                      NT$
                                      {v.price}
                                    </div>
                                  </>
                                ) : (
                                  <div
                                    className={`text-nowrap text-end fw-bold ${styles.fs18px}`}
                                  >
                                    NT${v.price}
                                  </div>
                                )}
                              </div>
                              <button
                                className={`btn ${styles.colorPrimary} text-nowrap ${styles.chooseProjectBtn} px-4 py-2 `}
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target={`#detail${i}`}
                                onClick={(e) => {
                                  const btns = document.querySelectorAll(
                                    `.${styles.chooseProjectBtn}`
                                  );
                                  btns.forEach((btn) => {
                                    btn.classList.remove(`${styles.active}`);
                                    btn.innerHTML = "選擇";
                                  });
                                  if (
                                    !e.target.classList.contains(
                                      `${styles.active}`
                                    )
                                  ) {
                                    e.target.innerHTML = "取消選擇";
                                    e.target.classList.add(`${styles.active}`);
                                  }
                                  setCount(0);
                                }}
                              >
                                選擇
                              </button>
                            </div>
                          </div>
                          <div
                            className={`row py-5 ${styles.collapseSession} collapse`}
                            id={`detail${i}`}
                            data-bs-parent="#collapseControl"
                          >
                            <h6 className={`${styles.fs18px}`}>
                              選擇日期、選項
                            </h6>
                            <div className={`col`}>
                              <p>請選擇出發日期</p>
                              {/* TODO: react套件的日曆 */}
                              {/* <div className={`w-100 bg-secondary text-center my-2`}> */}
                              <Calendar
                                onChange={doSelectedDate}
                                minDate={
                                  new Date(v.earliest_date) > new Date()
                                    ? new Date(v.earliest_date)
                                    : new Date(tomorrow)
                                }
                                maxDate={new Date(v.date)}
                              />
                            </div>
                            <div
                              className={`col d-flex flex-column justify-content-between`}
                            >
                              <div>
                                <div className={`mb-3`}>
                                  <p className="">場次時間</p>
                                  {/* prettier-ignore */}
                                  <div className={`${styles.btns}`}>
                                                                    {v.time.split(",").map((time, i) => {
                                                                        return (
                                                                            <button
                                                                                type="button"
                                                                                key={i}
                                                                                className={`btn timeBTN ${styles.btn}`}
                                                                                onClick={(e) => {
                                                                                    const buttons =
                                                                                        document.querySelectorAll(`.timeBTN`);
                                                                                    buttons.forEach(
                                                                                        (button) => {
                                                                                            button.classList.remove(`${styles.active}`);
                                                                                        });
                                                                                    e.target.classList.add(`${styles.active}`);
                                                                                    setSelectedTime(time)
                                                                                }}>
                                                                                {time}
                                                                            </button>
                                                                        );
                                                                    }
                                                                    )}
                                                                </div>
                                </div>
                                {/* TODO: p2 規格先拔掉，有空再做 */}
                                {/* <div className={`mb-3`}>
                                                <p className="">規格</p>
                                                <div
                                                    className={`${styles.btns}`}>
                                                    <button
                                                        className={`btn ${styles.btn}`}>
                                                        浮潛（無優惠）
                                                    </button>
                                                    <button
                                                        className={`btn ${styles.btn}`}>
                                                        另一規格
                                                    </button>
                                                </div>
                                            </div> */}
                                {/* FIXME: p1 把選人數的做好 */}
                                <div>
                                  <p className="">選擇數量</p>
                                  <div
                                    className={`d-flex justify-content-between align-items-center`}
                                  >
                                    <p className={`m-0 fw-bold`}>人數</p>
                                    <div
                                      className={`d-flex align-items-center gap-2`}
                                    >
                                      <p
                                        className={`m-0 ${styles.fs14px} text-secondary`}
                                      >
                                        NT ${v.original_price}
                                        <span
                                          className={`fs-6 text-secondary fw-bold`}
                                        >
                                          NT$
                                          {v.price}
                                          /每人
                                        </span>
                                      </p>
                                      <div
                                        className={`d-flex align-items-center gap-3`}
                                      >
                                        <button
                                          type="button"
                                          className={`${styles.iconBtn} d-flex align-items-center justify-content-center`}
                                          onClick={() => {
                                            count > 0
                                              ? setCount(count - 1)
                                              : setCount(0);
                                          }}
                                        >
                                          <BsDashCircle />
                                        </button>
                                        <div>{count}</div>
                                        <button
                                          type="button"
                                          className={`${styles.iconBtn} d-flex align-items-center justify-content-center`}
                                          onClick={() => setCount(count + 1)}
                                        >
                                          <BsPlusCircle />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div
                                className={`d-flex justify-content-end align-items-end`}
                              >
                                <div className={`me-2`}>
                                  <div className={`text-secondary`}>
                                    總金額
                                    <span
                                      className={`ms-1 fs-4 text-black fw-bold`}
                                    >
                                      NT$
                                      {v.price * count}
                                    </span>
                                  </div>
                                  {/* <div
                                                                  className={`text-secondary d-flex justify-content-end`}>
                                                                  優惠點數
                                                                  <span
                                                                      className={`ms-1 ${styles.secondaryDeepColor} d-flex align-items-center gap-1`}>
                                                                      <TbCoinFilled />
                                                                      0
                                                                  </span>
                                                              </div> */}
                                </div>
                                <div className={`d-flex gap-1`}>
                                  <button
                                    className={`btn ${styles.btn} ${styles.btnPrimaryLight} ${styles.projectBtn}`}
                                  >
                                    加入購物車
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (user) {
                                        window.location = "/cart";
                                      }
                                    }}
                                    className={`btn ${styles.btn} ${styles.btnPrimaryColor} ${styles.projectBtn}`}
                                  >
                                    立即訂購
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </form>
                    );
                  })
                : "載入中"}
            </div>
            {/* <button
                            type="button"
                            onClick={(e) => {}}
                            className={`w-100 btn ${styles.btnWhite} d-flex gap-2 justify-content-center align-items-center`}>
                            查看更多方案
                            <BsChevronDown />
                        </button> */}
            <button
              className={`d-sm-none w-100 btn ${styles.btnPrimaryColor} mt-3`}
            >
              立即訂購
            </button>
          </div>
        </section>
        <section className={`py-5`}>
          <div className={`container`}>
            <div className={`row`}>
              <div className={`col-sm-8 col-12`}>
                <div className={`${styles.activityDescriptionBorder} pb-5`}>
                  <h4 className={`${styles.mb25px}`} id="description">
                    活動說明
                  </h4>
                  <p className="">
                    －活動介紹－
                    <br />
                    <br />
                  </p>
                  <ol className={`${styles.mb25px}`}>
                    {description && description.length > 0 ? (
                      description.map((text, index) => (
                        <li className={styles.li} key={index}>
                          {text}
                        </li>
                      ))
                    ) : (
                      <li className={styles.li}>資料載入中</li>
                    )}
                  </ol>
                  {/* TODO: p2 製作可以收起說明欄那些的按鈕 */}
                  {/* <div>
                                        <a href="#">收起</a>
                                    </div> */}
                </div>
                <div className={`${styles.activityDescriptionBorder} py-5`}>
                  <h4 className={`${styles.mb25px}`} id="journey">
                    行程介紹
                  </h4>
                  <p className={`d-flex align-items-center gap-2`}>
                    <FaRegClock />
                    行程時間：{duration}
                  </p>
                  <div className={`${styles.mb25px}`}>
                    {journey && journey.length > 0 ? (
                      journey.map((v, i) => <p key={i}>{v}</p>)
                    ) : (
                      <p>沒有內容</p>
                    )}
                  </div>
                  {/* <div>
                                        <a href="#">收起</a>
                                    </div> */}
                </div>
                {/* TODO: p2 製作集合地點 */}
                {/* <div
                                    className={`${styles.activityDescriptionBorder} py-5`}>
                                    <h4 className={`${styles.mb25px}`} id="meetingPoint">
                                        集合地點
                                    </h4>
                                    <div className={`card`}>
                                        <div
                                            className={`list-group ${styles.listGroup} list-group-flush`}>
                                            <div className={`list-group-item`}>
                                                <p
                                                    className={`fw-bold location-name`}>
                                                    地點名稱：DiveIn
                                                </p>
                                                <p>
                                                    地址：桃園市中壢區新生路二段421號
                                                </p>
                                            </div>
                                            <div
                                                className={`list-group-item text-center`}>
                                                <iframe
                                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3616.4412327243804!2d121.22171370000001!3d24.9851188!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x34682183e7b783c3%3A0xf0ebfba2069b6158!2z6IGW5b635Z-6552j5a246Zmi!5e0!3m2!1szh-TW!2stw!4v1738073971047!5m2!1szh-TW!2stw"
                                                    width={600}
                                                    height={450}
                                                    style={{
                                                        border: 0,
                                                        maxWidth: "100%",
                                                    }}
                                                    allowFullScreen
                                                    loading="lazy"
                                                    referrerPolicy="no-referrer-when-downgrade"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div> */}
                <div className={`${styles.activityDescriptionBorder} py-5`}>
                  <h4 className={`${styles.mb25px}`} id="comment">
                    旅客評價
                  </h4>
                  <div
                    className={`d-flex justify-content-between align-items-center`}
                  >
                    <div className={`d-flex align-items-center`}>
                      <div className={`${styles.square} me-2`}>5</div>
                      <div
                        className={`d-flex flex-column justify-content-between`}
                      >
                        <div
                          className={`${styles.star} fs-5 d-flex justify-content-between`}
                        >
                          <FaStar />
                          <FaStar />
                          <FaStar />
                          <FaStar />
                          <FaStar />
                        </div>
                        <p className={`m-0`}>999則旅客評價</p>
                      </div>
                    </div>
                    <select
                      className={`${styles.scoreSort} form-select`}
                      name="score-sort"
                      id=""
                      defaultValue="new"
                    >
                      <option value="new">最新</option>
                      <option value="highToLow">評分由高到低</option>
                      <option value="lowToHigh">評分由低到高</option>
                    </select>
                  </div>
                </div>
                <div
                  className={`d-flex ${styles.commentCard} gap-3 activity-score ${styles.activityDescriptionBorder} py-5`}
                >
                  <div className={`${styles.imgContainer} rounded-circle`}>
                    <img src="/image/images.jpg" alt="" />
                  </div>
                  <div className={`d-flex flex-column gap-2`}>
                    <h6 className={`m-0`}>Shu Hui</h6>
                    <div className={`${styles.star}`}>
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <span className={`${styles.text}`}>2021/10/23</span>
                    </div>
                    <div className={`${styles.commentText} `}>
                      <h6 className={`fw-bold`}>很開心</h6>
                      <p className={`m-0`}>
                        接待人員態度很親切，仔細解說、氣氛融洽、服務100分，浮潛裝備很齊全，裝口罩的防水罐很棒，有海龜在身邊共游，讓人回味無窮
                      </p>
                    </div>
                  </div>
                </div>
                <div
                  className={`d-flex ${styles.commentCard} gap-3 activity-score ${styles.activityDescriptionBorder} py-5`}
                >
                  <div className={`${styles.imgContainer} rounded-circle`}>
                    <img src="/image/images.jpg" alt="" />
                  </div>
                  <div className={`d-flex flex-column gap-2`}>
                    <h6 className={`m-0`}>Shu Hui</h6>
                    <div className={`${styles.star}`}>
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <span className={`${styles.text}`}>2021/10/23</span>
                    </div>
                    <div className={`${styles.commentText} `}>
                      <h6 className={`fw-bold`}>很開心</h6>
                      <p className={`m-0`}>
                        接待人員態度很親切，仔細解說、氣氛融洽、服務100分，浮潛裝備很齊全，裝口罩的防水罐很棒，有海龜在身邊共游，讓人回味無窮
                      </p>
                    </div>
                  </div>
                </div>
                <div
                  className={`d-flex ${styles.commentCard} gap-3 activity-score ${styles.activityDescriptionBorder} py-5`}
                >
                  <div className={`${styles.imgContainer} rounded-circle`}>
                    <img src="/image/images.jpg" alt="" />
                  </div>
                  <div className={`d-flex flex-column gap-2`}>
                    <h6 className={`m-0`}>Shu Hui</h6>
                    <div className={`${styles.star}`}>
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <span className={`${styles.text}`}>2021/10/23</span>
                    </div>
                    <div className={`${styles.commentText} `}>
                      <h6 className={`fw-bold`}>很開心</h6>
                      <p className={`m-0`}>
                        接待人員態度很親切，仔細解說、氣氛融洽、服務100分，浮潛裝備很齊全，裝口罩的防水罐很棒，有海龜在身邊共游，讓人回味無窮
                      </p>
                    </div>
                  </div>
                </div>
                <div
                  className={`d-flex ${styles.commentCard} gap-3 activity-score ${styles.activityDescriptionBorder} py-5`}
                >
                  <div className={`${styles.imgContainer} rounded-circle`}>
                    <img src="/image/images.jpg" alt="" />
                  </div>
                  <div className={`d-flex flex-column gap-2`}>
                    <h6 className={`m-0`}>Shu Hui</h6>
                    <div className={`${styles.star}`}>
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <span className={`${styles.text}`}>2021/10/23</span>
                    </div>
                    <div className={`${styles.commentText} `}>
                      <h6 className={`fw-bold`}>很開心</h6>
                      <p className={`m-0`}>
                        接待人員態度很親切，仔細解說、氣氛融洽、服務100分，浮潛裝備很齊全，裝口罩的防水罐很棒，有海龜在身邊共游，讓人回味無窮
                      </p>
                    </div>
                  </div>
                </div>
                <div
                  className={`d-flex ${styles.commentCard} gap-3 activity-score ${styles.activityDescriptionBorder} py-5`}
                >
                  <div className={`${styles.imgContainer} rounded-circle`}>
                    <img src="/image/images.jpg" alt="" />
                  </div>
                  <div className={`d-flex flex-column gap-2`}>
                    <h6 className={`m-0`}>Shu Hui</h6>
                    <div className={`${styles.star}`}>
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <span className={`${styles.text}`}>2021/10/23</span>
                    </div>
                    <div className={`${styles.commentText} `}>
                      <h6 className={`fw-bold`}>很開心</h6>
                      <p className={`m-0`}>
                        接待人員態度很親切，仔細解說、氣氛融洽、服務100分，浮潛裝備很齊全，裝口罩的防水罐很棒，有海龜在身邊共游，讓人回味無窮
                      </p>
                    </div>
                  </div>
                </div>
                {/* 分頁頁碼 */}
                <div className={`d-flex justify-content-center pt-5`}>
                  <ul className={`pagination`}>
                    <li className={`page-item`}>
                      <a
                        className={`page-link text-reset`}
                        href="#"
                        aria-label="Previous"
                      >
                        <span aria-hidden="true">&lt;</span>
                      </a>
                    </li>
                    <li className={`page-item`}>
                      <a className={`page-link text-reset`} href="#">
                        1
                      </a>
                    </li>
                    <li className={`page-item`}>
                      <a className={`page-link text-reset active`} href="#">
                        2
                      </a>
                    </li>
                    <li className={`page-item`}>
                      <a className={`page-link text-reset`} href="#">
                        3
                      </a>
                    </li>
                    <li className={`page-item`}>
                      <a
                        className={`page-link text-reset`}
                        href="#"
                        aria-label="Next"
                      >
                        <span aria-hidden="true">&gt;</span>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className={`col-sm-4 d-none d-sm-block`}>
                <ul className={`${styles.descriptionNav} px-5 list-unstyled`}>
                  <li
                    className={`${styles.li} ${styles.active}`}
                    onClick={(e) => {
                      const lis = document.querySelectorAll(`.${styles.li}`);
                      lis.forEach((v) => {
                        v.classList.remove(`${styles.active}`);
                      });
                      e.currentTarget.classList.add(`${styles.active}`);
                    }}
                  >
                    <a
                      href="#description"
                      className="text-reset text-decoration-none"
                    >
                      活動說明
                    </a>
                  </li>
                  <li
                    className={`${styles.li}`}
                    onClick={(e) => {
                      const lis = document.querySelectorAll(`.${styles.li}`);
                      lis.forEach((v) => {
                        v.classList.remove(`${styles.active}`);
                      });
                      e.currentTarget.classList.add(`${styles.active}`);
                    }}
                  >
                    <a
                      href="#journey"
                      className="text-reset text-decoration-none"
                    >
                      行程介紹
                    </a>
                  </li>
                  {/* <li className={`${styles.li}`}
                                        onClick={(e) => {
                                            const lis = document.querySelectorAll(`.${styles.li}`)
                                            lis.forEach((v) => {
                                                v.classList.remove(`${styles.active}`)
                                            })
                                            e.currentTarget.classList.add(`${styles.active}`)
                                        }}>
                                        <a href="#meetingPoint" className="text-reset text-decoration-none">集合地點</a></li> */}
                  <li
                    className={`${styles.li}`}
                    onClick={(e) => {
                      const lis = document.querySelectorAll(`.${styles.li}`);
                      lis.forEach((v) => {
                        v.classList.remove(`${styles.active}`);
                      });
                      e.currentTarget.classList.add(`${styles.active}`);
                    }}
                  >
                    <a
                      href="#comment"
                      className="text-reset text-decoration-none"
                    >
                      旅客評價
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        <section className={`py-5 ${styles.bgGray}`}>
          <div className={`container`}>
            <h5 className={`${styles.h5}`}>更多推薦行程</h5>
            <div className={`d-flex justify-content-between`}>
              {/* TODO: 撈取推薦行程陣列塞入 */}
              {/* {activities.map((v, i) => {
                                return <RecommendCard key={i} activity={v} />;
                            })} */}
              {recommendActivity && recommendActivity.length > 0
                ? recommendActivity.map((v, i) => {
                    return <RecommendCard key={i} activity={v} />;
                  })
                : "沒有推薦活動"}

              <div
                className={`d-flex justify-content-center align-items-center`}
              >
                <button
                  className={`rounded-circle btn bg-white ${styles.circleButton} d-flex justify-content-center align-items-center`}
                >
                  <BsChevronRight />
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
