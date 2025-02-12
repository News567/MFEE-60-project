import RentDetailUI from './RentDetailUI'
import Image from 'next/image'
import React from 'react'
import '../../../../styles/rent-product.css'
import '@/styles/global.scss'

// 假設這是從 API 獲取的產品數據
const fetchProductData = async (id) => {
  // 這裡可以替換為實際的 API 請求
  const products = {
    1: {
      id: 1,
      brand: 'C4',
      name: 'PLASMA 低容積面鏡',
      pricePerDay: 145,
      description:
        '超耐磨鋼化玻璃，良好的視野和低內部容積<br>裙邊採柔軟矽膠製成，密合度佳<br>搭配同色系呼吸管，帥度再上一層',
      stock: 2,
      colors: ['#4d4244', '#403f6f', 'white', 'pink'],
      images: [
        '../../images/rent/1733124689_8081.jpg',
        '../../images/rent/1733124703_2778.jpg',
        '../../images/rent/1733124689_3585.jpg',
        '../../images/rent/1733124689_2281.jpg',
      ],
      rating: 4, // 評分（滿分5分）
      rules: [
        '租借本人出示潛水證',
        '租用需先付款，並提供個人證件一張',
        '完成租借表單並完成簽名',
        '如有遺失或損害，需修復原有狀況或是全新賠償',
        '租借與歸還時間限每日上午8:00至 下午5:00，過時則以多借一天計算',
        '以天計價，非24小時制度。例如: 12/18日下午2點租借，12/19下午2點歸還，則算兩天',
      ],
    },
  }
  return products[id] || null
}

// Server Component
const RentProductDetail = async ({ params }) => {
  const { id } = params
  const product = await fetchProductData(id)

  if (!product) {
    return (
      <div className="center-container d-flex flex-column">
        <Image
          src="/images/rent-product-not-found.png"
          alt="此商品不存在"
          className="m-3"
          width={300}
          height={193}
          priority
        />
        <button
          type="button"
          className="btn goBackBtn d-flex align-items-center justify-content-center mt-3 gap-2"
          // 設定router以後要回來修改導回租借商品列表
          // onClick={() => (window.location.href = '/rent/page.js')}
        >
          <i className="bi bi-arrow-left-circle"></i>返回租借商品列表
        </button>
      </div>
    )
  }

  // 將數據傳遞給 Client Component
  return <RentDetailUI product={product} />
}

export default RentProductDetail
