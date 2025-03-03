"use client";
import Link from "next/link";
import Image from "next/image";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import "./group.css";
import useFavorite from "@/hooks/useFavorite";
import { useCart } from "@/hooks/cartContext";
import { ReactSVG } from "react-svg";

export default function GroupCard({ group }) {
    // const { isFavorite, toggleFavorite, loading } = useFavorite(group.id);

    // const { addToCart } = useCart();

    // const handleCartClick = (e) => {
    //     e.preventDefault();
    //     e.stopPropagation();
    //     addToCart(group);
    // };
    const now = new Date()
    console.log(now);
    return (
        <div className="group-card row d-flex justify-content-between align-items-center w-100">
            <div className="col-12 col-sm-6 d-flex avatar">
                <div className="group-card-img">
                    <img
                        className="img"
                        src={`/image/group/${group.group_img}`}
                        alt=""
                    />
                </div>
                <div className="description">
                    <div className="group-name">{group.name}</div>
                    {(() => {
                        switch (group.type) {
                            case 1:
                                return (
                                    <div>
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
                                    <div className="d-flex align-items-center ">
                                        <ReactSVG src="/image/group/free.svg"/>
                                        <span className="ms-1">自由潛水</span>
                                    </div>
                                );
                            case 3:
                                return (
                                    <div className="d-flex align-items-center ">
                                        <ReactSVG src="/image/group/aqualung-diving-svgrepo-com.svg"/>
                                        <span className="ms-1">水肺潛水</span>
                                    </div>
                                );
                                case 4:
                                return(
                                    <div className="d-flex align-items-center ">
                                    <i className="icon bi bi-people-fill" />
                                        <span className="ms-1">其他</span>
                                    </div>
                                )
                        }
                    })()}
                    <div className="d-flex gap-2">
                        <div>
                            <i className="bi bi-calendar me-1" /> {group.date}
                        </div>
                        <div>
                            <i className="bi bi-clock me-1" /> {group.time}
                        </div>
                    </div>
                </div>
            </div>
            <div className="detail col-12 col-sm-6 d-sm-flex flex-sm-column justify-content-sm-between align-items-sm-end text-center">
                <div className="detail-top d-flex flex-sm-column justify-content-between align-items-sm-end w-100">
                    <div>
                        <i className="bi bi-geo-alt-fill color-primary" />{" "}
                        {group.city_name}
                    </div>
                    <div>
                        <i className="bi bi-person color-primary" />{" "}
                        {(() => {
                            {/* console.log("123"); */}
                            switch (group.gender) {
                                case 1:
                                    return "不限性別";
                                case 2:
                                    return "限男性";
                                case 3:
                                    return "限女性";
                            }
                        })()}
                    </div>
                    <div>已揪：{group.participant_number}/{group.max_number}</div>
                </div>
                {now < new Date(group.sign_end_date)?(<div className="color-primary">
                    揪團截止:{group.sign_end_date}
                </div>):(<div className="text-secondary">
                    揪團截止:{group.sign_end_date} <span className="text-danger">已截止</span>
                </div>)}
            </div>
        </div>
    );
}
