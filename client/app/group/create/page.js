"use client";
import "./styles.css";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import useToast from "@/hooks/useToast";

export default function GroupDetailPage() {
    const api = "http://localhost:3005/api"
    // 設定吐司
    const { showToast } = useToast()

    const { user } = useAuth();
    useEffect(() => {
        // 判斷是否有登入，沒登入就自動跳轉至登入頁
        if (!user) {
            showToast("請先登入！", { autoClose: 2000 })
            setTimeout(() => {
                window.location = "/member/login"
            }, 2000)
        }
    }, [])

    const [userId, setUserId] = useState(user ? user.id : 0)
    console.log(user);
    // useEffect(() => {
    //     if (!user) {
    //         alert("請先登入！")
    //         window.location.href = "/member/login"
    //         return
    //     }
    // },[])
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


    const doUpload = async (e) => {
        try {
            e.preventDefault();
            const formData = new FormData(e.target)
            // formData.forEach((value, key) => {
            //     console.log(`${key}: ${value}`);
            // });
            const res = await axios.post(api + "/group/create", formData)
            if (res.data.status == "success") {
                alert("成功創立揪團");
                window.location = `/group/list/${res.data.groupId}`
            } else {
                alert(res.data.message || "創建失敗");
            }
        } catch (error) {
            console.log(error);
        }
    }



    return (
        <main className="container d-flex">
            <aside className="d-none d-md-block">篩選列</aside>
            <form onSubmit={doUpload} className="group-create d-flex flex-column w-100">
                <input type="hidden" name="userId" id="" value={userId} />
                <h2 className="m-0">新增揪團</h2>
                <div className="row">
                    <div className="col-12 col-sm-6 d-flex flex-column gap-3 row-first">
                        <div className="fs-22px">
                            上傳首圖 <span className="color-secondary">*</span>
                        </div>
                        <div className="img-container">
                            <img src="#" alt="" />
                        </div>
                        <input type="file" name="file" required />
                        <div className="text-secondary">檔案上傳限制：3MB</div>
                    </div>
                    {/* <div className="col-12 col-sm-6 d-flex flex-column gap-3">
                        <div className="fs-22px">上傳其他圖片</div>
                        <div className="img-container">
                            <img src="#" alt="" />
                        </div>
                        <input type="file" />
                        <div className="text-secondary">檔案上傳限制：3MB</div>
                    </div> */}
                </div>
                <div>
                    <div className="fs-22px mb-15px">
                        揪團標題 <span className="color-secondary">*</span>
                    </div>
                    <input className="form-control" type="text" name="title" id="" required />
                </div>
                <div>
                    <div className="fs-22px mb-15px">
                        揪團性別 <span className="color-secondary">*</span>
                    </div>
                    <select className="form-select" name="gender" id="" defaultValue="default" required>
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
                        揪團人數 <span className="color-secondary">*</span>
                    </div>
                    <input className="form-control" type="number" name="maxNumber" id="" required />
                </div>
                <div>
                    <div className="fs-22px mb-15px">
                        揪團分類 <span className="color-secondary">*</span>
                    </div>
                    <select className="form-select" name="type" id="" defaultValue="default" required>
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
                        證照資格 <span className="color-secondary">*</span>
                    </div>
                    <select className="form-select" name="certificates" id="" defaultValue="default" required>
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
                        揪團地點 <span className="color-secondary">*</span>
                    </div>
                    <select name="country" className="form-select mb-15px" id="" defaultValue="default" onChange={doCountrySelect} required>
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
                            活動日期 <span className="color-secondary">*</span>
                        </div>
                        <input className="form-control" type="date" name="date" />
                    </div>
                    <div className="col-12 col-sm-6 d-flex flex-column gap-3">
                        <div className="fs-22px">
                            活動時間 <span className="color-secondary">*</span>
                        </div>
                        <input className="form-control" type="time" name="time" />
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 col-sm-6 d-flex flex-column gap-3 row-first">
                        <div className="fs-22px">
                            揪團截止日期 <span className="color-secondary">*</span>
                        </div>
                        <input className="form-control" type="date" name="signEndDate" />
                    </div>
                    <div className="col-12 col-sm-6 d-flex flex-column gap-3">
                        <div className="fs-22px">
                            揪團截止時間 <span className="color-secondary">*</span>
                        </div>
                        <input className="form-control" type="time" name="signEndTime" />
                    </div>
                </div>
                <div>
                    <div className="fs-22px mb-15px">揪團資訊</div>
                    <textarea
                        className="form-control"
                        name="description"
                        id=""
                        rows={5}
                        defaultValue={""}
                    />
                </div>
                <div className="d-flex justify-content-end gap-2">
                    <Link href="/group/list">
                        <button type="button" className="btn btn-secondary">返回揪團列表</button>
                    </Link>
                    <button className={`btn btn-primary-deep`}>創立揪團</button>
                </div>
            </form>
        </main>
    );
}
