
import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

export const About = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const yContent = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <section ref={containerRef} className="min-h-[90vh] flex flex-col items-center justify-center relative z-10 px-6 py-20 bg-white/30 backdrop-blur-sm">
      <motion.div 
        style={{ y: yContent }}
        className="container mx-auto max-w-6xl"
      >
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-24">
          
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
                  scale: [1, 1.02, 0.98, 1]
                }}
                transition={{ 
                  duration: 10, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                className="absolute inset-0 bg-gradient-to-br from-pink-200 to-purple-200 opacity-50 rounded-[60%_40%_30%_70%/60%_30%_70%_40%] blur-2xl"
              />
              
              {/* Actual Image Container with Organic Shape */}
              <motion.div
                animate={{ 
                  borderRadius: [
                    "60% 40% 30% 70% / 60% 30% 70% 40%",
                    "30% 60% 70% 40% / 50% 60% 30% 60%",
                    "60% 40% 30% 70% / 60% 30% 70% 40%"
                  ]
                }}
                transition={{ 
                  duration: 8, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                className="relative w-full h-full overflow-hidden shadow-2xl border-4 border-white"
                style={{
                    borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%"
                }}
              >
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1696960181436-1b6d9576354e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
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
            
            <div className="space-y-8 text-lg md:text-xl text-gray-700 leading-relaxed font-light" style={{ fontFamily: "'Poppins', sans-serif" }}>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                Hi, I'm Ami. I create digital experiences that are as functional as they are beautiful. I believe the web should be fun, fluid, and friendly.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                My work sits at the intersection of design and engineering. I love experimenting with motion, interaction, and generative art to bring static interfaces to life.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                When I'm not coding, you can find me exploring new coffee shops or sketching out new ideas for my next creative coding project.
              </motion.p>
            </div>
          </div>

        </div>
      </motion.div>
    </section>
  );
};
