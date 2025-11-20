
import React from 'react';
import { BackgroundBubbles } from './components/portfolio/BackgroundBubbles';
import { Hero } from './components/portfolio/Hero';
import { About } from './components/portfolio/About';
import { Works } from './components/portfolio/Works';
import { Contact } from './components/portfolio/Contact';

function App() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans relative selection:bg-pink-200 selection:text-pink-900">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DynaPuff:wght@400;500;600;700&family=Poppins:wght@300;400;500;600;700&display=swap');
        
        body {
          background-color: #ffffff;
          cursor: default;
          overflow-x: hidden;
        }
      `}</style>

      {/* Background Bubbles */}
      <BackgroundBubbles layer="back" />

      {/* Main Content */}
      <main className="relative z-10">
        <Hero />
        <About />
        <Works />
        <Contact />
      </main>

      {/* Foreground Bubbles */}
      <BackgroundBubbles layer="front" />
    </div>
  );
}

export default App;
