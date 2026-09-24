
"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

export function FadeIn({ children, className, delay = 0, yOffset = 30 }: { children: ReactNode, className?: string, delay?: number, yOffset?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SlideUp({ children, className, delay = 0 }: { children: ReactNode, className?: string, delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 150 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ type: "spring", stiffness: 50, damping: 15, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

