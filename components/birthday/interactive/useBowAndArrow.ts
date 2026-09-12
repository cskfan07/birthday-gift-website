"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent, type RefObject } from "react";
import Matter from "matter-js";
import { clamp, distance, pointerPoint, type Point } from "./sceneMath";

interface BowState {
  pull: number;
  isDragging: boolean;
  isFlying: boolean;
  isBroken: boolean;
  arrow: { x: number; y: number; angle: number };
  fragments: Array<{ x: number; y: number; angle: number }>;
}

const INITIAL_STATE: BowState = { pull: 0, isDragging: false, isFlying: false, isBroken: false, arrow: { x: 0, y: 0, angle: 0 }, fragments: [] };

export function useBowAndArrow(containerRef: RefObject<HTMLDivElement | null>, onImpact: () => void) {
  const [state, setState] = useState<BowState>(INITIAL_STATE);
  const stateRef = useRef(state);
  const physicsRef = useRef<{ engine: Matter.Engine; arrow: Matter.Body; target: Matter.Body; fragments: Matter.Body[]; raf: number } | null>(null);
  const dragRef = useRef<{ pointerId: number; origin: Point } | null>(null);
  const impactRef = useRef(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const setSceneState = useCallback((next: BowState) => {
    stateRef.current = next;
    setState(next);
  }, []);

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const container = containerRef.current;
    if (!container) return;
    const width = container.clientWidth;
    const height = container.clientHeight;
    const origin = { x: width * 0.27, y: height * 0.58 };
    const targetPoint = { x: width * 0.73, y: height * 0.43 };
    const engine = Matter.Engine.create({ enableSleeping: true, gravity: { x: 0, y: 0 } });
    const arrow = Matter.Bodies.rectangle(origin.x, origin.y, 116, 5, { label: "arrow", frictionAir: 0.012, collisionFilter: { category: 0x0001, mask: 0x0002 } });
    const target = Matter.Bodies.circle(targetPoint.x, targetPoint.y, 70, { label: "heart", isStatic: true, collisionFilter: { category: 0x0002, mask: 0x0001 } });
    Matter.Composite.add(engine.world, [arrow, target]);
    const collisionHandler = (event: Matter.IEventCollision<Matter.Engine>) => {
      if (impactRef.current) return;
      if (event.pairs.some((pair) => (pair.bodyA === arrow && pair.bodyB === target) || (pair.bodyA === target && pair.bodyB === arrow))) {
        impactRef.current = true;
        const leftFragment = Matter.Bodies.polygon(target.position.x - 22, target.position.y + 4, 3, 27, { label: "heart-fragment", frictionAir: 0.02 });
        const rightFragment = Matter.Bodies.polygon(target.position.x + 22, target.position.y + 4, 3, 27, { label: "heart-fragment", frictionAir: 0.02 });
        Matter.Composite.add(engine.world, leftFragment);
        Matter.Composite.add(engine.world, rightFragment);
        physicsRef.current!.fragments = [leftFragment, rightFragment];
        Matter.Body.setVelocity(leftFragment, { x: -2.2, y: -2.5 });
        Matter.Body.setVelocity(rightFragment, { x: 2.2, y: -2.5 });
        Matter.Body.setAngularVelocity(leftFragment, -0.08);
        Matter.Body.setAngularVelocity(rightFragment, 0.08);
        setSceneState({ ...stateRef.current, isFlying: false, isBroken: true, fragments: [
          { x: leftFragment.position.x, y: leftFragment.position.y, angle: leftFragment.angle },
          { x: rightFragment.position.x, y: rightFragment.position.y, angle: rightFragment.angle },
        ] });
        onImpact();
      }
    };
    Matter.Events.on(engine, "collisionStart", collisionHandler);
    const raf = window.requestAnimationFrame(function tick() {
      Matter.Engine.update(engine, 1000 / 60);
      if (!impactRef.current && stateRef.current.isFlying) {
        setSceneState({ ...stateRef.current, arrow: { x: arrow.position.x, y: arrow.position.y, angle: arrow.angle }, fragments: physicsRef.current?.fragments.map((fragment) => ({ x: fragment.position.x, y: fragment.position.y, angle: fragment.angle })) ?? [] });
      }
      physicsRef.current!.raf = window.requestAnimationFrame(tick);
    });
    physicsRef.current = { engine, arrow, target, fragments: [], raf };
    setSceneState({ ...INITIAL_STATE, arrow: { x: origin.x, y: origin.y, angle: 0 } });
    return () => {
      window.cancelAnimationFrame(physicsRef.current?.raf ?? raf);
      Matter.Events.off(engine, "collisionStart", collisionHandler);
      Matter.Engine.clear(engine);
      physicsRef.current = null;
    };
  }, [containerRef, onImpact, setSceneState]);

  const startDrag = useCallback((event: PointerEvent<HTMLDivElement>) => {
    if (stateRef.current.isFlying || stateRef.current.isBroken || !physicsRef.current) return;
    const point = pointerPoint(event.nativeEvent, event.currentTarget);
    const grip = { x: event.currentTarget.clientWidth * 0.27, y: event.currentTarget.clientHeight * 0.58 };
    if (distance(point, grip) > 72) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = { pointerId: event.pointerId, origin: grip };
    setSceneState({ ...stateRef.current, isDragging: true });
  }, [setSceneState]);

  const moveDrag = useCallback((event: PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current || dragRef.current.pointerId !== event.pointerId || !physicsRef.current) return;
    const point = pointerPoint(event.nativeEvent, event.currentTarget);
    const bounds = event.currentTarget.getBoundingClientRect();
    const maxPull = Math.min(145, bounds.width * 0.22);
    const pull = clamp(dragRef.current.origin.x - point.x, 0, maxPull);
    setSceneState({ ...stateRef.current, pull, isDragging: true, arrow: { ...stateRef.current.arrow, x: bounds.width * 0.27 + pull, y: bounds.height * 0.58 } });
  }, [setSceneState]);

  const release = useCallback((event: PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current || dragRef.current.pointerId !== event.pointerId || !physicsRef.current) return;
    dragRef.current = null;
    const { arrow } = physicsRef.current;
    const pull = stateRef.current.pull;
    Matter.Body.setPosition(arrow, { x: arrow.position.x, y: arrow.position.y });
    Matter.Body.setVelocity(arrow, { x: 7 + pull * 0.095, y: -0.8 });
    Matter.Body.setAngle(arrow, -0.04);
    Matter.Body.setAngularVelocity(arrow, 0);
    setSceneState({ ...stateRef.current, pull: 0, isDragging: false, isFlying: true });
  }, [setSceneState]);

  const reset = useCallback(() => {
    const physics = physicsRef.current;
    if (!physics || !containerRef.current) return;
    impactRef.current = false;
    const x = containerRef.current.clientWidth * 0.27;
    const y = containerRef.current.clientHeight * 0.58;
    Matter.Body.setPosition(physics.arrow, { x, y });
    Matter.Body.setVelocity(physics.arrow, { x: 0, y: 0 });
    Matter.Body.setAngle(physics.arrow, 0);
    physics.fragments.forEach((fragment) => Matter.Composite.remove(physics.engine.world, fragment));
    physics.fragments = [];
    setSceneState({ ...INITIAL_STATE, arrow: { x, y, angle: 0 } });
  }, [containerRef, setSceneState]);

  return { state, startDrag, moveDrag, release, reset, reducedMotion };
}
