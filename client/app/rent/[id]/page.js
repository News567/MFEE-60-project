import RentDetail from "../components/RentDetail";

export default function RentPage( {params}) {
  const productId = params.productId;
  return <RentDetail productId={productId}/>;
}
