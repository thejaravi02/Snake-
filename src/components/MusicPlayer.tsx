import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music } from 'lucide-react';

const TRACKS = [
  { id: 1, title: 'Neon Dreams (AI Gen)', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 2, title: 'Cybernetic Pulse (AI Gen)', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 3, title: 'Synthwave City (AI Gen)', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(e => console.error("Audio play failed:", e));
    } else if (audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleTrackEnded = () => {
    nextTrack();
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const bounds = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - bounds.left;
      const percentage = x / bounds.width;
      audioRef.current.currentTime = percentage * audioRef.current.duration;
    }
  };

  return (
    <div className="w-full max-w-md bg-black border-2 border-[#00ffff] p-6 flex flex-col gap-4 relative overflow-hidden">
      {/* Glitch overlay */}
      <div className="absolute inset-0 bg-[#ff00ff]/5 mix-blend-overlay pointer-events-none animate-pulse" />

      <audio
        ref={audioRef}
        src={TRACKS[currentTrackIndex].url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnded}
      />
      
      <div className="flex items-center gap-4 relative z-10">
        <div className="w-12 h-12 border-2 border-[#ff00ff] flex items-center justify-center flex-shrink-0 bg-black">
          <Music className="text-[#00ffff] w-6 h-6 animate-pulse" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-[#ff00ff] font-pixel text-sm truncate uppercase glitch-wrapper" data-text={TRACKS[currentTrackIndex].title}>
            {TRACKS[currentTrackIndex].title}
          </h3>
          <p className="text-[#00ffff] font-vt text-lg truncate mt-1">TRACK_0{currentTrackIndex + 1} // {TRACKS.length}</p>
        </div>
      </div>

      {/* Progress bar */}
      <div 
        className="h-4 w-full bg-black border border-[#00ffff] cursor-pointer relative"
        onClick={handleProgressClick}
      >
        <div 
          className="h-full bg-[#ff00ff] transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        />
        {/* Decorative markers */}
        <div className="absolute top-0 bottom-0 left-1/4 w-px bg-[#00ffff]/30" />
        <div className="absolute top-0 bottom-0 left-2/4 w-px bg-[#00ffff]/30" />
        <div className="absolute top-0 bottom-0 left-3/4 w-px bg-[#00ffff]/30" />
      </div>

      <div className="flex items-center justify-between mt-2 relative z-10">
        <div className="flex items-center gap-2">
          <button onClick={() => setIsMuted(!isMuted)} className="text-[#00ffff] hover:text-[#ff00ff] transition-colors cursor-pointer">
            {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setVolume(parseFloat(e.target.value));
              setIsMuted(false);
            }}
            className="w-20 accent-[#ff00ff] cursor-pointer"
          />
        </div>

        <div className="flex items-center gap-4">
          <button onClick={prevTrack} className="text-[#00ffff] hover:text-[#ff00ff] transition-colors cursor-pointer">
            <SkipBack size={24} />
          </button>
          <button 
            onClick={togglePlay} 
            className="w-12 h-12 flex items-center justify-center border-2 border-[#00ffff] text-[#00ffff] hover:bg-[#00ffff] hover:text-black transition-colors cursor-pointer"
          >
            {isPlaying ? <Pause size={24} className="fill-current" /> : <Play size={24} className="fill-current ml-1" />}
          </button>
          <button onClick={nextTrack} className="text-[#00ffff] hover:text-[#ff00ff] transition-colors cursor-pointer">
            <SkipForward size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
