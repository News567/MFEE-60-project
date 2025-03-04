const CouponSortPagination = () => {
    return (
      <div className="d-flex justify-content-between align-items-center my-4">
        <div className="pagination">顯示 第1頁 / 共6頁</div>
        <div className="d-flex align-items-center">
          <span>排序</span>
          <select className="form-select form-select-sm rounded-pill custom-select-container">
            <option value="latest">最新</option>
            <option value="expiry">即將到期</option>
            <option value="discount">最高折扣</option>
          </select>
        </div>
      </div>
    );
  };
  export default CouponSortPagination;
  