import styles from "./account.module.css";

export default function Account() {
  return (
    <>
      <div className={styles.content}>
        <div className={styles.aside}>
          <div className={styles.listBox}>
            <div className={styles.asideTitle}>
              <h5>會員中心</h5>
            </div>
            <div className={styles.asideContent}>
              <div className={styles.ASpoint}>
                <h6>我的帳戶</h6>
                <i className="bi bi-chevron-down" aria-label="Expand"></i>
              </div>
              <div className={styles.ASpointList}>
                <h6>個人資料</h6>
              </div>
              <div className={styles.ASother}>
                <h6>我的訂單</h6>
              </div>
              <div className={styles.ASother}>
                <h6>我的揪團</h6>
              </div>
              <div className={styles.ASother}>
                <h6>我的最愛</h6>
              </div>
              <div className={styles.ASother}>
                <h6>我的優惠券</h6>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.main}>
          <div className={styles.mainTitle}>
            <h4>我的帳戶</h4>
            <div className={styles.MTside}>
              <p>我的帳戶</p>
              <i className="bi bi-chevron-right" aria-label="Next"></i>
              <p>個人資料</p>
            </div>
          </div>
          <div className={styles.sectionList}>
            <div className={styles.infoBox}>
              <div className={styles.IBlist}>
                <div className={styles.IBLTitle}>
                  <p>使用者帳號</p>
                  <p>姓名</p>
                  <p>生日</p>
                  <p>手機號碼</p>
                  <p>Email</p>
                  <p>地址</p>
                  <p>性別</p>
                  <p>緊急連絡人</p>
                  <p>緊急連絡人電話</p>
                </div>
                <div className={styles.IBLcontent}>
                  <div className={`${styles.box1} ${styles.boxSame}`}>
                    <p>使用者帳號</p>
                  </div>
                  <div className={`${styles.box2} ${styles.boxSame}`}>
                    <p>姓名</p>
                  </div>
                  <div className={`${styles.box2} ${styles.boxSame}`}>
                    <p>生日</p>
                  </div>
                  <div className={`${styles.box1} ${styles.boxSame}`}>
                    <p>手機號碼</p>
                  </div>
                  <div className={`${styles.box3} ${styles.boxSame}`}>
                    <p>Email</p>
                  </div>
                  <div className={`${styles.box3} ${styles.boxSame}`}>
                    <p>地址</p>
                  </div>
                  <div className={styles.box4}>
                    <div className={styles.boxlist}>
                      <i className="bi bi-0-circle" aria-label="Male"></i>
                      <p>男性</p>
                      <i className="bi bi-0-circle" aria-label="Female"></i>
                      <p>女性</p>
                      <i className="bi bi-0-circle" aria-label="Other"></i>
                      <p>其他</p>
                    </div>
                  </div>
                  <div className={`${styles.box2} ${styles.boxSame}`}>
                    <p>緊急連絡人</p>
                  </div>
                  <div className={`${styles.box1} ${styles.boxSame}`}>
                    <p>緊急連絡人電話</p>
                  </div>
                </div>
              </div>
              <div className={`${styles.IBbtn}`}>
                  <div className={`${styles.hvbtn}`}>變更</div>
                  <div className={`${styles.dfbtn}`}>取消</div>
                </div>
            </div>
            <div className={styles.line2}></div>

            <div className={styles.infoBox2}>
              <div className={styles.iflist2}>
                <div className={styles.circle}></div>
                <div className={styles.ifcontent}>
                  <p>user1</p>
                  <p>OO等級 - 88/100</p>
                  <p>user1@test.com</p>
                  <div className={styles.dfbtn2}>選擇圖片</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
