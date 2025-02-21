import styles from "./group.module.css";

export default function group() {
  return (
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
            <div className={styles.ASother}>
              <h6 style={{ margin: 0 }}>我的訂單</h6>
            </div>
            <div className={styles.ASpoint}>
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
          <h4 style={{ fontWeight: 700, margin: 0 }}>我的揪團</h4>
        </div>
        <div className={styles.sectionTop}>
          <div className={styles.SThover}>
            <h6>全部</h6>
          </div>
          <div className={styles.STdefault}>
            <h6>已參加</h6>
          </div>
          <div className={styles.STdefault}>
            <h6>已發起</h6>
          </div>
          <div className={styles.STdefault}>
            <h6>已結束</h6>
          </div>
          <div className={styles.STdefault}>
            <h6>已取消</h6>
          </div>
        </div>
        {/* Repeat for each order section */}
        <div className={styles.sectionContent}>
          <div className={styles.SCcard}>
            <img src="/dc48b717dc65c863526fd471b4d2a2c7.jpg" alt="" />
            <div className={styles.SCtext}>
              <p>揪團名稱揪團名稱</p>
              <p>
                <span>
                  <i class="bi bi-at"></i>
                </span>
                浮潛
              </p>
              <p>
                <span>
                  <i class="bi bi-calendar"></i>
                </span>{" "}
                2025-01-10
              </p>
            </div>
          </div>
          <div className={styles.SCtextlf}>
            <p><span><i class="bi bi-person"></i></span> 不限性別</p>
            <p>參加人數 : 20</p>
            <h6>揪團截止 : 2025-01-07</h6>
          </div>
        </div>
        <div className={styles.sectionContent1}>
          <div className={styles.SCcard}>
            <img src="/dc48b717dc65c863526fd471b4d2a2c7.jpg" alt="" />
            <div className={styles.SCtext}>
              <p>揪團名稱揪團名稱</p>
              <p>
                <span>
                  <i class="bi bi-at"></i>
                </span>
                浮潛
              </p>
              <p>
                <span>
                  <i class="bi bi-calendar"></i>
                </span>{" "}
                2025-01-10
              </p>
            </div>
          </div>
          <div className={styles.SCtextlf}>
            <p><span><i class="bi bi-person"></i></span> 不限性別</p>
            <p>參加人數 : 20</p>
            <h6>揪團截止 : 2025-01-07</h6>
          </div>
        </div>
      </div>
    </div>
  );
}
