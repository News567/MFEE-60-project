export default function PaymentInfo({ payment }) {
  return (
    <div className="payment-info">
      <div className="row">
        <div className="col-md-6">
          <div className="info-group">
            <label className="text-muted">付款方式</label>
            <div>{payment.method}</div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="info-group">
            <label className="text-muted">付款狀態</label>
            <div className="text-success">{payment.status}</div>
          </div>
        </div>
        {payment.cardLast4 && (
          <div className="col-12 mt-3">
            <div className="info-group">
              <label className="text-muted">信用卡末四碼</label>
              <div>**** **** **** {payment.cardLast4}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}