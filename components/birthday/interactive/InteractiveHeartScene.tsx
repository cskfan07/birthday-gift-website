"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Bow } from "./Bow";
import { HeartTarget } from "./HeartTarget";
import { ImpactParticles } from "./ImpactParticles";
import { useBowAndArrow } from "./useBowAndArrow";

interface InteractiveHeartSceneProps {
  onComplete: () => void;
}

export function InteractiveHeartScene({ onComplete }: InteractiveHeartSceneProps) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 720, height: 430 });
  const [impact, setImpact] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const element = sceneRef.current;
    if (!element) return;
    const updateSize = () => setSize({ width: element.clientWidth, height: Math.max(360, element.clientHeight) });
    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  const onImpact = useCallback(() => {
    setImpact(true);
    if (sceneRef.current && !reducedMotion) {
      gsap.timeline().to(sceneRef.current, { x: -7, duration: 0.045 }).to(sceneRef.current, { x: 7, duration: 0.045 }).to(sceneRef.current, { x: 0, duration: 0.09 });
    }
    window.setTimeout(onComplete, reducedMotion ? 80 : 1050);
  }, [onComplete, reducedMotion]);
  const { state, startDrag, moveDrag, release, reducedMotion: prefersReducedMotion } = useBowAndArrow(sceneRef, onImpact);

  useEffect(() => {
    setReducedMotion(prefersReducedMotion);
  }, [prefersReducedMotion]);

  return (
    <section className="soft-panel relative min-h-[640px] overflow-hidden rounded-[2rem] p-5 text-center sm:p-10">
      <div className="relative mx-auto flex min-h-[580px] w-full max-w-4xl flex-col items-center justify-center">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-pink-100/70">Pull the string to begin</p>
        <h1 className="mt-4 font-serif text-4xl text-white sm:text-6xl">A little something for you</h1>
        <p className="mt-3 max-w-lg text-sm leading-7 text-[#d9c9d8]">Drag the bowstring back, feel the tension, then release it toward the heart.</p>
        <div
          ref={sceneRef}
          className="relative mt-8 h-[23rem] w-full max-w-3xl touch-none select-none"
          onPointerDown={startDrag}
          onPointerMove={moveDrag}
          onPointerUp={release}
          onPointerCancel={release}
          onContextMenu={(event) => event.preventDefault()}
        >
          <Bow pull={state.pull} width={size.width} height={size.height} />
          <div className="pointer-events-none absolute inset-0" style={{ transform: `translate(${state.arrow.x - size.width * 0.27}px, ${state.arrow.y - size.height * 0.58}px) rotate(${state.arrow.angle}rad)` }}>
            <div className="absolute left-0 top-1/2 h-1 w-32 -translate-y-1/2 rounded-full bg-gradient-to-r from-amber-100 via-pink-100 to-transparent shadow-[0_0_14px_rgba(255,220,230,0.8)]" />
            <div className="absolute left-32 top-1/2 -translate-x-1/2 -translate-y-1/2 border-y-[5px] border-y-transparent border-l-[16px] border-l-pink-100" />
          </div>
          <HeartTarget x={size.width * 0.73} y={size.height * 0.43} broken={impact} />
          {state.fragments.map((fragment, index) => (
            <span
              key={index}
              className="pointer-events-none absolute h-16 w-16 bg-gradient-to-br from-pink-200 via-rose-400 to-fuchsia-700 shadow-[0_0_22px_rgba(244,114,154,0.5)]"
              style={{ left: fragment.x, top: fragment.y, transform: `translate(-50%, -50%) rotate(${fragment.angle}rad)`, clipPath: index === 0 ? "polygon(0 0, 100% 0, 50% 100%)" : "polygon(0 0, 100% 0, 50% 100%)" }}
            />
          ))}
          <ImpactParticles active={impact} />
        </div>
        <p className="mt-2 text-xs uppercase tracking-[0.28em] text-pink-100/60">{state.isDragging ? "Hold and aim..." : state.isFlying ? "Straight to the heart..." : impact ? "The story continues..." : "Drag from the glowing grip"}</p>
      </div>
    </section>
  );
}
