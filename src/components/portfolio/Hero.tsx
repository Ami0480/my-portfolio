import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

export const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const yText = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacityText = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const letters = Array.from("Ami");

  return (
    <section
      ref={containerRef}
      className="min-h-screen flex flex-col items-center justify-center relative z-10 px-4 text-center pointer-events-none"
    >
      <motion.div
        style={{ y: yText, opacity: opacityText }}
        className="flex flex-col items-center pointer-events-auto"
      >
        {/* Title with Gradient and Individual Letter Bounce */}
        <motion.div className="relative cursor-default flex items-center justify-center">
          <div className="inline-flex py-8 px-4">
            {letters.map((letter, i) => (
              <motion.h1
                key={i}
                whileHover={{
                  y: -20,
                  scale: 1.1,
                  rotate: i % 2 === 0 ? 5 : -5, // Slight tilt for playfulness
                  transition: { type: "spring", stiffness: 400, damping: 10 },
                }}
                className="text-8xl md:text-9xl font-bold mb-0 select-none origin-bottom cursor-pointer bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500"
                style={{
                  fontFamily: "'DynaPuff', cursive",
                  backgroundSize: "300% 100%",
                  backgroundPosition:
                    i === 0 ? "0% 50%" : i === 1 ? "50% 50%" : "100% 50%",
                }}
              >
                {letter}
              </motion.h1>
            ))}
          </div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-xl md:text-2xl font-medium text-gray-600 mb-8 tracking-widest uppercase"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          Front-end Developer
        </motion.h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10"
      >
        <span className="text-gray-500 text-sm animate-bounce block font-medium">
          Scroll to explore
        </span>
      </motion.div>
    </section>
  );
};
