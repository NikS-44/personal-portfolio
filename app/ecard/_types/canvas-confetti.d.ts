declare module "canvas-confetti" {
  interface ConfettiOptions {
    particleCount?: number;
    spread?: number;
    origin?: { x?: number; y?: number };
    colors?: string[];
    startVelocity?: number;
    decay?: number;
    gravity?: number;
    scalar?: number;
    ticks?: number;
    zIndex?: number;
    disableForReducedMotion?: boolean;
  }
  function confetti(options?: ConfettiOptions): Promise<null>;
  export default confetti;
}
