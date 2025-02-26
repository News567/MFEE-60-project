export default function OrderSummary({ items }) {
  if (!items || !items.products) return null;

  return (
    <div className="order-summary">
      {/* 一般商品 */}
      {items.products.length > 0 && (
        <div className="product-section mb-4">
          <h6 className="section-title">一般商品</h6>
          {items.products.map((product) => (
            <div key={product.id} className="item-row">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="item-name">{product.name}</div>
                  <div className="item-spec text-muted">
                    {product.color} / {product.size}
                  </div>
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
    </div>
  );
}
