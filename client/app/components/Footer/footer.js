import { FaMapMarkerAlt, FaPhoneAlt, FaRegEnvelope, FaAngleDown  } from "react-icons/fa";


export default function Footer() {
    return (
        <>
            <footer className="footer">
                <div className="container footer-content">
                    <div className="row footer-top">
                        <div className="col d-flex justify-content-center d-sm-block">
                            <div className="footer-icon-container">
                                <img src="/image/DiveIn-logo-light-final.png" alt="" />
                            </div>
                        </div>
                        {/* 電腦版 網站地圖 關於我們 */}
                        <div className="d-none d-sm-block col footer-list">
                            <div>
                                <a className="text-reset a" href="#">
                                    活動列表
                                </a>
                            </div>
                            <div>
                                <a className="text-reset a" href="#">
                                    課程列表
                                </a>
                            </div>
                            <div>
                                <a className="text-reset a" href="#">
                                    商品列表
                                </a>
                            </div>
                            <div>
                                <a className="text-reset a" href="#">
                                    租賃列表
                                </a>
                            </div>
                            <div>
                                <a className="text-reset a" href="#">
                                    文章列表
                                </a>
                            </div>
                        </div>
                        <div className="d-none d-sm-block col footer-list">
                            <div>
                                <a className="text-reset a" href="#">
                                    活動列表
                                </a>
                            </div>
                            <div>
                                <a className="text-reset a" href="#">
                                    課程列表
                                </a>
                            </div>
                            <div>
                                <a className="text-reset a" href="#">
                                    商品列表
                                </a>
                            </div>
                            <div>
                                <a className="text-reset a" href="#">
                                    租賃列表
                                </a>
                            </div>
                            <div>
                                <a className="text-reset a" href="#">
                                    文章列表
                                </a>
                            </div>
                        </div>
                        <div className="d-none d-sm-block col footer-list">
                            <div className="footer-list-container d-flex flex-column">
                                <div className="footer-list-group d-flex align-items-center">
                                    <div className="footer-circle rounded-circle text-center">
                                        <FaMapMarkerAlt className=""/>
                                    </div>
                                    <div>
                                        <h6 className="footer-list-h6 m-0">
                                            地址
                                        </h6>
                                        <p className="footer-list-p m-0">
                                            桃園市中壢區新生路二段421號
                                        </p>
                                    </div>
                                </div>
                                <div className="footer-list-group d-flex align-items-center">
                                    <div className="footer-circle rounded-circle text-center">
                                        <FaPhoneAlt className="h-100"/>
                                    </div>
                                    <div>
                                        <h6 className="footer-list-h6 m-0">
                                            聯絡方式
                                        </h6>
                                        <p className="footer-list-p m-0">
                                            http://divein.com.tw/
                                        </p>
                                    </div>
                                </div>
                                <div className="footer-list-group d-flex align-items-center">
                                    <div className="footer-circle rounded-circle text-center">
                                        <FaRegEnvelope className="h-100"/>
                                    </div>
                                    <div>
                                        <h6 className="footer-list-h6 m-0">
                                            Email
                                        </h6>
                                        <p className="footer-list-p m-0">
                                            DiveIn@gmail.com
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* 手機版 網站地圖 關於我們 */}
                        <div className="d-flex flex-column  d-sm-none mobile-sitemap">
                            <button
                                className="btn p-0 text-reset w-100 text-start d-flex justify-content-between"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#about-me">
                                <div>關於我們</div>
                                <div>
                                    <FaAngleDown/>
                                </div>
                            </button>
                            <div
                                className="mobile-collapse collapse px-3"
                                id="about-me">
                                歡迎來到
                                DiveIn，您的專業潛水夥伴！我們專注於提供高品質的潛水裝備與課程，無論您是新手還是資深潛水員，都能在這裡找到適合的裝備與專業指導。我們的產品涵蓋潛水服、氣瓶、面鏡、呼吸管等，確保您的每次潛水都安全無憂。DiveIn
                                不只是購物平台，更是熱愛海洋的潛水者交流社群，讓我們一起探索神秘的水下世界，Dive
                                In and Discover!
                            </div>
                            <button
                                className="btn p-0 text-reset w-100 text-start d-flex justify-content-between"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#our-story">
                                <div>品牌故事</div>
                                <div>
                                    <FaAngleDown/>
                                </div>
                            </button>
                            <div
                                className="mobile-collapse collapse px-3"
                                id="our-story">
                                DiveIn
                                源於對海洋的熱愛與對潛水的無限熱情。創辦人曾是一名自由潛水愛好者，深知優質裝備對每一次潛水探險的重要性。因此，我們決心打造一個專業的平台，提供精選潛水用品，讓每位潛水員都能安心探索蔚藍世界。我們不只是販售裝備，更希望透過專業知識與社群交流，讓更多人愛上海洋、尊重大自然。DiveIn，帶你潛入未知，發現更多可能！
                            </div>
                            <button
                                className="btn p-0 text-reset w-100 text-start d-flex justify-content-between"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#aboutme-menu">
                                <div>聯絡資訊</div>
                                <div>
                                    <FaAngleDown/>
                                </div>
                            </button>
                            <div
                                className="mobile-collapse collapse px-3"
                                id="aboutme-menu">
                                <div className="footer-list-container d-flex flex-column">
                                    <div className="footer-list-group d-flex align-items-center">
                                        <div className="footer-circle rounded-circle text-center">
                                            <FaMapMarkerAlt/>
                                        </div>
                                        <div>
                                            <h6 className="footer-list-h6 m-0">
                                                地址
                                            </h6>
                                            <p className="footer-list-p m-0">
                                                桃園市中壢區新生路二段421號
                                            </p>
                                        </div>
                                    </div>
                                    <div className="footer-list-group d-flex align-items-center">
                                        <div className="footer-circle rounded-circle text-center">
                                            <FaPhoneAlt/>
                                        </div>
                                        <div>
                                            <h6 className="footer-list-h6 m-0">
                                                聯絡方式
                                            </h6>
                                            <p className="footer-list-p m-0">
                                                http://divein.com.tw/
                                            </p>
                                        </div>
                                    </div>
                                    <div className="footer-list-group d-flex align-items-center">
                                        <div className="footer-circle rounded-circle text-center">
                                            <FaRegEnvelope/>
                                        </div>
                                        <div>
                                            <h6 className="footer-list-h6 m-0">
                                                Email
                                            </h6>
                                            <p className="footer-list-p m-0">
                                                DiveIn@gmail.com
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom text-center text-white">
                    Copyright © 2025 DiveIn
                </div>
            </footer>
        </>
    );
}
