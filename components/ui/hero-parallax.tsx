"use client";
import React from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { ProductCardProps } from "../ProductCard";
import { MotionProductCard } from "./MotionProductCard";

export const HeroParallax = ({
  products,
}: {
  products: ProductCardProps["product"][]; // Accepts your real products
}) => {
  const firstRow = products.slice(0, 5);
  const secondRow = products.slice(5, 10);
  const thirdRow = products.slice(10, 15);

  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [15, 0]),
    springConfig
  );
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0.2, 1]),
    springConfig
  );
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [20, 0]),
    springConfig
  );
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [-700, 0]),
    springConfig
  );
  return (
    <div
      ref={ref}
      className="h-[300vh] py-40 overflow-hidden antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d]"
    >
      <Header />
      <motion.div style={{ rotateX, rotateZ, translateY, opacity }}>
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-10 mb-20">
          {firstRow.map((product) => (
            <MotionProductCard product={product} key={product.id} />
          ))}
        </motion.div>
        <motion.div className="flex flex-row mb-20 space-x-10">
          {secondRow.map((product) => (
            <MotionProductCard product={product} key={product.id} />
          ))}
        </motion.div>
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-10">
          {thirdRow.map((product) => (
            <MotionProductCard product={product} key={product.id} />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export const Header = () => {
  return (
    <div className="max-w-7xl relative mx-auto py-10 md:py-20 px-4 w-full left-0 top-0 z-10">
      <h1 className="relative text-3xl md:text-7xl font-extrabold text-center leading-tight dark:text-white drop-shadow-lg mb-2">
        <span className="text-primary underline underline-offset-8 decoration-4 decoration-primary">
          Style District
        </span>
        <br />
        <span className="text-neutral-800 dark:text-white">
          Apparel & Fashion Hub
        </span>
      </h1>
      <p className="max-w-2xl mx-auto text-base md:text-xl mt-6 text-center text-neutral-700 dark:text-neutral-200">
        Discover the latest trends, timeless classics, and must-have styles for
        every season.
        <br />
        <span className="font-semibold text-primary">
          Shop exclusive collections, bold designs, and everyday essentials—all
          in one place.
        </span>
      </p>
    </div>
  );
};
