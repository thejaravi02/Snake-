import React, { useState, useEffect, useRef } from 'react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const GAME_SPEED = 120;

type Point = { x: number; y: number };

const generateFood = (snake: Point[]): Point => {
  let newFood: Point;
  while (true) {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    if (!snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
      break;
    }
  }
  return newFood;
};

export default function SnakeGame({ onScoreChange }: { onScoreChange: (score: number) => void }) {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);
  
  const directionQueue = useRef<Point[]>([]);
  const lastProcessedDirection = useRef<Point>(INITIAL_DIRECTION);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    directionQueue.current = [];
    lastProcessedDirection.current = INITIAL_DIRECTION;
    setScore(0);
    onScoreChange(0);
    setGameOver(false);
    setIsPaused(false);
    setFood(generateFood(INITIAL_SNAKE));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ') {
        if (gameOver) resetGame();
        else setIsPaused(p => !p);
        return;
      }

      if (gameOver || isPaused) return;

      const currentDir = directionQueue.current.length > 0 
        ? directionQueue.current[directionQueue.current.length - 1] 
        : lastProcessedDirection.current;

      let newDir: Point | null = null;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (currentDir.y !== 1) newDir = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (currentDir.y !== -1) newDir = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (currentDir.x !== 1) newDir = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (currentDir.x !== -1) newDir = { x: 1, y: 0 };
          break;
      }
      
      if (newDir) {
        if (currentDir.x !== newDir.x || currentDir.y !== newDir.y) {
          directionQueue.current.push(newDir);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver, isPaused]);

  useEffect(() => {
    if (gameOver || isPaused) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        
        let currentDir = lastProcessedDirection.current;
        if (directionQueue.current.length > 0) {
          currentDir = directionQueue.current.shift()!;
          lastProcessedDirection.current = currentDir;
        }

        const newHead = { x: head.x + currentDir.x, y: head.y + currentDir.y };

        // Check collision with walls
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        // Check collision with self
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          const newScore = score + 10;
          setScore(newScore);
          onScoreChange(newScore);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const interval = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(interval);
  }, [gameOver, isPaused, food, score, onScoreChange]);

  return (
    <div className="relative flex flex-col items-center">
      <div 
        className="grid bg-black border-4 border-[#00ffff] overflow-hidden"
        style={{ 
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          width: 'min(90vw, 400px)',
          height: 'min(90vw, 400px)'
        }}
      >
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
          const x = i % GRID_SIZE;
          const y = Math.floor(i / GRID_SIZE);
          const isSnake = snake.some(segment => segment.x === x && segment.y === y);
          const isHead = snake[0].x === x && snake[0].y === y;
          const isFood = food.x === x && food.y === y;

          return (
            <div
              key={i}
              className={`w-full h-full border border-white/5 ${
                isHead ? 'bg-[#00ffff] z-10' : 
                isSnake ? 'bg-[#00ffff]/80' : 
                isFood ? 'bg-[#ff00ff] animate-pulse' : 
                'bg-transparent'
              }`}
            />
          );
        })}
      </div>

      {gameOver && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-20 border-4 border-[#ff00ff]">
          <h2 className="text-3xl font-pixel text-magenta-glitch mb-6 glitch-wrapper" data-text="GAME OVER">GAME OVER</h2>
          <p className="text-[#00ffff] font-vt text-2xl mb-8">SCORE: {score}</p>
          <button 
            onClick={resetGame}
            className="px-6 py-4 bg-black border-2 border-[#00ffff] text-[#00ffff] hover:bg-[#00ffff] hover:text-black transition-colors font-pixel text-sm cursor-pointer uppercase"
          >
            REBOOT_SYSTEM
          </button>
        </div>
      )}

      {isPaused && !gameOver && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-20 border-4 border-[#00ffff]">
          <h2 className="text-3xl font-pixel text-cyan-glitch tracking-widest glitch-wrapper" data-text="PAUSED">PAUSED</h2>
          <p className="text-[#ff00ff] font-vt text-xl mt-6 animate-pulse">PRESS [SPACE] TO RESUME</p>
        </div>
      )}
    </div>
  );
}
