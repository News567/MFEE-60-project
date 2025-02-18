"use client";
import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import "./articleList.css";

export default function ArticleCard({ article }) {
  return (
    <div className="article-list-card">
      <Image
        className="article-list-card-photo"
        src={
          article.img_url && article.img_url !== ""
            ? article.img_url
            : "/default-image.jpg"
        } // 當 image 為空時顯示預設圖片
        alt="Article Thumbnail"
        width={400}
        height={300}
        priority
      />
      <div className="article-list-card-title">{article.title}</div>
      <div className="article-list-card-info">
        <div className="article-list-card-author">
          <i className="fa-solid fa-user"></i>
          {article.author_name}
        </div>
        <div className="article-list-card-publishtime">
          <i className="fa-solid fa-calendar-days"></i>
          {article.publish_at}
        </div>
        <div className="article-list-card-comment">
          <i className="fa-regular fa-comment-dots"></i>
          {article.reply_count} 則評論
        </div>
      </div>
      <div className="article-list-card-content">{article.content}</div>
      <div className="article-list-card-btn">
        <Link href={`/article/${article.id}`} passHref>
          <button className="btn">更多</button>
        </Link>
      </div>
    </div>
  );
}
