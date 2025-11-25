import { useState, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  MotionValue,
} from "motion/react";

import FindRecipes from "../images/findrecipes-image.png";
import MDB from "../images/mdb-image.png";
import NatureSpa from "../images/naturespa-image.png";
import PeekAZoo from "../images/peekazoo-image.png";
import StoneStreet from "../images/stonestreet-image.png";
import SearchWeather from "../images/weather-image.png";

// Import background images
import pink from "../images/pink.png";
import mustard from "../images/mustard.png";
import lime from "../images/lime.png";
import orange from "../images/orange.png";
import yellow from "../images/yellow.png";
import blue from "../images/blue.png";
import green from "../images/green.png";
import gray from "../images/gray.png";
import purple from "../images/purple.png";

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

const wordBackgrounds = [
  { word: "HTML", bg: blue },
  { word: "CSS", bg: gray },
  { word: "JavaScript", bg: lime },
  { word: "Tailwind", bg: green },
  { word: "React", bg: yellow },
  { word: "Figma", bg: purple },
  { word: "Canva", bg: pink },
  { word: "Self Built", bg: mustard },
  { word: "Vibe Coding", bg: orange },
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
    title: "Find Recipes",
    image: FindRecipes,
    link: "https://find-recipes-project.netlify.app/",
    className: "col-span-1 md:col-span-5 md:col-start-2 mt-12",
    tags: ["HTML", "CSS", "JavaScript", "Tailwind", "React", "Vibe Coding"],
  },
  {
    id: 2,
    title: "Movies Database",
    image: MDB,
    className: "col-span-1 md:col-span-4 md:col-start-8 mt-24 p-2",
    tags: ["HTML", "CSS", "JavaScript", "Tailwind", "React", "Vibe Coding"],
  },
  {
    id: 3,
    title: "Spa Booking Website",
    image: NatureSpa,
    className: "col-span-1 md:col-span-4 md:col-start-3 mt-32",
    tags: [
      "HTML",
      "CSS",
      "JavaScript",
      "Tailwind",
      "React",
      "Figma",
      "Canva",
      "Self Built",
    ],
  },
  {
    id: 4,
    title: "Smash Game",
    image: PeekAZoo,
    className: "col-span-1 md:col-span-6 md:col-start-9 mt-64",
    tags: ["HTML", "CSS", "JavaScript", "Self Built"],
  },
  {
    id: 5,
    title: "Cafe Website",
    image: StoneStreet,
    className: "col-span-1 md:col-span-4 md:col-start-2 mt-48 p-3",
    tags: [
      "HTML",
      "CSS",
      "JavaScript",
      "Tailwind",
      "React",
      "Figma",
      "Canva",
      "Self Built",
    ],
  },
  {
    id: 6,
    title: "Search Weather",
    image: SearchWeather,
    className: "col-span-1 md:col-span-4 md:col-start-8 mt-96",
    tags: [
      "HTML",
      "CSS",
      "JavaScript",
      "Tailwind",
      "React",
      "Figma",
      "Canva",
      "Self Built",
    ],
  },
];

