"use client";

import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";

interface FilterCarouselProps {
  value?: string | null;
  isLoading?: boolean;
  onSelect: (value: string | null) => void;
  data: { value: string; label: string }[];
}

export const FilterCarousel = ({
  value,
  isLoading,
  onSelect,
  data,
}: FilterCarouselProps) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div className="relative w-full">
      <Carousel
        setApi={setApi}
        opts={{ align: "start", dragFree: true }}
        className="relative w-full px-1 md:px-12"
      >
        {/* LEFT FADE */}
        <div
          className={cn(
            "absolute inset-y-0 z-20 pointer-events-none",
            "left-0 md:left-12 w-6 md:w-10",
            "bg-linear-to-r from-white to-transparent",
            current === 1 && "hidden"
          )}
        />

        <CarouselContent className="-ml-2 md:-ml-3">
          {!isLoading && (
            <CarouselItem
              className="pl-2 md:pl-3 basis-auto"
              onClick={() => onSelect(null)}
            >
              <Badge
                variant={!value ? "default" : "secondary"}
                className="rounded-lg px-3 py-1 cursor-pointer whitespace-nowrap text-sm"
              >
                All
              </Badge>
            </CarouselItem>
          )}

          {isLoading &&
            Array.from({ length: 10 }).map((_, index) => (
              <CarouselItem
                key={index}
                className="pl-2 md:pl-3 basis-auto"
              >
                <Skeleton className="rounded-lg h-7 w-24" />
              </CarouselItem>
            ))}

          {!isLoading &&
            data.map((item) => (
              <CarouselItem
                key={item.value}
                className="pl-2 md:pl-3 basis-auto"
                onClick={() => onSelect(item.value)}
              >
                <Badge
                  variant={value === item.value ? "default" : "secondary"}
                  className="rounded-lg px-3 py-1 cursor-pointer whitespace-nowrap text-sm"
                >
                  {item.label}
                </Badge>
              </CarouselItem>
            ))}
        </CarouselContent>

        {/* RIGHT FADE */}
        <div
          className={cn(
            "absolute inset-y-0 z-20 pointer-events-none",
            "right-0 md:right-12 w-6 md:w-10",
            "bg-linear-to-l from-white to-transparent",
            current === count && "hidden"
          )}
        />

        {/* ARROWS */}
        <CarouselPrevious className="hidden md:flex left-0 z-30" />
        <CarouselNext className="hidden md:flex right-0 z-30" />
      </Carousel>
    </div>
  );
};
