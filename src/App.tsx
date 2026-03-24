/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { Terminal } from 'lucide-react';

export default function App() {
  const [score, setScore] = useState(0);

  return (
    <div className="min-h-screen bg-black text-white font-vt selection:bg-[#ff00ff]/30 overflow-hidden relative flex flex-col scanlines">
      {/* Background static effect */}
      <div className="absolute inset-0 bg-static opacity-30 pointer-events-none" />
      
      <header className="w-full p-6 flex items-center justify-between relative z-10 border-b-4 border-[#00ffff] bg-black/80">
        <div className="flex items-center gap-4">
          <Terminal className="w-8 h-8 text-[#ff00ff] animate-pulse" />
          <h1 
            className="text-2xl font-pixel text-cyan-glitch glitch-wrapper uppercase"
            data-text="SYSTEM.SNAKE"
          >
            SYSTEM.SNAKE
          </h1>
        </div>
        <div className="flex items-center gap-4 bg-black px-6 py-2 border-2 border-[#ff00ff]">
          <span className="text-[#00ffff] font-pixel text-xs uppercase tracking-widest">SCORE_</span>
          <span className="text-xl font-pixel text-magenta-glitch">{score.toString().padStart(4, '0')}</span>
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-12 p-8 relative z-10 animate-tear">
        <div className="flex flex-col items-center gap-6">
          <div className="text-center space-y-2 border border-[#00ffff] p-4 bg-black/50">
            <h2 className="text-xl font-pixel text-[#ff00ff] uppercase tracking-widest">PLAYER_01</h2>
            <p className="text-lg text-[#00ffff]">INPUT: [ARROWS] | PAUSE: [SPACE]</p>
          </div>
          <SnakeGame onScoreChange={setScore} />
        </div>

        <div className="flex flex-col gap-8 w-full max-w-md">
          <div className="border-4 border-[#ff00ff] p-1 bg-black">
            <MusicPlayer />
          </div>
          
          {/* Decorative elements */}
          <div className="hidden lg:flex flex-col gap-4 opacity-80">
            <div className="h-2 w-full bg-[#00ffff]" />
            <div className="flex justify-between text-sm font-pixel text-[#ff00ff]">
              <span>STATUS: ONLINE</span>
              <span>AUDIO: ACTIVE</span>
            </div>
            <div className="h-2 w-full bg-[#ff00ff]" />
          </div>
        </div>
      </main>
    </div>
  );
}