const ProjectItem = ({
  project,
  scrollYProgress,
}: {
  project: any;
  scrollYProgress: MotionValue<number>;
}) => {
  const getParallaxConfig = (className: string, id: number) => {
    let baseSpeed = 0.5;
    if (className.includes("md:col-span-6")) baseSpeed = 0.1;
    else if (className.includes("md:col-span-5")) baseSpeed = 0.25;
    else if (className.includes("md:col-span-4")) baseSpeed = 0.4;

    const idVariation = (id % 5) * 0.1;
    const direction = id % 2 === 0 ? 1 : -1;

    return {
      speed: (baseSpeed + idVariation) * 1.5,
      direction,
    };
  };

  const { speed, direction } = getParallaxConfig(project.className, project.id);

  const y = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [-100 * speed * direction, 0, 100 * speed * direction]
  );

  const opacity = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [0.8, 1, 1, 0.8]
  );

  const [tags, setTags] = useState<
    Array<{
      id: number;
      text: string;
      bg: string;
      x: number;
      y: number;
    }>
  >([]);
  const [isHovering, setIsHovering] = useState(false);
  const usedTagsRef = useRef<Set<string>>(new Set());
  const tagIdRef = useRef(0);
  const lastSpawnTimeRef = useRef(0);
  const lastPosRef = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const getNextTag = () => {
    const availableTags = project.tags.filter(
      (tag: string) =>
        wordBackgrounds.some((wb) => wb.word === tag) &&
        !usedTagsRef.current.has(tag)
    );

    // Reset if all tags have been used
    if (availableTags.length === 0) {
      usedTagsRef.current.clear();
      return getNextTag();
    }

    const randomTag =
      availableTags[Math.floor(Math.random() * availableTags.length)];
    const bgData = wordBackgrounds.find((wb) => wb.word === randomTag);

    if (bgData) {
      usedTagsRef.current.add(randomTag);
      return {
        text: randomTag,
        bg: bgData.bg,
      };
    }
    return null;
  };

  const isPositionValid = (x: number, y: number, existingTags: typeof tags) => {
    const tagWidth = 90;
    const tagHeight = 65;
    const padding = 20;

    if (!containerRef.current) return false;

    const rect = containerRef.current.getBoundingClientRect();

    // Check boundaries
    if (
      x < tagWidth / 2 + padding ||
      x > rect.width - tagWidth / 2 - padding ||
      y < tagHeight / 2 + padding ||
      y > rect.height - tagHeight / 2 - padding
    ) {
      return false;
    }

    // Check overlap with existing tags
    for (const tag of existingTags) {
      const distance = Math.sqrt(
        Math.pow(x - tag.x, 2) + Math.pow(y - tag.y, 2)
      );
      if (distance < 100) {
        // Minimum distance between tags
        return false;
      }
    }

    return true;
  };

  const findValidPosition = (
    targetX: number,
    targetY: number,
    existingTags: typeof tags
  ) => {
    // Try the target position first
    if (isPositionValid(targetX, targetY, existingTags)) {
      return { x: targetX, y: targetY };
    }

    // Try positions in a spiral around the target
    const angles = [0, 45, 90, 135, 180, 225, 270, 315];
    const distances = [60, 100, 140];

    for (const distance of distances) {
      for (const angle of angles) {
        const rad = angle * (Math.PI / 180);
        const x = targetX + Math.cos(rad) * distance;
        const y = targetY + Math.sin(rad) * distance;

        if (isPositionValid(x, y, existingTags)) {
          return { x, y };
        }
      }
    }

    return null;
  };

  const addNewTag = (x: number, y: number) => {
    const newTagData = getNextTag();
    if (!newTagData) return;

    const position = findValidPosition(x, y, tags);
    if (!position) return;

    const newTagId = tagIdRef.current++;

    setTags((prev) => [
      ...prev,
      {
        id: newTagId,
        ...newTagData,
        ...position,
      },
    ]);

    // Remove this specific tag after fade duration
    setTimeout(() => {
      setTags((prev) => prev.filter((tag) => tag.id !== newTagId));
    }, 1800);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isHovering) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    lastPosRef.current = { x, y };

    // Spawn tags based on time interval
    const now = Date.now();
    if (now - lastSpawnTimeRef.current > 400) {
      addNewTag(x, y);
      lastSpawnTimeRef.current = now;
    }
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsHovering(true);
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    lastPosRef.current = { x, y };
    lastSpawnTimeRef.current = Date.now();

    // Add first tag at entry point
    addNewTag(x, y);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setTags([]);
    usedTagsRef.current.clear();
    lastSpawnTimeRef.current = 0;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.8,
          delay: 0.1 * (1 - speed),
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
      className={`group cursor-pointer ${project.className} relative`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      <div className="w-full aspect-[4/3] rounded-2xl overflow-visible bg-gray-100 shadow-md hover:shadow-xl transition-all duration-700 relative will-change-transform transform-gpu">
        <div
          ref={containerRef}
          className="w-full h-full rounded-2xl overflow-hidden relative"
        >
          <ImageWithFallback
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />

          <AnimatePresence>
            {tags.map((tag) => (
              <motion.div
                key={tag.id}
                className="absolute pointer-events-none select-none"
                initial={{
                  opacity: 0,
                  scale: 0.6,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.6,
                }}
                transition={{
                  opacity: { duration: 0.6, ease: "easeInOut" },
                  scale: { duration: 0.5, ease: "easeOut" },
                }}
                style={{
                  left: tag.x,
                  top: tag.y,
                  translateX: "-50%",
                  translateY: "-50%",
                  zIndex: 50,
                }}
              >
                <div
                  className="px-4 py-3 rounded-xl flex items-center justify-center shadow-lg"
                  style={{
                    backgroundImage: `url(${tag.bg})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    minWidth: "90px",
                    height: "85px",
                  }}
                >
                  <span
                    className="font-bold whitespace-nowrap text-sm"
                    style={{ fontFamily: "'DynaPuff', cursive" }}
                  >
                    {tag.text}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <div className="text-center inline-block px-4 mx-auto w-full relative z-30">
        <h3
          className="text-lg font-semibold text-gray-900 mt-4"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          {project.title}
        </h3>
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

  const marqueeY = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <section ref={containerRef} className="min-h-[220vh] relative pt-48 pb-80">
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
