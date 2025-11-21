import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

import ProfilePhoto from "../images/portfolio-photo.png";

export const About = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const yContent = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <section
      ref={containerRef}
      className="min-h-[90vh] flex flex-col items-center justify-center relative z-10"
    >
      <motion.div
        style={{ y: yContent }}
        className="container mx-auto max-w-6xl"
      >
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-24 relative">
          {/* Image Column */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full md:w-1/2 flex justify-center md:justify-end"
          >
            <div className="relative w-64 h-64 md:w-96 md:h-96">
              {/* Blob Background */}
              <motion.div
                animate={{
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.02, 0.98, 1],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 bg-gradient-to-br from-pink-200 to-purple-200 opacity-50 rounded-[60%_40%_30%_70%/60%_30%_70%_40%] blur-2xl"
              />

              {/* Actual Image Container with Organic Shape */}
              <motion.div
                animate={{
                  borderRadius: [
                    "60% 40% 30% 70% / 60% 30% 70% 40%",
                    "30% 60% 70% 40% / 50% 60% 30% 60%",
                    "60% 40% 30% 70% / 60% 30% 70% 40%",
                  ],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative w-full h-full overflow-hidden shadow-2xl border-4 border-white"
                style={{
                  borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%",
                }}
              >
                <ImageWithFallback
                  src={ProfilePhoto}
                  alt="Ami Portrait"
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </div>
          </motion.div>

          {/* Text Column */}
          <div className="w-full md:w-1/2 text-center md:text-left">
            <motion.h2
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-5xl md:text-6xl font-bold mb-10 text-gray-900"
              style={{ fontFamily: "'DynaPuff', cursive" }}
            >
              About Me
            </motion.h2>

            <div
              className="space-y-8 text-lg md:text-lg text-gray-700 leading-relaxed font-light"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                Hi, I'm Ami Fukuyama, originally from Himeji, Japan, and I've
                been living in Australia for over 10 years.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                After a career in beauty therapy and management, I discovered a
                passion for tech and problem-solving. I'm learning programming
                through SheCodes, focusing on front-end development while
                exploring back-end to become a full-stack developer. I'm also
                interested in Vibe Coding and creative tools that make web
                development more dynamic.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                I'm open to on-site and remote opportunities and excited to
                contribute to projects where I can grow. Outside of work, I love
                traveling and exploring the history of different countries,
                having visited over 20 so far. I also enjoy sharing my stories
                and experiences through my projects.
              </motion.p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
