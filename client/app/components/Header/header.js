"use client";
import { useState } from "react";
import { FaSearch, FaBars } from "react-icons/fa";
import User from "./user";
import { FiShoppingCart } from "react-icons/fi";
import Link from "next/link";
import HeaderPop from "./headerPop"; // 引入 HeaderPop 組件

export default function Header() {
  const [showPop, setShowPop] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);

  const handleMouseEnter = (menu) => {
    setShowPop(true);
    setActiveMenu(menu);
  };

  const handleMouseLeave = () => {
    setShowPop(false);
    setActiveMenu(null);
  };
  return (
    <header className="sticky-top">
      <nav className="container" onMouseLeave={handleMouseLeave}>
        {/* 電腦版 navbar */}
        <div className="d-none d-sm-flex">
          <div className="header-icon-container">
            <Link href="/">
              <img src="/image/DiveIn-logo-dark-final.png" alt="Logo" />
            </Link>
          </div>
          <div className="header-list d-flex justify-content-between align-items-center">
            <ul className="m-0 d-flex justify-content-between align-items-center list-unstyled">
              <li className="px-3 py-2">
                <Link
                  className="a"
                  href="/"
                  onMouseEnter={() => {
                    setShowPop(false);
                  }}
                >
                  首頁
                </Link>
              </li>

              <li className="px-3 py-2">
                <Link
                  className="a"
                  href="/products"
                  onMouseEnter={() => handleMouseEnter("products")}
                >
                  商品
                </Link>
              </li>
              <li className="px-3 py-2">
                <Link
                  className="a"
                  href="/activity"
                  onMouseEnter={() => handleMouseEnter("events")}
                >
                  活動
                </Link>
              </li>
              <li className="px-3 py-2">
                <Link
                  className="a"
                  href="/rent"
                  onMouseEnter={() => handleMouseEnter("rental")}
                >
                  租借
                </Link>
              </li>
              <li className="px-3 py-2">
                <Link
                  className="a"
                  href="/group"
                  onMouseEnter={() => handleMouseEnter("group")}
                >
                  揪團
                </Link>
              </li>
              <li className="px-3 py-2">
                <Link
                  className="a"
                  href="/article"
                  onMouseEnter={() => handleMouseEnter("forum")}
                >
                  論壇
                </Link>
              </li>
            </ul>
          </div>
          <HeaderPop show={showPop} activeMenu={activeMenu} />
          <div className="header-right-box d-flex justify-content-end align-items-center">
            <form className="d-flex search-box" action="">
              <input
                type="search"
                className="form-control"
                placeholder="Search"
              />
              <button className="btn">
                <FaSearch className="text-secondary vstack text-center" />
              </button>
            </form>
            <a href="/cart/step1" className="header-cart a" id="cart-icon">
              <FiShoppingCart />
            </a>
            <User />
          </div>
        </div>

        {/* 手機板 navbar*/}
        <div className="w-100 d-flex d-sm-none justify-content-between align-items-center">
          <div>
            <button
              className="btn"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#offcanvasExample"
              aria-controls="offcanvasExample"
            >
              <FaBars />
            </button>
          </div>
          <div className="header-icon-container text-center">
            <img src="/image/DiveIn-logo-dark-final.png" alt="Logo" />
          </div>
          <div className="mobile-cart fs-4">
            <Link href="/cart" className="a text-black">
              <FiShoppingCart />
            </Link>
            {/* <a href="#"="" class="a text-black ms-1"><i class="bi bi-person"></i></a> */}
          </div>
        </div>
      </nav>

      {/* 漢堡選單內容 */}
      <div
        className="mobile-offcanvas offcanvas offcanvas-start "
        tabIndex={-1}
        id="offcanvasExample"
        aria-labelledby="offcanvasExampleLabel"
      >
        <div className="mobile-offcanvas-header offcanvas-header">
          <h5
            className="offcanvas-title text-secondary"
            id="offcanvasScrollingLabel"
          />
          <button
            type="button"
            className="btn-close text-reset"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          />
        </div>
        <div className="mobile-offcanvas-body offcanvas-body p-0">
          <ul className="m-0 list-unstyled border-bottom">
            <li className="px-3 pt-4 pb-2">
              <Link className="a text-reset" href="/">
                首頁
              </Link>
            </li>
            <li className="px-3 py-2">
              <button
                className="btn dropdown-toggle p-0 text-reset"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#product-menu"
              >
                商品
              </button>
              <div className="mobile-collapse collapse mt-3" id="product-menu">
                <ul className="list-group">
                  <li className="list-group-item">
                    <a className="a text-reset" href="#">
                      面鏡／呼吸管
                    </a>
                  </li>
                  <li className="list-group-item">
                    <a className="a text-reset" href="#">
                      蛙鞋
                    </a>
                  </li>
                  <li className="list-group-item">
                    <a className="a text-reset" href="#">
                      潛水配件
                    </a>
                  </li>
                  <li className="list-group-item">
                    <a className="a text-reset" href="#">
                      電子裝備／專業配件
                    </a>
                  </li>
                  <li className="list-group-item">
                    <a className="a text-reset" href="#">
                      防寒衣物
                    </a>
                  </li>
                  <li className="list-group-item">
                    <a className="a text-reset" href="#">
                      包包攜行
                    </a>
                  </li>
                  <li className="list-group-item">
                    <a className="a text-reset" href="#">
                      魚槍／配件
                    </a>
                  </li>
                  <li className="list-group-item">
                    <a className="a text-reset" href="#">
                      生活小物
                    </a>
                  </li>
                </ul>
              </div>
            </li>
            <li className="px-3 py-2">
              <button
                className="btn dropdown-toggle p-0 text-reset"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#activity-menu"
              >
                活動
              </button>
              <div className="mobile-collapse collapse mt-3" id="activity-menu">
                <ul className="list-group">
                  <li className="list-group-item">
                    <a className="a text-reset" href="#">
                      自由潛水活動
                    </a>
                  </li>
                  <li className="list-group-item">
                    <a className="a text-reset" href="#">
                      水肺潛水活動
                    </a>
                  </li>
                  <li className="list-group-item">
                    <a className="a text-reset" href="#">
                      浮潛活動
                    </a>
                  </li>
                </ul>
              </div>
            </li>
            <li className="px-3 py-2">
              <button
                className="btn dropdown-toggle p-0 text-reset"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#rent-menu"
              >
                租借
              </button>
              <div className="mobile-collapse collapse mt-3" id="rent-menu">
                <ul className="list-group">
                  <li className="list-group-item">
                    <a className="a text-reset" href="#">
                      基礎裝備租借
                    </a>
                  </li>
                  <li className="list-group-item">
                    <a className="a text-reset" href="#">
                      專業裝備租借
                    </a>
                  </li>
                  <li className="list-group-item">
                    <a className="a text-reset" href="#">
                      水下攝影設備
                    </a>
                  </li>
                </ul>
              </div>
            </li>
            <li className="px-3 py-2">
              <button
                className="btn dropdown-toggle p-0 text-reset"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#group-menu"
              >
                揪團
              </button>
              <div className="mobile-collapse collapse mt-3" id="group-menu">
                <ul className="list-group">
                  <li className="list-group-item">
                    <a className="a text-reset" href="#">
                      建立揪團
                    </a>
                  </li>
                  <li className="list-group-item">
                    <a className="a text-reset" href="#">
                      參加揪團
                    </a>
                  </li>
                  <li className="list-group-item">
                    <a className="a text-reset" href="#">
                      我的揪團
                    </a>
                  </li>
                </ul>
              </div>
            </li>
            <li className="px-3 py-2">
              <button
                className="btn dropdown-toggle p-0 text-reset"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#forum-menu"
              >
                論壇
              </button>
              <div className="mobile-collapse collapse mt-3" id="forum-menu">
                <ul className="list-group">
                  <li className="list-group-item">
                    <a className="a text-reset" href="#">
                      綜合討論
                    </a>
                  </li>
                  <li className="list-group-item">
                    <a className="a text-reset" href="#">
                      潛水心得
                    </a>
                  </li>
                  <li className="list-group-item">
                    <a className="a text-reset" href="#">
                      裝備討論
                    </a>
                  </li>
                  <li className="list-group-item">
                    <a className="a text-reset" href="#">
                      水攝攝影
                    </a>
                  </li>
                </ul>
              </div>
            </li>
{/*             
            <li className="px-3 py-2">
              <a className="a text-reset" href="#">
                活動
              </a>
            </li>
            <li className="px-3 py-2">
              <a className="a text-reset" href="#">
                租借
              </a>
            </li>
            <li className="px-3 py-2">
              <a className="a text-reset" href="#">
                揪團
              </a>
            </li>
            <li className="px-3 pt-2 pb-4">
              <a className="a text-reset" href="#">
                論壇
              </a>
            </li> */}
          </ul>
          <div className="border-bottom">
            <h5 className="px-3 pt-4 py-2 text-secondary">帳戶</h5>
            <ul className="m-0 px-4 list-unstyled">
              <li className="px-3 py-2">
                <Link className="a text-reset" href="/admin/login">
                  登入
                </Link>
              </li>
              <li className="px-3 pt-2 pb-4">
                <Link className="a text-reset" href="/admin/register">
                  註冊
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}
