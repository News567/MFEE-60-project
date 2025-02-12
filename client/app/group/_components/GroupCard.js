"use client";
import Link from "next/link";
import Image from "next/image";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import "./group.css";
import useFavorite from "@/hooks/useFavorite";
import { useCart } from "@/hooks/cartContext";

export default function GroupCard({ group }) {
    // const { isFavorite, toggleFavorite, loading } = useFavorite(group.id);

    // const { addToCart } = useCart();

    // const handleCartClick = (e) => {
    //     e.preventDefault();
    //     e.stopPropagation();
    //     addToCart(group);
    // };

    return (
            <div className="group-card row d-flex justify-content-between align-items-center">
                <div className="col-12 col-sm-6 d-flex avatar">
                    <div className="group-card-img">
                        <img className="img" src="/image/jpg (1).webp" alt />
                    </div>
                    <div className="description">
                        <div className="group-name">揪團名稱</div>
                        <div>icon 活動分類</div>
                        <div className="d-flex gap-2">
                            <div>
                                <i className="bi bi-calendar" /> 2025-01-01
                            </div>
                            <div>
                                <i className="bi bi-clock" /> 13:00
                            </div>
                        </div>
                    </div>
                </div>
                <div className="detail col-12 col-sm-6 d-sm-flex flex-sm-column justify-content-sm-between align-items-sm-end text-center">
                    <div className="detail-top d-flex flex-sm-column justify-content-between align-items-sm-end w-100">
                        <div>
                            <i className="bi bi-geo-alt-fill color-primary" />{" "}
                            墾丁
                        </div>
                        <div>
                            <i className="bi bi-person color-primary" />{" "}
                            不限性別
                        </div>
                        <div>已揪：0</div>
                    </div>
                    <div className="color-primary">揪團截止:2025-01-31</div>
                </div>
            </div>
    );
}
