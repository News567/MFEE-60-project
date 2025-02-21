"use client";
import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import "./articleList.css";

export default function ArticleCard({ article }) {
  return (
    <div className="article-list-card">
      <div className="article-list-card-photo">
        <Image
          className="article-list-card-photo-img"
          src={
            article.img_url && article.img_url !== ""
              ? article.img_url
              : "/default-image.jpg"
          }
          alt="Article Thumbnail"
          layout="fill" // 使用 fill 使图片自动填充容器
          objectFit="cover" // 保持图片填充并裁剪
          objectPosition="center" // 确保图片居中
          priority // 提高图片加载优先级
        />
      </div>

      <div className="article-list-card-text">
        <div className="article-list-card-title">{article.title}</div>
        <div className="article-list-card-info">
          <div className="article-list-card-author">
            <span className="article-list-icon">
              {" "}
              <i className="fa-solid fa-user"></i>
            </span>

            {article.author_name}
          </div>
          <div className="article-list-card-publishtime">
            <span className="article-list-icon">
              {" "}
              <i className="fa-solid fa-calendar-days"></i>
            </span>

            {article.publish_at}
          </div>
          <div className="article-list-card-comment">
            <span className="article-list-icon">
              {" "}
              <i className="fa-regular fa-comment-dots"></i>
            </span>
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
    </div>
  );
}
