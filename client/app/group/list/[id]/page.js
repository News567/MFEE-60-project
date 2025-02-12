"use client";
import "./styles.css";
import CountDownCard from "./_component/CountDownCard";
import { useState } from "react";

export default function GroupDetailPage() {
    const [count, setCount] = useState(0);
    return (
        <main className="main container d-flex groupDetailPage">
            <aside className="d-none d-md-block">篩選列</aside>
            <div className="row">
                <div className="col-sm-8 col-12 d-flex flex-column middle-section">
                    <div className="img-container">
                        <img className="img" src="/image/group.jpg" alt="" />
                    </div>
                    <h4 className="text-center fs-26px fw-bold m-0">
                        墾丁浮潛揪團
                    </h4>
                    <div className="d-flex justify-content-between align-items-center state-section">
                        <div className="group-state">揪團中</div>
                        <div>
                            <i className="bi bi-geo-alt-fill color-primary icon-bigger" />{" "}
                            台灣 墾丁
                        </div>
                        <div>
                            <i className="bi bi-person color-primary icon-bigger" />{" "}
                            不限性別
                        </div>
                    </div>
                    <div className="group-info">
                        {/* FIXME:浮潛面鏡icon */}
                        <div className="text-center fw-bold fs-20px">
                            面鏡的icon 浮潛
                        </div>
                        <div className="d-flex justify-content-around">
                            <div className="fs-20px">
                                <i className="bi bi-calendar" /> 2025-01-31
                            </div>
                            <div className="fs-20px">
                                <i className="bi bi-clock" /> 10:30
                            </div>
                        </div>
                    </div>
                    <div className="group-detail text-center d-flex flex-column middle-section">
                        <div className="fs-20px">揪團主：小花</div>
                        <div className="fs-20px">揪團上架：2025-01-01</div>
                        <div className="fs-20px">揪團截止：2025-01-31</div>
                        <div className="d-none d-sm-flex justify-content-center time-cards">
                            <CountDownCard date={Date.now() + 1000000000} />
                        </div>
                        <hr className="hr" />
                        <div className="fs-20px fw-bold d-flex align-items-center justify-content-center gap-2">
                            <div>
                                <i className="bi bi-person-check-fill color-primary fs-26px" />
                            </div>
                            已揪 0 ／ 剩餘 3
                        </div>
                        <div className="fw-bold fs-18px">人數</div>
                        {/* FIXME: 使用react做增減標籤 */}
                        <div
                            className="input-group count-group">
                            <button
                                className="btn"
                                type="button"
                                id="button-addon1"
                                onClick={()=>setCount(count-1)}>
                                -
                            </button>
                            <input
                                type="text"
                                className="form-control text-center"
                                value={count}
                                readOnly
                                aria-label="Number input"
                            />
                            <button
                                className="btn"
                                type="button"
                                id="button-addon2"
                                onClick={()=>setCount(count+1)}>
                                +
                            </button>
                        </div>

                        <div className="text-center">
                            <button className="btn join-btn fs-20px">
                                加入跟團
                            </button>
                        </div>
                    </div>
                </div>
                <div className="col-sm-4 col-12 p-sm-0">
                    <div className="group-description">
                        <div className="fs-20px fw-bold title">揪團資訊</div>
                        <p className="m-0">
                            嗨，我是小花，一個超愛潛水但這次缺旅伴的海洋迷！計劃這個月底去墾丁潛水，一起享受陽光、海風，還有那片五彩繽紛的海底世界～
                            行程簡單介紹：
                            <br />
                            ．日期： 1/31，成團後也可以再商量！
                            <br />
                            ．地點： 墾丁熱門潛點（像是砂島、龍磐）
                            <br />
                            ．人數： 需要 4 人才能湊團，目前只有我自己（哈哈！）
                            <br />
                            期待的旅伴：
                            <br />
                            ．新手或有經驗都沒問題！只要熱愛大海，想探索海底就好～
                            <br />
                            ．性格隨和，喜歡交朋友，行程不會太趕，輕鬆玩！
                            <br />
                            我的想法：
                            <br />
                            ．可一起找教練（安全為主！）或自備裝備去輕裝潛。
                            <br />
                            ．行程中還可以順便去墾丁大街吃美食、看日落拍照！
                            <br />
                            ．預算大概每人 NT$ 2,500 左右（包含潛水費用）。
                            <br />
                            ．如果你也有興趣，歡迎加入！
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
