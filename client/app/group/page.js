"use client";
import { useEffect, useState } from "react";
import "./styles.css";
import Link from "next/link";
import axios from "axios";
import { useAuth } from "@/hooks/useAuth";
export default function GroupHomePage() {
  // 檢查登入狀態用
  const { user } = useAuth();
  // 設定揪團資料
  const [groups, setGroups] = useState([]);
  const [progressing, setProgressing] = useState(0);
  const [endedNumber, setEndedNumber] = useState(0);

  // 設定api路徑
  const api = "http://localhost:3005/api";

  // 連接後端獲取揪團資料
  useEffect(() => {
    const getList = async () => {
      await axios
        .get(api + "/group")
        .then((res) => {
          // console.log(res.data.data);
          setGroups(res.data.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getList();
  }, []);

  useEffect(() => {
    if (groups.length > 0) {
      console.log(groups);
      const progressingNumber = groups.reduce(
        (count, item) => count + (item.status == 0 ? 1 : 0),
        0
      );
      setProgressing(progressingNumber);
      const ended = groups.reduce(
        (count, item) => count + (item.status == 1 ? 1 : 0),
        0
      );
      setEndedNumber(ended);
    }
  }, [groups]);

  return (
    <main className="group-home">
      <section className="hero d-flex justify-content-center align-items-center flex-column">
        <h1 className="text-center h1">
          揪團潛水趣
          <br />
          一起探索大海
        </h1>
        <div>
          <Link href="/group/create">
            <button className="btn btn-hold">
              <i className="icon bi bi-person-plus-fill" />
              我要開團
            </button>
          </Link>

          <Link href="/group/list">
            <button className="btn btn-join">
              <i className="icon bi bi-people-fill" /> 我要跟團
            </button>
          </Link>
        </div>
      </section>
      <section className="number-section-container d-flex justify-content-center">
        <div className="d-flex number-section">
          <div className="number-block border-right">
            <h3 className="text-center h3">{groups.length}</h3>
            <p className="text-center p">總揪團</p>
          </div>
          <div className="number-block border-right">
            <h3 className="text-center h3">{progressing}</h3>
            <p className="text-center p">揪團中</p>
          </div>
          <div className="number-block">
            <h3 className="text-center h3">{endedNumber}</h3>
            <p className="text-center p">已成團</p>
          </div>
        </div>
      </section>
      <section className="text-center new-group-section container">
        <div className="publicity-title">最新揪團</div>
        <div className="d-flex justify-content-between group-cards">
          {groups && groups.length > 0 ? (
            groups.slice(0, 4).map((group, i) => {
              return (
                <Link className="link" key={i} href={`/group/list/${group.id}`}>
                  <div className="group-card">
                    <div className="img-container">
                      <img
                        className="img"
                        src={`/image/group/${group.group_img}`}
                        alt=""
                      />
                    </div>
                    <p className="text-center text-secondary fw-bold m-0">
                      {group.city_name}
                    </p>
                    <p className="text-center m-0 fw-bold">{group.name}</p>
                  </div>
                </Link>
              );
            })
          ) : (
            <div>沒有揪團</div>
          )}

          {/* <div className="group-card">
                        <div className="img-container">
                            <img
                                className="img"
                                src="./image/jpg (1).webp"
                                alt=""
                            />
                        </div>
                        <p className="text-center">離島</p>
                        <p className="text-center">小琉球共潛需證照</p>
                    </div>
                    <div className="group-card d-none d-sm-block">
                        <div className="img-container">
                            <img
                                className="img"
                                src="./image/jpg (1).webp"
                                alt=""
                            />
                        </div>
                        <p className="text-center">離島</p>
                        <p className="text-center">小琉球共潛需證照</p>
                    </div>
                    <div className="group-card d-none d-sm-block">
                        <div className="img-container">
                            <img
                                className="img"
                                src="./image/jpg (1).webp"
                                alt=""
                            />
                        </div>
                        <p className="text-center">離島</p>
                        <p className="text-center">小琉球共潛需證照</p>
                    </div>
                    <div className="group-card d-none d-sm-block">
                        <div className="img-container">
                            <img
                                className="img"
                                src="./image/jpg (1).webp"
                                alt=""
                            />
                        </div>
                        <p className="text-center">離島</p>
                        <p className="text-center">小琉球共潛需證照</p>
                    </div> */}
        </div>
        <Link href="/group/list">
          <button className="btn all-group-btn">所有揪團</button>
        </Link>
      </section>
      <section className="bg-blue">
        <div className="container">
          <div className="text-center publicity-title">DiveIn揪團趣</div>
          <div className="row publicity-cards">
            <div className="col-sm-4">
              <div className="text-center">
                <i className="publicity-icon icon bi bi-person-plus-fill" />
              </div>
              <h4 className="text-center publicity-little-title">便利開團</h4>
              <p className="text-center">
                開團完全免費，不限制開團數量，輕鬆揪人共探海洋世界。
              </p>
            </div>
            <div className="col-sm-4">
              <div className="text-center">
                <i className="publicity-icon icon bi bi-people-fill" />
              </div>
              <h4 className="text-center publicity-little-title">快速加入</h4>
              <p className="text-center">
                參加者可直接加入活動，無需繁瑣的手續，立即確認名額，輕鬆參加揪團！
              </p>
            </div>
            <div className="col-sm-4">
              <div className="text-center">
                <i className="publicity-icon bi bi-envelope-fill" />
              </div>
              <h4 className="text-center publicity-little-title">即時通知</h4>
              <p className="text-center">
                無論是活動更新、報名狀態或是重要提醒，參與者都能第一時間獲得通知，確保資訊不錯過，隨時掌握最新動態。
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
