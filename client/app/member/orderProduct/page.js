import styles from '../order.module.css';

export default function orderProduct() {
    return(
<div className={styles.content}>
      <div className={styles.aside}>
        <div className={styles.listBox}>
          <div className={styles.asideTitle}>
            <h5 style={{ margin: 0 }}>會員中心</h5>
          </div>
          <div className={styles.asideContent}>
            <div className={styles.ASother}>
              <h6 style={{ margin: 0 }}>我的帳戶</h6>
            </div>
            <div className={styles.ASpoint}>
              <h6 style={{ margin: 0 }}>我的訂單</h6>
              <i className="bi bi-chevron-down"></i>
            </div>
            <div className={styles.ASpointList}>
              <h6 style={{ margin: 0 }}>商品清單</h6>
            </div>
            <div className={styles.ASpointList1}>
              <h6 style={{ margin: 0 }}>活動清單</h6>
            </div>
            <div className={styles.ASpointList1}>
              <h6 style={{ margin: 0 }}>租借清單</h6>
            </div>
            <div className={styles.ASother}>
              <h6 style={{ margin: 0 }}>我的揪團</h6>
            </div>
            <div className={styles.ASother}>
              <h6 style={{ margin: 0 }}>我的最愛</h6>
            </div>
            <div className={styles.ASother}>
              <h6 style={{ margin: 0 }}>我的優惠券</h6>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.main}>
        <div className={styles.mainTitle}>
          <h4 style={{ fontWeight: 700, margin: 0 }}>我的訂單</h4>
          <div className={styles.MTside}>
            <p style={{ margin: 0 }}>我的訂單</p>
            <i className="bi bi-chevron-right"></i>
            <p style={{ margin: 0 }}>商品清單</p>
          </div>
        </div>
        <div className={styles.sectionTop}>
          <div className={styles.SThover}>
            <h6>全部</h6>
          </div>
          <div className={styles.STdefault}>
            <h6>待收貨</h6>
          </div>
          <div className={styles.STdefault}>
            <h6>已完成</h6>
          </div>
          <div className={styles.STdefault}>
            <h6>取消</h6>
          </div>
        </div>
        {/* Repeat for each order section */}
        <div className={styles.sectionContent}>
          <div className={styles.SCtitle}>
            <div className={styles.neiwen}>
              <input type="checkbox" id="toggleCheckbox" />
              <p>2025-01-19</p>
              <p>訂單號：2349023948203</p>
            </div>
            <div className={styles.biaoqian}>
              <p style={{ color: '#219EBC', fontWeight: '600' }}>已完成</p>
              <div className={styles.line3}></div>
              <i className="bi bi-trash-fill"></i>
            </div>
          </div>
          <div className={styles.SCcontent}>
            {/* Repeat for each product box */}
            <div className={styles.productBox}>
              <div className={styles.PBcard}>
                <img src="/dc48b717dc65c863526fd471b4d2a2c7.jpg" alt="" />
                <div className={styles.cardContent}>
                  <p style={{ color: '#898989' }}>APORO</p>
                  <p>BIO METAL PRO 手工拋光鏡框(經典海龍王)</p>
                  <p style={{ color: '#898989' }}>規格: 白色</p>
                  <p>x1</p>
                </div>
              </div>
              <div className={styles.price}>
                <p style={{ textDecoration: 'line-through', color: '#898989' }}>$1000</p>
                <p style={{ color: '#219EBC' }}>$899</p>
              </div>
            </div>
          </div>
          <div className={styles.sectionfooter}>
            <div className={styles.SFbtn}>
              <div className={styles.hvbtn}>再買一次</div>
              <div className={styles.dfbtn}>聯絡賣家</div>
            </div>
            <div className={styles.ttlprice}>
              <p style={{ color: '#898989' }}>訂單金額 :</p>
              <h5 style={{ color: '#219EBC', fontWeight: 700 }}>$1798</h5>
            </div>
          </div>
        </div>
      </div>
    </div>
    );
};