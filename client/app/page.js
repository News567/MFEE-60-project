"use client";
import Image from "next/image";
import styles from "./page.module.css";
import {
  FaAngleLeft,
  FaAngleRight,
  FaRegHeart,
  FaStar,
  FaRegStar,
  FaCircle,
} from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import Link from "next/link";
import { useState } from "react";
import Carousel from "./components/Swiper/Carousel";


export default function Home() {
  // 設定串接資料
  const [activity,setActivity] = useState([])
  const [product,setProduct] = useState([])
  const [article,setArticle] = useState([])
  return (
    <>
      <main>
        {/* KV */}
        <Carousel/>
        {/* <div className={`${styles.kv}`}>
          <div
            className={`w-100 d-flex justify-content-between align-items-center`}
          >
            <button className={`${styles.circleButton} d-none d-sm-flex`}>
              <FaAngleLeft />
            </button>
            <div className="text-center w-100">
              <div
                className={`text-center d-flex flex-column ${styles.kvText}`}
              >
                <h1 className={styles.h1}>探索無重力的寧靜與神秘</h1>
                <p className={`${styles.p} d-none d-sm-block`}>
                  "It's not just diving; it's a new way of life."
                </p>
              </div>
              <Link href="/products">
                <button className={styles.scondaryBtn}>馬上逛逛</button>
              </Link>
            </div>

            <button className={`${styles.circleButton} d-none d-sm-flex`}>
              <FaAngleRight />
            </button>
          </div>
        </div> */}

        {/* section start */}
        <div className={`container ${styles.sectionStart}`}>
          <div
            className={`${styles.kvStart} d-flex justify-content-center align-items-center`}
          >
            <img
              className={styles.sectionStartBg}
              src="/image/kv-start-decoration.png"
            />
            <div className={styles.kvStartText}>
              <h3 className={`text-center ${styles.h3}`}>
                你的潛水旅程，從這裡開始！
              </h3>
              <form action="" method="get" className={styles.chooses}>
                <select
                  className={`${styles.select}`}
                  name=""
                  id=""
                  defaultValue="default"
                >
                  <option value="default" disabled>
                    潛水地點
                  </option>
                  <option value="">台灣</option>
                  <option value="">日本</option>
                  <option value="">菲律賓</option>
                  <option value="">其他</option>
                </select>
                <select
                  className={styles.select}
                  name=""
                  id=""
                  defaultValue="default"
                >
                  <option value="default" disabled>
                    潛水類型
                  </option>
                  <option value="">自由潛水</option>
                  <option value="">水肺潛水</option>
                  <option value="">浮潛</option>
                  <option value="">其他</option>
                </select>
                <select
                  className={`${styles.select} d-sm-none d-block`}
                  name=""
                  id=""
                  defaultValue="default"
                >
                  <option value="default" disabled>
                    潛水月份
                  </option>
                  <option value="">一月</option>
                  <option value="">二月</option>
                  <option value="">三月</option>
                  <option value="">四月</option>
                  <option value="">五月</option>
                  <option value="">六月</option>
                  <option value="">七月</option>
                  <option value="">八月</option>
                  <option value="">九月</option>
                  <option value="">十月</option>
                  <option value="">十一月</option>
                  <option value="">十二月</option>
                </select>
                <button className={`d-none d-sm-block ${styles.scondaryBtn}`}>
                  開始搜尋
                </button>
                <button className={`d-none d-sm-block ${styles.scondaryBtn}`}>
                  清除條件
                </button>
                <div
                  className={`d-flex d-sm-none justify-content-between w-100 ${styles.btns}`}
                >
                  <button className={styles.scondaryBtn}>開始搜尋</button>
                  <button className={styles.scondaryBtn}>清除條件</button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* section activity */}
        <div
          className={`container ${styles.sectionActivity} ${styles.section}`}
        >
          <h3 className={styles.h3}>必試潛水冒險，精彩不容錯過</h3>
          <div>
            <div className={`d-flex justify-content-center ${styles.btns}`}>
              <button className={`${styles.chooseBtn} ${styles.active}`}>
                所有活動
              </button>
              <button className={`${styles.chooseBtn}`}>初學者體驗</button>
              <button className={`${styles.chooseBtn}`}>開放水域潛水</button>
              <button className={`${styles.chooseBtn}`}>
                進階深潛或技術潛水
              </button>
            </div>
            <div className={`d-flex justify-content-sm-between justify-content-around w-100 ${styles.cards}`}>
              <div className={styles.card}>
                <div className={styles.imgContainer}>
                  <div className={styles.circleIcons}>
                    <button className={styles.circleIcon}>
                      <FaRegHeart />
                    </button>
                    <button className={styles.circleIcon}>
                      <FiShoppingCart />
                    </button>
                  </div>
                  <div className={styles.stars}>
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaRegStar />
                  </div>
                  <img
                    className={styles.img}
                    src="/image/jpg (5).webp"
                    alt=""
                  />
                </div>
                <div className={`text-center ${styles.title}`}>
                  <p className={`m-0`}>體驗潛水</p>
                  <h6 className={`m-0`}>NT $2500</h6>
                </div>
              </div>
              <div className={styles.card}>
                <div className={styles.imgContainer}>
                  <div className={styles.circleIcons}>
                    <button className={styles.circleIcon}>
                      <FaRegHeart />
                    </button>
                    <button className={styles.circleIcon}>
                      <FiShoppingCart />
                    </button>
                  </div>
                  <div className={styles.stars}>
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaRegStar />
                  </div>
                  <img
                    className={styles.img}
                    src="/image/jpg (5).webp"
                    alt=""
                  />
                </div>
                <div className={`text-center ${styles.title}`}>
                  <p className={`m-0`}>體驗潛水</p>
                  <h6 className={`m-0`}>NT $2500</h6>
                </div>
              </div>
              <div className={`${styles.card} d-none d-sm-flex`}>
                <div className={styles.imgContainer}>
                  <div className={styles.circleIcons}>
                    <button className={styles.circleIcon}>
                      <FaRegHeart />
                    </button>
                    <button className={styles.circleIcon}>
                      <FiShoppingCart />
                    </button>
                  </div>
                  <div className={styles.stars}>
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaRegStar />
                  </div>
                  <img
                    className={styles.img}
                    src="/image/jpg (5).webp"
                    alt=""
                  />
                </div>
                <div className={`text-center ${styles.title}`}>
                  <p className={`m-0`}>體驗潛水</p>
                  <h6 className={`m-0`}>NT $2500</h6>
                </div>
              </div>
              <div className={`${styles.card} d-none d-sm-flex`}>
                <div className={styles.imgContainer}>
                  <div className={styles.circleIcons}>
                    <button className={styles.circleIcon}>
                      <FaRegHeart />
                    </button>
                    <button className={styles.circleIcon}>
                      <FiShoppingCart />
                    </button>
                  </div>
                  <div className={styles.stars}>
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaRegStar />
                  </div>
                  <img
                    className={styles.img}
                    src="/image/jpg (5).webp"
                    alt=""
                  />
                </div>
                <div className={`text-center ${styles.title}`}>
                  <p className={`m-0`}>體驗潛水</p>
                  <h6
                    className={`m-0 text-secondary text-decoration-line-through`}
                  >
                    NT $2500
                  </h6>
                  <h6 className={`m-0`}>NT $2500</h6>
                </div>
              </div>
            </div>
            <div
              className={`d-sm-none d-flex justify-content-center ${styles.nextBtns}`}
            >
              <button className={styles.btn}>
                <FaAngleLeft />
              </button>
              <button className={styles.btn}>
                <FaAngleRight />
              </button>
            </div>
            <div className="text-center">
              <button className={styles.scondaryBtn}>查看更多</button>
            </div>
          </div>
        </div>

        {/* section chooseUs */}
        <div
          className={`d-sm-flex d-none container ${styles.sectionchooseUs} ${styles.section}`}
        >
          <h3 className={styles.h3}>專業、品質、透明，安心選擇DiveIn</h3>
          <div className="d-flex">
            <div className={styles.imgContainer}>
              <img src="/image/leftside-img.png" alt="" />
            </div>
            <div className={`d-flex flex-column ${styles.rightSideInfo}`}>
              <div className={`d-flex flex-column`}>
                <h4>一站式潛水體驗</h4>
                <p>我們將提供......</p>
              </div>
              <div>
                <div className={`d-flex justify-content-between`}>
                  <div className={`d-flex align-items-center ${styles.card}`}>
                    <div className={styles.circleIcon}>
                      <img
                        className={styles.img}
                        src="/image/Rectangle 5.png"
                        alt=""
                      />
                    </div>
                    <div className={styles.cardText}>
                      <p className={`${styles.p} ${styles.p1}`}>精彩活動</p>
                      <p className={`${styles.p} ${styles.p2}`}>
                      發現海底的無限魅力，開啟你的潛水冒險
                      </p>
                      <Link href="/activity" className={`${styles.p} ${styles.p3}`}>
                        我們提供豐富多元的潛水活動
                      </Link>
                    </div>
                  </div>
                  <div className={`d-flex align-items-center ${styles.card}`}>
                    <div className={styles.circleIcon}>
                      <img
                        className={styles.img}
                        src="/image/Rectangle 11.png"
                        alt=""
                      />
                    </div>
                    <div className={styles.cardText}>
                      <p className={`${styles.p} ${styles.p1}`}>精選裝備</p>
                      <p className={`${styles.p} ${styles.p2}`}>
                        嚴選品質，確保每件商品經過嚴格檢驗
                      </p>
                      <Link href="/products" className={`${styles.p} ${styles.p3}`}>
                        現在就去逛逛！
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className={`d-flex justify-content-between`}>
                  <div className={`d-flex align-items-center ${styles.card}`}>
                    <div className={styles.circleIcon}>
                      <img
                        className={styles.img}
                        src="/image/Rectangle 10.png"
                        alt=""
                      />
                    </div>
                    <div className={styles.cardText}>
                      <p className={`${styles.p} ${styles.p1}`}>
                        輕鬆靈活，租借無憂
                      </p>
                      <p className={`${styles.p} ${styles.p2}`}>
                        不想購買？租借無憂，輕鬆享受潛水樂趣
                      </p>
                      <Link href="/rent" className={`${styles.p} ${styles.p3}`}>
                        我們提供設備租借服務，減少旅遊負擔
                      </Link>
                    </div>
                  </div>
                  <div className={`d-flex align-items-center ${styles.card}`}>
                    <div className={styles.circleIcon}>
                      <img
                        className={styles.img}
                        src="/image/Rectangle 9.png"
                        alt=""
                      />
                    </div>
                    <div className={styles.cardText}>
                      <p className={`${styles.p} ${styles.p1}`}>公開透明評論</p>
                      <p className={`${styles.p} ${styles.p2}`}>
                        提供討論區讓學員交流心得，幫助您安心選擇課程與裝備
                      </p>
                      <Link href="/article" className={`${styles.p} ${styles.p3}`}>
                        看看大家都在討論什麼
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* section course */}
        <div className={`container ${styles.section} ${styles.sectionCourse}`}>
          <h3 className={styles.h3}>零基礎學習，輕鬆進入深藍</h3>
          <div className={styles.cardsAndDots}>
            <div className={`d-flex justify-content-sm-between justify-content-around`}>
              <div className={`${styles.card}`}>
                <div className={styles.imgContainer}>
                  <img
                    className={styles.img}
                    src="/image/jpg (10).webp"
                    alt=""
                  />
                </div>
                <div className={styles.title}>
                  初階開放水域潛水認證課程(AO)-DIWA
                </div>
                <a href="#" className={styles.more}>
                  更多資訊
                </a>
              </div>
              <div className={`${styles.card}`}>
                <div className={styles.imgContainer}>
                  <img
                    className={styles.img}
                    src="/image/jpg (10).webp"
                    alt=""
                  />
                </div>
                <div className={styles.title}>
                  初階開放水域潛水認證課程(AO)-DIWA
                </div>
                <a href="#" className={styles.more}>
                  更多資訊
                </a>
              </div>
              <div className={`d-none d-sm-flex ${styles.card}`}>
                <div className={styles.imgContainer}>
                  <img
                    className={styles.img}
                    src="/image/jpg (10).webp"
                    alt=""
                  />
                </div>
                <div className={styles.title}>
                  初階開放水域潛水認證課程(AO)-DIWA
                </div>
                <a href="#" className={styles.more}>
                  更多資訊
                </a>
              </div>
              <div className={`d-none d-sm-flex ${styles.card}`}>
                <div className={styles.imgContainer}>
                  <img
                    className={styles.img}
                    src="/image/jpg (10).webp"
                    alt=""
                  />
                </div>
                <div className={styles.title}>
                  初階開放水域潛水認證課程(AO)-DIWA
                </div>
                <a href="#" className={styles.more}>
                  更多資訊
                </a>
              </div>
            </div>
            <div className={styles.dots}>
              <button className={`${styles.dot} ${styles.active}`}></button>
              <button className={`${styles.dot}`}></button>
            </div>
          </div>
        </div>

        {/* section teacher 應該不用了？ */}
        {/* <div className={`contianer ${styles.section} ${styles.sectionTeacher}`}>
                    <h3 className={styles.h3}>精選潛水行程，發現你的下一站</h3>
                    <div className={`${styles.cardsAndDots}`}>
                        <div className={styles.cards}>
                            <div className={`${styles.card} ${styles.active}`}>
                                <div></div>
                            </div>
                        </div>
                    </div>
                </div> */}

        {/* section product */}
        <div className={`container ${styles.section} ${styles.sectionProduct}`}>
          <h3 className={styles.h3}>精選必備潛水好物，為你打造極致潛水體驗</h3>
          <div className={`${styles.cardsAndBtn}`}>
            <div className="">
              <div className={`d-flex justify-content-center ${styles.cards}`}>
                <div className={`${styles.card}`}>
                  <div className={styles.imgContainer}>
                    <div className={styles.circleIcons}>
                      <button className={styles.circleIcon}>
                        <FaRegHeart />
                      </button>
                      <button className={styles.circleIcon}>
                        <FiShoppingCart />
                      </button>
                    </div>
                    <div className={styles.stars}>
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaRegStar />
                    </div>
                    <img
                      className={styles.img}
                      src="/image/800x (1).webp"
                      alt=""
                    />
                  </div>
                  <div className={styles.right}>
                    <div className={styles.cardText}>
                      <p className={`m-0 ${styles.brand}`}>AQUA LUNG</p>
                      <p className={`m-0 ${styles.name}`}>
                        SPHERA X 低容積面鏡
                      </p>
                      <h6 className={`m-0 ${styles.price}`}>NT $2650</h6>
                      <div className={styles.circles}>
                        <button className={styles.circleContainer}>
                          <FaCircle className={styles.circle} />
                        </button>
                        <button className={styles.circleContainer}>
                          <FaCircle className={styles.circle2} />
                        </button>
                        <button className={styles.circleContainer}>
                          <FaCircle className={styles.circle3} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={`${styles.card} d-sm-flex d-none`}>
                  <div className={styles.imgContainer}>
                    <div className={styles.circleIcons}>
                      <button className={styles.circleIcon}>
                        <FaRegHeart />
                      </button>
                      <button className={styles.circleIcon}>
                        <FiShoppingCart />
                      </button>
                    </div>
                    <div className={styles.stars}>
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaRegStar />
                    </div>
                    <img
                      className={styles.img}
                      src="/image/800x (2).webp"
                      alt=""
                    />
                  </div>
                  <div className={styles.right}>
                    <div className={styles.cardText}>
                      <p className={`m-0 ${styles.brand}`}>APOLLO</p>
                      <p className={`m-0 ${styles.name}`}>
                        APOLLO - BIO METAL 多彩鋁合金鏡框(平民海龍王)
                      </p>
                      <h6 className={`m-0 ${styles.price}`}>NT $7800</h6>
                      <div className={styles.circles}>
                        <button className={styles.circleContainer}>
                          <FaCircle className={styles.circle} />
                        </button>
                        <button className={styles.circleContainer}>
                          <FaCircle className={styles.circle2} />
                        </button>
                        <button className={styles.circleContainer}>
                          <FaCircle className={styles.circle4} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className={`d-sm-flex d-none justify-content-center ${styles.cards}`}
              >
                <div className={styles.card}>
                  <div className={styles.imgContainer}>
                    <div className={styles.circleIcons}>
                      <button className={styles.circleIcon}>
                        <FaRegHeart />
                      </button>
                      <button className={styles.circleIcon}>
                        <FiShoppingCart />
                      </button>
                    </div>
                    <div className={styles.stars}>
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaRegStar />
                    </div>
                    <img className={styles.img} src="/image/800x.webp" alt="" />
                  </div>
                  <div className={styles.right}>
                    <div className={styles.cardText}>
                      <p className={`m-0 ${styles.brand}`}>AQUA LUNG</p>
                      <p className={`m-0 ${styles.name}`}>
                        SPHERA X 低容積面鏡
                      </p>
                      <h6 className={`m-0 ${styles.price}`}>NT $2650</h6>
                      <div className={styles.circles}>
                        <button className={styles.circleContainer}>
                          <FaCircle className={styles.circle} />
                        </button>
                        <button className={styles.circleContainer}>
                          <FaCircle className={styles.circle2} />
                        </button>
                        <button className={styles.circleContainer}>
                          <FaCircle className={styles.circle3} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles.card}>
                  <div className={styles.imgContainer}>
                    <div className={styles.circleIcons}>
                      <button className={styles.circleIcon}>
                        <FaRegHeart />
                      </button>
                      <button className={styles.circleIcon}>
                        <FiShoppingCart />
                      </button>
                    </div>
                    <div className={styles.stars}>
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaRegStar />
                    </div>
                    <img className={styles.img} src="/image/800x.webp" alt="" />
                  </div>
                  <div className={styles.right}>
                    <div className={styles.cardText}>
                      <p className={`m-0 ${styles.brand}`}>AQUA LUNG</p>
                      <p className={`m-0 ${styles.name}`}>
                        SPHERA X 低容積面鏡
                      </p>
                      <h6 className={`m-0 ${styles.price}`}>NT $2650</h6>
                      <div className={styles.circles}>
                        <button className={styles.circleContainer}>
                          <FaCircle className={styles.circle} />
                        </button>
                        <button className={styles.circleContainer}>
                          <FaCircle className={styles.circle2} />
                        </button>
                        <button className={styles.circleContainer}>
                          <FaCircle className={styles.circle3} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-center">
              <button className={styles.scondaryBtn}>查看全部</button>
            </div>
          </div>
        </div>

        {/* section article*/}
        <div className={`container ${styles.section} ${styles.sectionArticle}`}>
          <h3 className={styles.h3}>潛水新知報報，深海探險的必讀文章</h3>
          <div className={styles.cardsAndBtns}>
            <div
              className={`d-flex justify-content-sm-between justify-content-center ${styles.cards}`}
            >
              <a href="" className={`${styles.card}`}>
                <div className={styles.imgContainer}>
                  <img
                    className={styles.img}
                    src="/image/pc-img00.jpg"
                    alt=""
                  />
                </div>
                <div className={styles.cardText}>
                  <p className={styles.title}>台灣浮潛體驗</p>
                  <p className={styles.content}>
                    浮潛很適合第一次接觸潛水的人，對新手來說非常友善。浮潛時是以身體面朝下的方式漂浮在水面上，同時嘴巴含住呼吸管呼吸。因為只有漂浮在水面上而已，一有不適，抬起頭來就回到海平面上方，危險性相對較低。不確定自己喜不喜歡或適不適合潛水的人，第一次可以先透過體驗「浮潛」的方式接觸看看。而目前台灣浮潛大多以觀光性質居多，所以台灣許多以水上水下活動聞名的海域，都有相關體驗行程
                  </p>
                </div>
                <div className={styles.date}>28 NOV 2024</div>
              </a>
              <a href="" className={`${styles.card} d-sm-flex d-none`}>
                <div className={styles.imgContainer}>
                  <img
                    className={styles.img}
                    src="/image/pc-img00.jpg"
                    alt=""
                  />
                </div>
                <div className={styles.cardText}>
                  <p className={styles.title}>台灣水肺潛水</p>
                  <p className={styles.content}>
                    平常旅遊觀光時，如果聽到「深潛」，通常指的就是「水肺潛水」。水肺潛水就不只是浮在水面上了，而是會真的潛入水中，至於換氣的方式主要是利用「壓縮氣瓶」。潛者在下水時就會揹著氣瓶下水，並用呼吸調節器從氣瓶中呼吸。深潛跟浮潛一樣，目前也有很多觀光業者在提供「體驗潛水」的項目，所以在許多觀光海域也能夠輕鬆體驗
                  </p>
                </div>
                <div className={styles.date}>28 NOV 2024</div>
              </a>
              <a href="" className={`${styles.card} d-sm-flex d-none`}>
                <div className={styles.imgContainer}>
                  <img
                    className={styles.img}
                    src="/image/pc-img00.jpg"
                    alt=""
                  />
                </div>
                <div className={styles.cardText}>
                  <p className={styles.title}>台灣自由潛水 </p>
                  <p className={styles.content}>
                    自由潛水相較上面兩者，難度就加倍升級了呢～如同它名字所寫的「自由」，自由潛水是不會攜帶氣瓶這類設備下水，而只靠著單次的呼吸憋氣（屏息）完成每一次的潛水過程。另外，「深潛」其實不是水肺潛水的專屬，自潛一樣可以潛得很深。不過因為自潛相對危險，在開始學自潛時，一定會聽到教練耳提面命地說：「自由潛水絕對不要獨自進行喔！」。
                  </p>
                </div>
                <div className={styles.date}>28 NOV 2024</div>
              </a>
            </div>
            <div className={`d-flex justify-content-center ${styles.btns}`}>
              <button className={styles.circleButton}>
                <FaAngleLeft />
              </button>
              <button className={styles.circleButton}>
                <FaAngleRight />
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
