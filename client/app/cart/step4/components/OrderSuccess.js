export default function OrderSuccess({ orderNumber }) {
  return (
    <div className="success-message">
      <div className="success-icon">
        <i className="bi bi-check-circle-fill"></i>
      </div>
      <h3 className="mt-3">訂單已成立</h3>
      <p className="text-muted">
        感謝您的訂購！您的訂單編號為：
        <span className="fw-bold text-primary">{orderNumber}</span>
      </p>
    </div>
  );
}