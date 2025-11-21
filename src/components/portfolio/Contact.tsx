import React from "react";
import { Github, Linkedin, Mail, FileText, Twitter } from "lucide-react";
import { motion } from "motion/react";

export const Contact = () => {
  const letters = Array.from("Ami");

  return (
    <footer className="relative z-10 py-16 bg-gradient-to-t from-pink-100/80 to-white/0 backdrop-blur-sm">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
        {/* Brand */}
        <div className="mb-8 md:mb-0 text-center md:text-left">
          <motion.div className="flex cursor-default relative items-center justify-center md:justify-start">
            <div className="inline-flex py-4 px-2">
              {letters.map((letter, i) => (
                <motion.h3
                  key={i}
                  whileHover={{
                    y: -10,
                    scale: 1.1,
                    rotate: i % 2 === 0 ? 3 : -3,
                    transition: { type: "spring", stiffness: 400, damping: 10 },
                  }}
                  className="text-4xl font-bold mb-0 origin-bottom select-none cursor-pointer bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500"
                  style={{
                    fontFamily: "'DynaPuff', cursive",
                    backgroundSize: "300% 100%",
                    backgroundPosition:
                      i === 0 ? "0% 50%" : i === 1 ? "50% 50%" : "100% 50%",
                  }}
                >
                  {letter}
                </motion.h3>
              ))}
            </div>
          </motion.div>
          <p
            className="text-gray-500 text-sm tracking-wider uppercase"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Front-end Developer
          </p>
        </div>

        {/* Icons */}
        <div className="flex items-center gap-6">
          <SocialLink
            href="mailto:amifuku80@gmail.com"
            icon={<Mail size={20} />}
            label="Email"
          />
          <SocialLink
            href="/resume.pdf"
            icon={<FileText size={20} />}
            label="Resume"
            target="_blank"
            rel="noopener noreferrer"
          />

          <div className="w-px h-6 bg-gray-300 mx-2 hidden md:block"></div>
          <SocialLink
            href="https://www.linkedin.com/in/amifukuyama/"
            icon={<Linkedin size={20} />}
            label="LinkedIn"
          />
          <SocialLink
            href="https://github.com/Ami0480"
            icon={<Github size={20} />}
            label="GitHub"
          />
          <SocialLink
            href="https://x.com/CodeCrafty"
            icon={<Twitter size={20} />}
            label="X"
          />
        </div>
      </div>

      <div className="text-center mt-12 text-gray-400 text-xs font-light tracking-widest uppercase">
        &copy; {new Date().getFullYear()} Ami Portfolio.
      </div>
    </footer>
  );
};

const SocialLink = ({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) => {
  return (
    <motion.a
      href={href}
      whileHover={{ y: -3, scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm text-gray-600 hover:text-pink-500 hover:shadow-md transition-colors border border-gray-100"
      title={label}
    >
      {icon}
    </motion.a>
  );
};
