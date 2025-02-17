"use client";
import {
    FaRegHeart,
    FaMapMarkerAlt,
    FaRegClock,
    FaStar,
    FaStarHalfAlt,
    FaRegStar,
    FaRegCheckCircle,
} from "react-icons/fa";
import Image from "next/image";
import styles from "../detail.module.css"
import Link from "next/link";

export default function RecommendCard({activity}) {
    return (
        <Link className={styles.recommendCardA} href="#">
            <div className={`${styles.recommendCard}`}>
                <div className={`${styles.cardImgContainer}`}>
                    <Image
                        className={`${styles.img}`}
                        src="/image/jpg (5).webp"
                        width={500}
                        height={153}
                        alt=""  
                        layout="responsive"
                    />
                    <div className={`${styles.mapMarker}`}>
                        <FaMapMarkerAlt />
                        {activity?.location ? activity.location : "屏東"}
                    </div>
                    <div>
                        <FaRegHeart className={`${styles.heart}`} />
                    </div>
                </div>
                <div className={`${styles.recommendCardText}`}>
                    {activity?.name ? activity.name : "【春節旅遊特惠】小琉球浮潛|美人洞 & 花瓶岩 & 龍蝦洞與海龜共遊|指定套餐贈好禮|含拍照|寵物友善|小海龜水上活動"}
                </div>
                <div className={`${styles.count}`}>1天前可免費取消</div>
                <div>
                    <FaStar />
                    4.8(999) | 9K+個已訂購
                </div>
                <div className={`fw-bold`}>{activity?.price ? activity.price : "NT$360起"}</div>
            </div>
        </Link>
    );
}
