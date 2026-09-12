"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { Button } from "@/components/ui/Button";
import { InteractiveHeartScene } from "@/components/birthday/interactive/InteractiveHeartScene";

type IntroPhase = "interactive" | "message";

interface HeartOpeningProps {
  name: string;
  age: string;
  onContinue: () => void;
}

function TreeGrowth() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) {
      return;
    }
    const drawingCanvas = canvas;
    const drawingContext = context;

    let animationFrameId = 0;
    let width = 0;
    let height = 0;
    let frame = 0;
    let treeGrowth = 0;
    let canopyCenter = { x: 0, y: 0 };
    let canopyScale = 0;

    const petalColors = ["#ff6584", "#ff7597", "#ffaaa6", "#ffd3b6", "#ffaa85", "#ff8e9e", "#ff5376", "#fff0f5", "#ffc3a0"];
    const treePetals = Array.from({ length: 900 }, () => ({
      angle: Math.random() * Math.PI * 2,
      radius: Math.sqrt(Math.random()),
      xOffset: (Math.random() - 0.5) * 15,
      yOffset: (Math.random() - 0.5) * 15,
      targetSize: 7 + Math.random() * 10,
      currentSize: 0,
      color: petalColors[Math.floor(Math.random() * petalColors.length)],
      rotation: (Math.random() - 0.5) * 0.8,
      delay: Math.random() * 90 + 30,
      growthSpeed: 0.13 + Math.random() * 0.1,
      alpha: 0,
    }));
    const fallingPetals = Array.from({ length: 22 }, () => ({
      x: Math.random(),
      y: Math.random(),
      size: 5 + Math.random() * 7,
      color: petalColors[Math.floor(Math.random() * petalColors.length)],
      speedY: 0.0008 + Math.random() * 0.0012,
      speedX: (Math.random() - 0.5) * 0.0005,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.03,
      alpha: 0.28 + Math.random() * 0.35,
    }));

    function resize() {
      const bounds = drawingCanvas.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(bounds.width, 260);
      height = Math.max(bounds.height, 280);
      drawingCanvas.width = width * pixelRatio;
      drawingCanvas.height = height * pixelRatio;
      drawingCanvas.style.width = `${width}px`;
      drawingCanvas.style.height = `${height}px`;
      drawingContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      const isPhone = width < 600;
      canopyCenter = { x: width * (isPhone ? 0.52 : 0.58), y: height * (isPhone ? 0.3 : 0.32) };
      canopyScale = Math.min(width * (isPhone ? 0.038 : 0.034), height * 0.044);
    }

    function heartPoint(angle: number, scale: number) {
      const x = 16 * Math.pow(Math.sin(angle), 3);
      const y = -(13 * Math.cos(angle) - 5 * Math.cos(2 * angle) - 2 * Math.cos(3 * angle) - Math.cos(4 * angle));
      return { x: canopyCenter.x + x * scale, y: canopyCenter.y + y * scale };
    }

    function drawHeart(x: number, y: number, size: number, color: string, alpha: number, rotation: number) {
      drawingContext.save();
      drawingContext.translate(x, y);
      drawingContext.rotate(rotation);
      drawingContext.globalAlpha = alpha;
      drawingContext.fillStyle = color;
      drawingContext.shadowColor = "rgba(255, 95, 145, 0.32)";
      drawingContext.shadowBlur = 5;
      drawingContext.beginPath();
      drawingContext.moveTo(0, size * 0.3);
      drawingContext.bezierCurveTo(-size / 2, -size / 2, -size, size / 3, 0, size);
      drawingContext.bezierCurveTo(size, size / 3, size / 2, -size / 2, 0, size * 0.3);
      drawingContext.fill();
      drawingContext.restore();
    }

    function drawTree(progress: number) {
      const rootX = width * (width < 600 ? 0.52 : 0.58);
      const rootY = height * 1.03;
      const trunkTopY = height - (height - canopyCenter.y) * 0.78 * progress;
      const sway = Math.sin(frame * 0.018) * 2.5;

      drawingContext.save();
      drawingContext.strokeStyle = "#5a382e";
      drawingContext.lineCap = "round";
      drawingContext.lineWidth = Math.max(7, width * 0.018);
      drawingContext.beginPath();
      drawingContext.moveTo(rootX, rootY);
      drawingContext.quadraticCurveTo(rootX - 10 + sway, (rootY + trunkTopY) / 2, rootX - 5 + sway, trunkTopY);
      drawingContext.stroke();

      if (progress > 0.5) {
        const branchProgress = (progress - 0.5) / 0.5;
        drawingContext.lineWidth = Math.max(4, width * 0.009);
        drawingContext.beginPath();
        drawingContext.moveTo(rootX - 5 + sway, trunkTopY);
        drawingContext.quadraticCurveTo(rootX - 40 + sway, trunkTopY - 50 * branchProgress, rootX - 70 * branchProgress + sway, trunkTopY - 70 * branchProgress);
        drawingContext.stroke();
        drawingContext.beginPath();
        drawingContext.moveTo(rootX - 5 + sway, trunkTopY + 15);
        drawingContext.quadraticCurveTo(rootX + 35 + sway, trunkTopY - 40 * branchProgress, rootX + 65 * branchProgress + sway, trunkTopY - 60 * branchProgress);
        drawingContext.stroke();
      }
      drawingContext.restore();
    }

    function render() {
      frame += 1;
      drawingContext.clearRect(0, 0, width, height);
      treeGrowth = Math.min(1, treeGrowth + 0.012);
      drawTree(treeGrowth);

      if (treeGrowth > 0.6) {
        treePetals.forEach((petal) => {
          if (frame > petal.delay) {
            petal.currentSize = Math.min(petal.targetSize, petal.currentSize + petal.growthSpeed);
            petal.alpha = Math.min(1, petal.alpha + 0.05);
            const point = heartPoint(petal.angle, canopyScale * petal.radius);
            const sway = Math.sin(frame * 0.018 + petal.angle) * 2.5;
            drawHeart(point.x + petal.xOffset + sway, point.y + petal.yOffset, petal.currentSize, petal.color, petal.alpha, petal.rotation);
          }
        });
      }

      fallingPetals.forEach((petal) => {
        petal.y += petal.speedY;
        petal.x += Math.sin(frame * 0.02) * 0.0007 + petal.speedX;
        petal.rotation += petal.rotSpeed;
        if (petal.y > 1.05) {
          petal.y = -0.05;
          petal.x = (Math.sin(frame * 0.7) + 1) / 2;
        }
        drawHeart(petal.x * width, petal.y * height, petal.size, petal.color, petal.alpha, petal.rotation);
      });

      animationFrameId = window.requestAnimationFrame(render);
    }

    resize();
    window.addEventListener("resize", resize);
    render();
    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="mt-4 h-[20rem] w-full sm:h-[30rem]" aria-label="Animated heart tree" />;
}

