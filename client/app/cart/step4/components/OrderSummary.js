export default function OrderSummary({ items }) {
  const { products, activities, rentals } = items;

  return (
    <div className="order-summary">
      {/* 一般商品 */}
      {products.length > 0 && (
        <div className="product-section mb-4">
          <h6 className="section-title">一般商品</h6>
          {products.map(product => (
            <div key={product.id} className="item-row">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="item-name">{product.name}</div>
                  <div className="item-spec text-muted">{product.specs}</div>
                </div>
                <div className="text-end">
                  <div>NT$ {product.price}</div>
                  <small className="text-muted">x{product.quantity}</small>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 活動商品 */}
      {activities.length > 0 && (
        <div className="activity-section mb-4">
          <h6 className="section-title">活動商品</h6>
          {activities.map(activity => (
            <div key={activity.id} className="item-row">
              <div className="activity-info">
                <div className="item-name">{activity.name}</div>
                <div className="item-detail text-muted">
                  活動時間：{activity.date} {activity.time}
                </div>
                <div className="participants mt-2">
                  {activity.participants.map((p, index) => (
                    <div key={index} className="participant-info">
                      <small>
                        參與者：{p.name} ({p.phone})
                      </small>
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-end mt-2">
                <div>NT$ {activity.price}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 租賃商品 */}
      {rentals.length > 0 && (
        <div className="rental-section">
          <h6 className="section-title">租賃商品</h6>
          {rentals.map(rental => (
            <div key={rental.id} className="item-row">
              <div className="rental-info">
                <div className="item-name">{rental.name}</div>
                <div className="item-detail text-muted">
                  租賃期間：{rental.startDate} ~ {rental.endDate}
                </div>
                <div className="rental-price d-flex justify-content-between mt-2">
                  <span>租金：NT$ {rental.rentalFee}</span>
                  <span>押金：NT$ {rental.deposit}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}