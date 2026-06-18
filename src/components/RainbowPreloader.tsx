import { useEffect, useRef, useState } from "react";

const rainbowCracks = [
  { className: "rainbow-crack-1", label: "red" },
  { className: "rainbow-crack-2", label: "orange" },
  { className: "rainbow-crack-3", label: "yellow" },
  { className: "rainbow-crack-4", label: "green" },
  { className: "rainbow-crack-5", label: "blue" },
  { className: "rainbow-crack-6", label: "indigo" },
  { className: "rainbow-crack-7", label: "violet" },
];

export default function RainbowPreloader() {
  const widgetRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef({
    pointerId: -1,
    offsetX: 0,
    offsetY: 0,
    didDrag: false,
  });
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const setInitialPosition = () => {
      const size = widgetRef.current?.offsetWidth ?? 112;
      setPosition({
        x: window.innerWidth - size - 24,
        y: window.innerHeight - size - 24,
      });
    };

    setInitialPosition();
    window.addEventListener("resize", setInitialPosition);

    return () => window.removeEventListener("resize", setInitialPosition);
  }, []);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    dragRef.current = {
      pointerId: event.pointerId,
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
      didDrag: false,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragRef.current.pointerId !== event.pointerId) return;

    const size = widgetRef.current?.offsetWidth ?? 112;
    const nextX = Math.min(Math.max(event.clientX - dragRef.current.offsetX, 8), window.innerWidth - size - 8);
    const nextY = Math.min(Math.max(event.clientY - dragRef.current.offsetY, 8), window.innerHeight - size - 8);

    dragRef.current.didDrag = true;
    setPosition({ x: nextX, y: nextY });
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragRef.current.pointerId !== event.pointerId) return;
    event.currentTarget.releasePointerCapture(event.pointerId);
    dragRef.current.pointerId = -1;
  };

  return (
    <div
      ref={widgetRef}
      className="rainbow-widget"
      style={{ transform: `translate3d(${position.x}px, ${position.y}px, 0)` }}
      role="button"
      tabIndex={0}
      aria-label="Move rainbow effect"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <div className="rainbow-preloader" aria-hidden="true">
        {rainbowCracks.map((crack) => (
          <div key={crack.label} className={`rainbow-crack ${crack.className}`} />
        ))}
      </div>
    </div>
  );
}
