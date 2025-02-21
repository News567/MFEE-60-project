"use client";
import { useState } from "react";

export default function ActivityForm({ activity, onSubmit }) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    emergencyContact: "",
    emergencyPhone: "",
    specialNeeds: "",
    experience: "none",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // 這裡可以加入表單驗證
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row g-3">
        {/* 基本資料 */}
        <div className="col-md-6">
          <label className="form-label">姓名</label>
          <input
            type="text"
            className="form-control"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">聯絡電話</label>
          <input
            type="tel"
            className="form-control"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            required
          />
        </div>

        {/* 緊急聯絡人 */}
        <div className="col-md-6">
          <label className="form-label">緊急聯絡人</label>
          <input
            type="text"
            className="form-control"
            value={formData.emergencyContact}
            onChange={(e) => setFormData({...formData, emergencyContact: e.target.value})}
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">緊急聯絡人電話</label>
          <input
            type="tel"
            className="form-control"
            value={formData.emergencyPhone}
            onChange={(e) => setFormData({...formData, emergencyPhone: e.target.value})}
            required
          />
        </div>

        {/* 潛水經驗 */}
        <div className="col-12">
          <label className="form-label">潛水經驗</label>
          <select 
            className="form-select"
            value={formData.experience}
            onChange={(e) => setFormData({...formData, experience: e.target.value})}
          >
            <option value="none">無經驗</option>
            <option value="beginner">初學者（5次以下）</option>
            <option value="intermediate">中級（6-20次）</option>
            <option value="advanced">進階（20次以上）</option>
          </select>
        </div>

        {/* 特殊需求 */}
        <div className="col-12">
          <label className="form-label">特殊需求或備註</label>
          <textarea
            className="form-control"
            rows="3"
            value={formData.specialNeeds}
            onChange={(e) => setFormData({...formData, specialNeeds: e.target.value})}
          ></textarea>
        </div>

        <div className="col-12 text-end">
          <button type="submit" className="btn btn-primary">
            {activity.isLast ? "前往付款" : "下一個活動"}
          </button>
        </div>
      </div>
    </form>
  );
} 