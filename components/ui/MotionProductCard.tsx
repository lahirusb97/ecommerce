import { ProductCard, ProductCardProps } from "@/components/ProductCard";
import { motion } from "framer-motion";

export function MotionProductCard({
  product,
}: {
  product: ProductCardProps["product"];
}) {
  return (
    <motion.div
      whileHover={{ y: -20, scale: 1.03 }}
      className="group/product h-96 w-72 relative shrink-0"
    >
      <ProductCard product={product} />
    </motion.div>
  );
}
