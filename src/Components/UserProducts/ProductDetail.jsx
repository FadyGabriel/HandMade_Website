import { useState } from "react";
import CardDetails from "./CardDetails";
import Recommendation from "./recommendation";
import UserNavbar from "../UserNavbar/UserNavbar";
export default function ProductDetail() {
  const [category, setCategory] = useState(null);
  const [productId, setProductId] = useState(null);
  return (
    <>
    <UserNavbar/>
      <CardDetails
        onCategoryFetched={setCategory}
        onProductIdFetched={setProductId}
      />
      <Recommendation category={category} excludeId={productId} />
    </>
  );
}
