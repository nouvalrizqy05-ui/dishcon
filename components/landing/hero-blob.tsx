
"use client";

import { motion, useScroll, useTransform } from "framer-motion";

export function HeroBlob() {
  const { scrollY } = useScroll();
  
  // Scale from 1 to 1.36 as user scrolls down 400px
  const scale = useTransform(scrollY, [0, 400], [1, 1.36]);

  return (
    <motion.div 
      style={{ scale }}
      className="absolute -top-12 -right-12 w-[350px] h-[350px] md:w-[500px] md:h-[500px] lg:w-[550px] lg:h-[550px] rounded-full bg-gradient-to-br from-brand-400 via-accent-500 to-orange-400 opacity-90 origin-center"
    />
  );
}

