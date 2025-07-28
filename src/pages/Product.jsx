import React, { useContext } from "react";
import { Shopcontext } from "../context/Shopcontext";
import { useParams } from "react-router-dom";
import Breadcrums from "../components/breadcrums/Breadcrums";
import Productdisplay from "../components/productdisplay/Productdisplay";
import Descriptionbox from "../components/descriptionbox/Descriptionbox";
import Relatedproducts from "../components/relatedproducts/Relatedproducts";

const Product = () => {
  const { all_product } = useContext(Shopcontext);
  const { productId } = useParams();
  const product = all_product.find((e) => e.id === Number(productId));
  return (
    <div>
      <Breadcrums product={product} />
      <Productdisplay product={product} />
      <Descriptionbox />
      <Relatedproducts />
    </div>
  );
};

export default Product;
