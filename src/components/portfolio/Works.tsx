import React, { useState, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  MotionValue,
} from "motion/react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

const words = [
  "HTML",
  "CSS",
  "React",
  "Tailwind",
  "Framer",
  "Figma",
  "Next.js",
  "Three.js",
  "Canvas",
  "WebGL",
  "GSAP",
  "Design",
  "UI/UX",
  "A11y",
];

const colors = [
  "bg-pink-500 text-white",
  "bg-purple-500 text-white",
  "bg-blue-500 text-white",
  "bg-cyan-500 text-white",
  "bg-emerald-500 text-white",
  "bg-amber-500 text-white",
  "bg-rose-500 text-white",
];

const positions = [
  { top: "20%", left: "15%" },
  { top: "15%", right: "20%" },
  { bottom: "25%", left: "15%" },
  { bottom: "20%", right: "15%" },
  { top: "50%", left: "50%" },
  { top: "30%", left: "70%" },
  { top: "70%", left: "30%" },
];

const projects = [
  {
    id: 1,
    title: "Minimal Portfolio",
    image:
      "https://images.unsplash.com/photo-1748483720632-9d385e40c331?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    className: "col-span-1 md:col-span-5 md:col-start-2 md:translate-y-0",
    parallaxSpeed: 0.05,
  },
  {
    id: 2,
    title: "E-commerce App",
    image:
      "https://images.unsplash.com/photo-1759505017950-25e0733b9e68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    className: "col-span-1 md:col-span-4 md:col-start-8 md:-translate-y-24",
    parallaxSpeed: -0.05,
  },
  {
    id: 3,
    title: "Dashboard UI",
    image:
      "https://images.unsplash.com/photo-1735399976112-17508533c97a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    className: "col-span-1 md:col-span-6 md:col-start-1 md:translate-y-12",
    parallaxSpeed: 0.08,
  },
  {
    id: 4,
    title: "Creative Agency",
    image:
      "https://images.unsplash.com/photo-1762503203754-62c5a0c969d9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    className: "col-span-1 md:col-span-4 md:col-start-8 md:translate-y-32",
    parallaxSpeed: -0.03,
  },
  {
    id: 5,
    title: "Typography System",
    image:
      "https://images.unsplash.com/photo-1738003667850-a2fb736e31b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    className: "col-span-1 md:col-span-4 md:col-start-4 md:-translate-y-10",
    parallaxSpeed: 0.04,
  },
  {
    id: 6,
    title: "Mobile Finance",
    image:
      "https://images.unsplash.com/photo-1760597371674-c5a412f2ae01?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    className: "col-span-1 md:col-span-4 md:col-start-9 md:translate-y-20",
    parallaxSpeed: 0.06,
  },
];

const ProjectItem = ({
  project,
  scrollYProgress,
}: {
  project: any;
  scrollYProgress: MotionValue<number>;
}) => {
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [0, project.parallaxSpeed * 1000]
  );
  const [hoverData, setHoverData] = useState<{
    text: string;
    color: string;
    pos: any;
  } | null>(null);

  const handleMouseEnter = () => {
    const randomWord = words[Math.floor(Math.random() * words.length)];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const randomPos = positions[Math.floor(Math.random() * positions.length)];

    setHoverData({
      text: randomWord,
      color: randomColor,
      pos: randomPos,
    });
  };

  const handleMouseLeave = () => {
    setHoverData(null);
  };

  return (
    <motion.div
      style={{ y }}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`group cursor-pointer ${project.className} relative z-20`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 shadow-md hover:shadow-xl transition-all duration-500 relative z-20">
        <ImageWithFallback
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        <AnimatePresence>
          {hoverData && (
            <div
              className="absolute z-30 pointer-events-none select-none"
              style={hoverData.pos}
            >
              <motion.div
                initial={{
                  width: 16,
                  height: 16,
                  borderRadius: 50,
                  opacity: 0,
                  scale: 0,
                }}
                animate={{
                  width: "auto",
                  height: "auto",
                  borderRadius: 20,
                  opacity: 1,
                  scale: 1,
                  transition: {
                    type: "spring",
                    stiffness: 300,
                    damping: 15,
                  },
                }}
                exit={{
                  opacity: 0,
                  scale: 0,
                  transition: { duration: 0.2 },
                }}
                className={`${hoverData.color} shadow-lg overflow-hidden flex items-center justify-center`}
              >
                <motion.span
                  initial={{ opacity: 0, y: 15 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: { delay: 0.1, duration: 0.2 },
                  }}
                  className="px-4 py-2 font-bold whitespace-nowrap text-sm"
                  style={{ fontFamily: "'DynaPuff', cursive" }}
                >
                  {hoverData.text}
                </motion.span>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
      <div className="mt-4 text-center bg-white/80 backdrop-blur-sm py-2 rounded-lg inline-block px-4 mx-auto w-full">
        <h3
          className="text-lg font-semibold text-gray-900"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          {project.title}
        </h3>
        <p
          className="text-xs text-gray-500 uppercase tracking-widest"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          Interactive Web
        </p>
      </div>
    </motion.div>
  );
};

export const Works = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Create a y-offset for the marquee based on scroll
  const marqueeY = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <section
      ref={containerRef}
      className="min-h-screen relative py-32 overflow-hidden"
    >
      {/* Background Marquee that moves with scroll */}
      <div className="absolute top-0 w-full left-0 h-full flex flex-col justify-center z-0 pointer-events-none select-none overflow-hidden">
        <motion.div style={{ y: marqueeY, zIndex: 0 }}>
          <motion.div
            className="absolute top-[70%] whitespace-nowrap will-change-transform"
            animate={{
              x: ["100vw", "-100%"],
            }}
            transition={{
              duration: 60,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {[...Array(8)].map((_, i) => (
              <span
                key={i}
                className="inline-block text-[12vw] font-bold leading-none mx-4 md:mx-8"
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  color: "#FFB7B2",
                  textShadow: "none",
                  opacity: 0.3,
                }}
              >
                WORK •
              </span>
            ))}
          </motion.div>
        </motion.div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-y-32">
          {projects.map((project) => (
            <ProjectItem
              key={project.id}
              project={project}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
