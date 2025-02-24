export default function ActivitySummary({ activities, currentIndex }) {
  // 計算總金額：數量 × 單價
  const totalAmount = activities.reduce((sum, act) => {
    // 確保使用數字進行計算
    const price = Number(act.price);
    const quantity = Number(act.quantity);
    return sum + price * quantity;
  }, 0);

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">活動摘要</h5>
      </div>
      <div className="card-body">
        <div className="activity-list">
          {activities.map((activity, index) => (
            <div
              key={activity.id}
              className={`activity-item ${
                index === currentIndex ? "active" : ""
              } ${index < currentIndex ? "completed" : ""}`}
            >
              <div className="activity-header">
                <span className="activity-number">{index + 1}</span>
                <h6 className="mb-0">{activity.name}</h6>
              </div>
              <div className="activity-details">
                <div className="detail-row">
                  <i className="bi bi-calendar"></i>
                  <span>{activity.date}</span>
                </div>
                <div className="detail-row">
                  <i className="bi bi-clock"></i>
                  <span>{activity.time}</span>
                </div>
                <div className="detail-row">
                  <i className="bi bi-geo-alt"></i>
                  <span>{activity.location}</span>
                </div>
                <div className="detail-row">
                  <i className="bi bi-people"></i>
                  <span>{activity.quantity} 人</span>
                </div>
                <div className="price">
                  NT$ {Number(activity.price).toLocaleString()} ×{" "}
                  {activity.quantity}
                </div>
              </div>
            </div>
          ))}
        </div>

        <hr />

        <div className="total-section">
          <div className="d-flex justify-content-between mb-2">
            <span>活動總金額</span>
            <span className="text-primary">
              NT$ {totalAmount.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
