"use client";
import React, { useState } from "react";

export default function ActivityForm({ activity, onSubmit }) {
  const [formData, setFormData] = useState({
    mainTraveler: {
      chineseName: "",
      englishName: "",
      phone: "",
      idNumber: "",
      note: "",
      isRepresentative: true,
    },
    otherTravelers: Array(Math.max(0, activity.quantity - 1))
      .fill(null)
      .map(() => ({
        chineseName: "",
        englishName: "",
        phone: "",
        idNumber: "",
        note: "",
        isRepresentative: false,
      })),
  });

  const handleMainTravelerChange = (e) => {
    const { id, value } = e.target;
    const fieldName = id.split(".").pop();

    setFormData((prev) => ({
      ...prev,
      mainTraveler: {
        ...prev.mainTraveler,
        [fieldName]: value,
      },
    }));
  };

  const handleOtherTravelerChange = (index, e) => {
    const { id, value } = e.target;
    const fieldName = id.split(".").pop();

    setFormData((prev) => ({
      ...prev,
      otherTravelers: prev.otherTravelers.map((traveler, i) =>
        i === index ? { ...traveler, [fieldName]: value } : traveler
      ),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 組合所有旅客資料並格式化為後端需要的格式
    const allTravelers = [
      {
        chineseName: formData.mainTraveler.chineseName,
        englishName: formData.mainTraveler.englishName,
        idNumber: formData.mainTraveler.idNumber,
        phone: formData.mainTraveler.phone,
        note: formData.mainTraveler.note,
        isRepresentative: true,
      },
      ...formData.otherTravelers.map((traveler) => ({
        chineseName: traveler.chineseName,
        englishName: traveler.englishName,
        idNumber: traveler.idNumber,
        phone: traveler.phone || "",
        note: traveler.note || "",
        isRepresentative: false,
      })),
    ];

    if (typeof onSubmit === "function") {
      onSubmit(allTravelers);
    }
  };

  return (
    <div className="activity-form">
      {/* 旅客代表人表單 */}
      <div className="card mb-4">
        <div className="card-header">
          <h5 className="mb-0">旅客代表人</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label htmlFor="mainTraveler.chineseName" className="form-label">
                中文姓名
              </label>
              <input
                type="text"
                id="mainTraveler.chineseName"
                className="form-control"
                value={formData.mainTraveler.chineseName}
                onChange={handleMainTravelerChange}
                required
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="mainTraveler.englishName" className="form-label">
                護照英文姓名
              </label>
              <input
                type="text"
                id="mainTraveler.englishName"
                className="form-control"
                value={formData.mainTraveler.englishName}
                onChange={handleMainTravelerChange}
              />
              <small className="form-text text-muted">
                請填寫完整護照英文姓名
              </small>
            </div>

            <div className="form-group mb-3">
              <label htmlFor="mainTraveler.phone" className="form-label">
                連絡電話
              </label>
              <input
                type="tel"
                id="mainTraveler.phone"
                className="form-control"
                value={formData.mainTraveler.phone}
                onChange={handleMainTravelerChange}
                required
              />
              <small className="form-text text-muted">
                請提供旅遊期間的聯絡電話
              </small>
            </div>

            <div className="form-group mb-3">
              <label htmlFor="mainTraveler.idNumber" className="form-label">
                身分證字號
              </label>
              <input
                type="text"
                id="mainTraveler.idNumber"
                className="form-control"
                value={formData.mainTraveler.idNumber}
                onChange={handleMainTravelerChange}
                required
              />
              <small className="form-text text-muted">
                身份證字號僅供投保旅平險專用
              </small>
            </div>

            <div className="form-group mb-3">
              <label htmlFor="mainTraveler.note" className="form-label">
                特殊需求備註
              </label>
              <textarea
                id="mainTraveler.note"
                className="form-control"
                rows={5}
                value={formData.mainTraveler.note}
                onChange={handleMainTravelerChange}
              ></textarea>
            </div>
          </form>
        </div>
      </div>

      {/* 只有當活動人數 > 1 時才顯示其他旅客資料表單 */}
      {activity.quantity > 1 &&
        formData.otherTravelers.map((_, index) => (
          <div key={index} className="card mb-4">
            <div className="card-header">
              <h5 className="mb-0">旅客 {index + 2}</h5>
            </div>
            <div className="card-body">
              <form>
                <div className="form-group mb-3">
                  <label
                    htmlFor={`otherTravelers.${index}.chineseName`}
                    className="form-label"
                  >
                    中文姓名
                  </label>
                  <input
                    type="text"
                    id={`otherTravelers.${index}.chineseName`}
                    className="form-control"
                    value={formData.otherTravelers[index].chineseName}
                    onChange={(e) => handleOtherTravelerChange(index, e)}
                    required
                  />
                </div>

                <div className="form-group mb-3">
                  <label
                    htmlFor={`otherTravelers.${index}.englishName`}
                    className="form-label"
                  >
                    護照英文姓名
                  </label>
                  <input
                    type="text"
                    id={`otherTravelers.${index}.englishName`}
                    className="form-control"
                    value={formData.otherTravelers[index].englishName}
                    onChange={(e) => handleOtherTravelerChange(index, e)}
                  />
                  <small className="form-text text-muted">
                    請填寫完整護照英文姓名
                  </small>
                </div>

                <div className="form-group mb-3">
                  <label
                    htmlFor={`otherTravelers.${index}.phone`}
                    className="form-label"
                  >
                    連絡電話
                  </label>
                  <input
                    type="tel"
                    id={`otherTravelers.${index}.phone`}
                    className="form-control"
                    value={formData.otherTravelers[index].phone}
                    onChange={(e) => handleOtherTravelerChange(index, e)}
                  />
                </div>

                <div className="form-group mb-3">
                  <label
                    htmlFor={`otherTravelers.${index}.idNumber`}
                    className="form-label"
                  >
                    身分證字號
                  </label>
                  <input
                    type="text"
                    id={`otherTravelers.${index}.idNumber`}
                    className="form-control"
                    value={formData.otherTravelers[index].idNumber}
                    onChange={(e) => handleOtherTravelerChange(index, e)}
                    required
                  />
                  <small className="form-text text-muted">
                    身份證字號僅供投保旅平險專用
                  </small>
                </div>

                <div className="form-group mb-3">
                  <label
                    htmlFor={`otherTravelers.${index}.note`}
                    className="form-label"
                  >
                    特殊需求備註
                  </label>
                  <textarea
                    id={`otherTravelers.${index}.note`}
                    className="form-control"
                    rows={3}
                    value={formData.otherTravelers[index].note}
                    onChange={(e) => handleOtherTravelerChange(index, e)}
                  ></textarea>
                </div>
              </form>
            </div>
          </div>
        ))}

      <div className="d-flex justify-content-between">
        <div>
          {/* 顯示目前填寫進度 */}
          <span className="text-muted">
            填寫進度：{activity.quantity} 位旅客中的第{" "}
            {activity.currentTraveler} 位
          </span>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleSubmit}
        >
          {activity.isLastActivity ? "前往結帳" : "下一個活動"}
        </button>
      </div>
    </div>
  );
}
