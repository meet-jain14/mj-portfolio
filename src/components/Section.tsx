"use client";

import { motion } from "framer-motion";

type Props = {
    id?: string;
    title?: string;
    subtitle?: string;
    children: React.ReactNode;
  };
  
  export default function Section({
    id,
    title,
    subtitle,
    children,
  }: Props) {
    return (
      <motion.section
        id={id}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="relative py-32 md:py-40"
      >
        <div className="mb-16">
          {subtitle && (
            <p className="mb-4 text-sm uppercase tracking-[0.3em] text-[#00ffae]">
              {subtitle}
            </p>
          )}
  
          {title && (
            <h2 className="max-w-4xl text-4xl font-bold leading-[0.95] tracking-[-0.04em] md:text-6xl">
              {title}
            </h2>
          )}
        </div>
  
        {children}
      </motion.section>
    );
  }