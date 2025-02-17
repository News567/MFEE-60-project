"use client";
import "./styles.css";
import CountDownCard from "./_component/CountDownCard";
import { useState,useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { ReactSVG } from "react-svg";


export default function GroupDetailPage() {
    const [count, setCount] = useState(0);
    const { id } = useParams();
    // 設定api路徑
    const api = "http://localhost:3005/api";

    // 設定揪團資料
    const [group, setGroup] = useState([]);
    const [description,setDescription] = useState([])

    // 連接後端獲取揪團資料
    useEffect(() => {
        const getList = async () => {
            await axios
                .get(api + "/group/list/" + id)
                .then((res) => {
                    console.log(res.data.data[0]);
                    setGroup(res.data.data[0]);
                    setDescription((res.data.data[0].description).split("\n"))
                })
                .catch((error) => {
                    console.log(error);
                });
        };
        getList();
    }, [id]);

    useEffect(() => {
        if (group.length > 0) {
            console.log(group);
        }
    }, [group]);
    return (
        <main className="main container d-flex groupDetailPage">
            <aside className="d-none d-md-block">篩選列</aside>
            <div className="row">
                <div className="col-sm-8 col-12 d-flex flex-column middle-section">
                    <div className="img-container">
                        <img className="img" src={`/image/group/${id}/${group.group_img}`} alt="" />
                    </div>
                    <h4 className="text-center fs-26px fw-bold m-0">
                        {group.name}
                    </h4>
                    <div className="d-flex justify-content-between align-items-center state-section">
                        <div className="group-state">{(()=>{
                            switch (group.status){
                                case 0:
                                return "揪團中";
                                case 1:
                                return "已成團";
                                case 2:
                                return "已取消";

                            }
                        })()}</div>
                        <div>
                            <i className="bi bi-geo-alt-fill color-primary icon-bigger" />{" "}
                            {group.country_name} {group.city_name}
                        </div>
                        <div>
                            <i className="bi bi-person color-primary icon-bigger" />{" "}
                            {(()=>{
                            switch (group.gender){
                                case 1:
                                return "不限性別";
                                case 2:
                                return "限男性";
                                case 3:
                                return "限女性";

                            }
                        })()}
                        </div>
                    </div>
                    <div className="group-info">
                        {/* FIXME:浮潛面鏡icon */}
                        {(() => {
                        switch (group.type) {
                            case 1:
                                return (
                                    <div className="text-center fw-bold fs-20px">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20"
                                            height="15"
                                            viewBox="0 0 20 15"
                                            fill="none">
                                            <path
                                                d="M15.983 1.80092C15.8648 1.68269 15.7045 1.61631 15.5374 1.61631H1.59744C1.43028 1.61631 1.26994 1.68269 1.15176 1.80092L0.184603 2.76802C0.0663758 2.88625 0 3.04654 0 3.21376V8.97877C0 9.14599 0.0664279 9.30628 0.184603 9.4245L1.15176 10.3916C1.26999 10.5098 1.43028 10.5762 1.59744 10.5762H6.26499C6.46022 10.5762 6.64435 10.4858 6.76372 10.3313L7.9537 8.79157H9.1811L10.3711 10.3313C10.4905 10.4858 10.6746 10.5762 10.8698 10.5762H15.5374C15.7045 10.5762 15.8649 10.5098 15.983 10.3916L16.9502 9.4245C17.0684 9.30628 17.1348 9.14599 17.1348 8.97877V3.21376C17.1348 3.04659 17.0684 2.88625 16.9502 2.76802L15.983 1.80092ZM15.8742 8.71775L15.2763 9.3156H11.1793L9.98933 7.77583C9.86995 7.62137 9.68577 7.53095 9.4906 7.53095H7.6442C7.44898 7.53095 7.26485 7.62137 7.14547 7.77583L5.9555 9.3156H1.85852L1.26057 8.71775V3.47484L1.85852 2.87693H15.2763L15.8742 3.47484V8.71775ZM11.0661 10.9671H6.06862C5.7205 10.9671 5.43834 11.2493 5.43834 11.5974V13.8499C5.43834 14.1981 5.7205 14.4802 6.06862 14.4802H11.0661C11.4142 14.4802 11.6964 14.198 11.6964 13.8499V13.387H17.4208C17.6109 13.387 17.7908 13.3012 17.9105 13.1535L19.8594 10.7481C19.9503 10.6359 19.9999 10.4957 19.9999 10.3513V1.15012C19.9999 0.801999 19.7178 0.519836 19.3697 0.519836C19.0215 0.519836 18.7394 0.801999 18.7394 1.15012V10.128L17.1203 12.1264H11.6964V11.5975C11.6964 11.2492 11.4142 10.9671 11.0661 10.9671ZM10.4358 13.2196H6.69901V12.2277H10.4358V13.2196Z"
                                                fill="black"
                                            />
                                        </svg>
                                        <span className="ms-2">浮潛</span>
                                    </div>
                                );
                            case 2:
                                return (
                                    <div className="justify-content-center fw-bold fs-20px d-flex">
                                        <ReactSVG src="/image/group/free.svg"/>
                                        <span className="ms-1">自由潛水</span>
                                    </div>
                                );
                            case 3:
                                return (
                                    <div className="justify-content-center d-flex fw-bold fs-20px">
                                        <ReactSVG src="/image/group/aqualung-diving-svgrepo-com.svg"/>
                                        <span className="ms-1">水肺潛水</span>
                                    </div>
                                );
                                case 4:
                                return(
                                    <div className="text-center fw-bold fs-20px">
                                    <i className="icon bi bi-people-fill" />
                                        <span className="ms-1">其他</span>
                                    </div>
                                )
                        }
                    })() ||  <div className="text-center fw-bold fs-20px">
                            載入中
                        </div>}
                       
                        <div className="d-flex justify-content-around">
                            <div className="fs-20px">
                                <i className="bi bi-calendar" /> {group.date}
                            </div>
                            <div className="fs-20px">
                                <i className="bi bi-clock" /> {group.time}
                            </div>
                        </div>
                    </div>
                    <div className="group-detail text-center d-flex flex-column middle-section">
                        <div className="fs-20px">揪團主：{group.user_name}</div>
                        <div className="fs-20px">揪團上架：{group.created_at}</div>
                        <div className="fs-20px">揪團截止：{group.signEndDate}</div>
                        <div className="d-none d-sm-flex justify-content-center time-cards">
                        {group.signEndDate ? (<CountDownCard date={new Date(group.signEndDate)} />): "載入中"}
                            
                        </div>
                        <hr className="hr" />
                        <div className="fs-20px fw-bold d-flex align-items-center justify-content-center gap-2">
                            <div>
                                <i className="bi bi-person-check-fill color-primary fs-26px" />
                            </div>
                            已揪 0 ／ 剩餘 {group.maxNumber}
                        </div>
                        <div className="fw-bold fs-18px">人數</div>
                        {/* FIXME: 設定好可選人數限制 */}
                        <div className="input-group count-group">
                            <button
                                className="btn"
                                type="button"
                                id="button-addon1"
                                onClick={() => setCount(count - 1)}>
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
                                onClick={() => setCount(count + 1)}>
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
                        <div className="m-0">
                        {description && description.length>0 ? ((description.map((v,i)=>{
                            return(
                                <p key={i}>{v}</p>
                            )
                        }))): "載入中"}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
