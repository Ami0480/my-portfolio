import React, { useState, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  MotionValue,
} from "motion/react";

const ImageWithFallback = ({ src, alt, className, style }: any) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      <img
        src={imgSrc}
        alt={alt}
        className={className}
        style={style}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setImgSrc(
            "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=800"
          );
          setIsLoading(false);
        }}
      />
    </div>
  );
};

const words = [
  "HTML",
  "CSS",
  "React",
  "Tailwind",
  "Figma",
  "Three.js",
  "Canva",
  "GSAP",
  "Vibe Coding",
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
  // Large hero item (top left)
  {
    id: 1,
    title: "Minimal Portfolio",
    image:
      "https://images.unsplash.com/photo-1748483720632-9d385e40c331?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    className: "col-span-1 md:col-span-5 md:col-start-2 mt-12",
  },
  // Medium item (top right)
  {
    id: 2,
    title: "E-commerce App",
    image:
      "https://images.unsplash.com/photo-1759505017950-25e0733b9e68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    className: "col-span-1 md:col-span-4 md:col-start-8 mt-24 p-2",
    speed: -0.06,
  },
  // Wide item (middle, full width)
  {
    id: 3,
    title: "Dashboard UI",
    image:
      "https://images.unsplash.com/photo-1735399976112-17508533c97a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    className: "col-span-1 md:col-span-4 md:col-start-3 mt-32",
    parallaxSpeed: 0.15,
  },
  // Medium vertical item (right side)
  {
    id: 4,
    title: "Creative Agency",
    image:
      "https://images.unsplash.com/photo-1762503203754-62c5a0c969d9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    className: "col-span-1 md:col-span-6 md:col-start-9 mt-64",
    parallaxSpeed: 0.07,
  },
  // Small square (left side)
  {
    id: 5,
    title: "Typography",
    image:
      "https://images.unsplash.com/photo-1738003667850-a2fb736e31b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    className: "col-span-1 md:col-span-4 md:col-start-2 mt-48 p-3",
    parallaxSpeed: 0.06,
  },
  // Medium horizontal (bottom center)
  {
    id: 6,
    title: "Mobile Finance",
    image:
      "https://images.unsplash.com/photo-1760597371674-c5a412f2ae01?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    className: "col-span-1 md:col-span-4 md:col-start-8 mt-96",
    parallaxSpeed: 0.05,
  },
];

const ProjectItem = ({
  project,
  scrollYProgress,
}: {
  project: any;
  scrollYProgress: MotionValue<number>;
}) => {
  // Enhanced parallax with refined speed differences for better visual hierarchy
  const getParallaxConfig = (className: string, id: number, title?: string) => {
    // Base speed differences with more pronounced variation
    let baseSpeed = 0.5;
    if (className.includes("md:col-span-6"))
      baseSpeed = 0.1; // Largest items move slowest
    else if (className.includes("md:col-span-5")) baseSpeed = 0.25;
    else if (className.includes("md:col-span-4")) baseSpeed = 0.4;

    // More significant variation based on project ID
    const idVariation = (id % 5) * 0.1;

    // Alternate direction and add some randomness
    const direction = id % 2 === 0 ? 1 : -1;

    // Custom speeds for specific projects
    if (title === "Minimal Portfolio") {
      return {
        speed: 0.15, // Slower speed for better visibility
        direction: 1, // Consistent upward direction
        scale: 1.2, // Slightly larger
      };
    }

    if (title === "E-commerce App") {
      return {
        speed: 0.5, // Medium-fast speed
        direction: -1,
        scale: 1.1,
      };
    }

    if (title === "Dashboard UI") {
      return {
        speed: 0.25, // Medium speed
        direction: -1, // Opposite direction for contrast
        scale: 1.1,
      };
    }

    if (title === "Creative Agency") {
      return {
        speed: 2.5,
        direction: -1,
        scale: 1.15,
      };
    }

    if (title === "Typography") {
      return {
        speed: 0.6, // Medium-fast speed
        direction: 1,
        scale: 1.2,
      };
    }

    if (title === "Mobile Finance") {
      return {
        speed: 0.4, // Medium speed
        direction: -1,
        scale: 1.1,
      };
    }

    return {
      speed: (baseSpeed + idVariation) * 1.5,
      direction,
      scale: 1 + (1 - baseSpeed) * 0.4,
    };
  };

  const { speed, direction, scale } = getParallaxConfig(
    project.className,
    project.id,
    project.title
  );

  // Parallax movement for cards only (bidirectional)
  const y = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [-100 * speed * direction, 0, 100 * speed * direction]
  );

  // Add subtle opacity change based on scroll position
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [0.8, 1, 1, 0.8]
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
      style={{
        y,
        opacity,
        zIndex: Math.round(100 * (1 - speed)), // Ensure proper stacking
      }}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.8,
          delay: 0.1 * (1 - speed), // Staggered appearance based on size
        },
      }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.3 },
      }}
      whileTap={{
        scale: 0.98,
        transition: { duration: 0.2 },
      }}
      className={`group cursor-pointer ${project.className} relative z-20`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 shadow-md hover:shadow-xl transition-all duration-700 relative z-20 will-change-transform transform-gpu">
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
      <div className="mt-6 text-center inline-block px-4 mx-auto w-full relative z-30">
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
    <section ref={containerRef} className="min-h-[220vh] relative pt-48 pb-80">
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

      <div className="container mx-auto px-6 relative z-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-y-48">
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