export function HeartOpening({ name, age, onContinue }: HeartOpeningProps) {
  const [phase, setPhase] = useState<IntroPhase>("interactive");
  const handleImpact = useCallback(() => setPhase("message"), []);

  return (
    <section className="soft-panel relative min-h-[640px] overflow-hidden rounded-[2rem] p-6 text-center sm:p-10">
      <div className="pointer-events-none absolute left-[12%] top-[14%] text-xl text-pink-200/70">{String.fromCodePoint(0x2728)}</div>
      <div className="pointer-events-none absolute right-[16%] top-[25%] text-sm text-pink-100/60">{String.fromCodePoint(0x2726)}</div>
      <div className="relative flex min-h-[580px] flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {phase === "interactive" ? <InteractiveHeartScene key="interactive-heart" onComplete={handleImpact} /> : null}
        </AnimatePresence>

        <AnimatePresence>
          {phase === "message" ? (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="mt-2"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-pink-100/70">It&apos;s officially your day</p>
              <h1 className="mt-4 font-serif text-5xl leading-none text-white sm:text-7xl">Happy Birthday</h1>
              <h2 className="mt-3 text-2xl font-semibold text-pink-100 sm:text-3xl">{name}</h2>
              <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-[#d9c9d8]">
                And just like that, you&apos;re turning <span className="font-semibold text-white">{age}</span>.
              </p>
              <TreeGrowth />
              <Button type="button" onClick={onContinue} className="mt-2">
                Enter the story
                <Sparkles className="h-4 w-4" />
              </Button>
            </motion.div>
          ) : (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-10 text-sm text-[#c9b8c7]">
              Watch closely...
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
