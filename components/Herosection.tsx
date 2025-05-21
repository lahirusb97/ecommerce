"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";

const slides = [
  {
    src: "/img1.jpg",
    alt: "Trendy Women's Collection",
    title: "Refresh Your Look",
    desc: "Step into the season’s hottest styles. Shop new arrivals for every mood.",
    align: "center",
  },
  {
    src: "/img2.jpg",
    alt: "Latest Men's Sets",
    title: "Upgrade His Wardrobe",
    desc: "From casual to smart, discover the best picks for men, only here.",
    align: "center",
  },
  {
    src: "/img3.jpeg",
    alt: "Elegant Looks for Her",
    title: "Make Every Day Stylish",
    desc: "Unique designs for modern women. See our new curated collections.",
    align: "left",
  },
];

export function HeroCarousel() {
  return (
    <section className="relative w-full max-w-full mb-2">
      <Carousel className="w-full">
        <CarouselContent>
          {slides.map((slide, index) => (
            <CarouselItem key={index} className="w-full">
              <div className="relative w-full h-[68vw] min-h-[340px] max-h-[560px] md:h-[420px] lg:h-[540px] rounded-none overflow-hidden flex">
                {/* Slide image */}
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  priority={index === 0}
                  className="object-cover w-full h-full"
                  sizes="(max-width: 768px) 100vw, 100vw"
                />
                {/* Overlay for text */}
                <div
                  className={`
                    absolute top-0 left-0 w-full h-full 
                    flex 
                    ${
                      slide.align === "left"
                        ? "items-center justify-start"
                        : "items-center justify-center"
                    }
                    bg-black/20
                  `}
                >
                  <Card
                    className={`
                      bg-white/80 shadow-lg border-0
                      ${
                        slide.align === "left"
                          ? "ml-4 md:ml-16 max-w-xs md:max-w-md"
                          : "mx-auto max-w-xs md:max-w-md"
                      }
                      my-4 md:my-0 p-4 md:p-8
                    `}
                  >
                    <CardContent className="p-0 flex flex-col gap-2">
                      <h2 className="text-lg md:text-2xl font-bold text-blue-900 mb-2">
                        {slide.title}
                      </h2>
                      <p className="text-sm md:text-base text-gray-700">
                        {slide.desc}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10" />
      </Carousel>
    </section>
  );
}
