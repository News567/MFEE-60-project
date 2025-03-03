"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../components/sidebar";
import ArticleForm from "../components/articleForm"; // 引入表單組件
import "../components/articleCreate.css";

export default function ArticleCreate() {
  return (
    <div className="container mt-4">
      <div className="row">
        <Sidebar />
        <div className="article-create col-9">
          <ArticleForm />
        </div>
      </div>
    </div>
  );
}
