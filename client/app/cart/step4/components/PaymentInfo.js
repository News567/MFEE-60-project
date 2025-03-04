export default function PaymentInfo({ payment }) {
  if (!payment) return null;

  return (
    <div className="payment-info">
      <div className="row">
        <div className="col-md-6">
          <div className="info-group">
            <label className="text-muted">付款方式</label>
            <div>{payment.methodText}</div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="info-group">
            <label className="text-muted">付款狀態</label>
            <div className="text-success">{payment.statusText}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
