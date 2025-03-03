"use client";

import styles from "./page.module.css";

export default function AddCart() {
    return (
        <div className={`${styles.addCartForm} container`}>
            <form action="">
                <div className={styles.first}>
                    <div className={`${styles.representative}`}>旅客代表人</div>
                    <div className={`${styles.representativeForm}`}>
                        <div className="form-group">
                            <label htmlFor="chineseName" className="form-label">
                                中文姓名
                            </label>
                            <input
                                type="text"
                                id="chineseName"
                                className="form-control"
                            />
                        </div>
                        <div className="d-flex justify-content-between gap-3">
                            <div className="form-group w-100">
                                <label htmlFor="name" className="form-label">
                                    英文名
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    className="form-control"
                                />
                                <small className="form-text text-muted">
                                    請參照護照英文姓名
                                </small>
                            </div>
                            <div className="form-group w-100">
                                <label htmlFor="surname" className="form-label">
                                    英文姓
                                </label>
                                <input
                                    type="text"
                                    id="surname"
                                    className="form-control"
                                />
                                <small className="form-text text-muted">
                                    請參照護照英文姓名
                                </small>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="idNumber" className="form-label">
                                連絡電話
                            </label>
                            <input
                                type="phone"
                                id="idNumber"
                                className="form-control"
                            />
                            <small className="form-text text-muted">
                                請提供旅遊期間的聯絡電話
                            </small>
                        </div>
                        <div className="form-group">
                            <label htmlFor="idNumber" className="form-label">
                                身分證字號
                            </label>
                            <input
                                type="text"
                                id="idNumber"
                                className="form-control"
                            />
                            <small className="form-text text-muted">
                                身份證字號僅供投保旅平險專用
                            </small>
                        </div>
                        <div className="form-group">
                            <label htmlFor="idNumber" className="form-label">
                                特殊需求備註
                            </label>
                            <textarea className="form-control" name="" id="idNumber" rows={5}></textarea>
                        </div>
                    </div>
                </div>
            </form>
            <form action="">
                <div className={styles.first}>
                    <div className={`${styles.representative}`}>旅客資料</div>
                    <div className={`${styles.representativeForm}`}>
                        <div className="form-group">
                            <label htmlFor="chineseName" className="form-label">
                                中文姓名
                            </label>
                            <input
                                type="text"
                                id="chineseName"
                                className="form-control"
                            />
                        </div>
                        <div className="d-flex justify-content-between gap-3">
                            <div className="form-group w-100">
                                <label htmlFor="name" className="form-label">
                                    英文名
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    className="form-control"
                                />
                                <small className="form-text text-muted">
                                    請參照護照英文姓名
                                </small>
                            </div>
                            <div className="form-group w-100">
                                <label htmlFor="surname" className="form-label">
                                    英文姓
                                </label>
                                <input
                                    type="text"
                                    id="surname"
                                    className="form-control"
                                />
                                <small className="form-text text-muted">
                                    請參照護照英文姓名
                                </small>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="idNumber" className="form-label">
                                身分證字號
                            </label>
                            <input
                                type="text"
                                id="idNumber"
                                className="form-control"
                            />
                            <small className="form-text text-muted">
                                身份證字號僅供投保旅平險專用
                            </small>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
