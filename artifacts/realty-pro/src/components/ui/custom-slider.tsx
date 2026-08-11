import { useState, useRef, useEffect } from "react";

interface CustomSliderProps {
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

export function CustomSlider({
  min,
  max,
  step,
  value,
  onChange,
  className = "",
}: CustomSliderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);

  const percentage = ((value - min) / (max - min)) * 100;

  const updateValueFromPointer = (clientX: number) => {
    if (!trackRef.current) return;

    const rect = trackRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const width = rect.width;
    const rawPercentage = Math.max(0, Math.min(1, x / width));
    const rawValue = min + rawPercentage * (max - min);
    const steppedValue = Math.round(rawValue / step) * step;
    const finalValue = Math.max(min, Math.min(max, steppedValue));

    onChange(finalValue);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    updateValueFromPointer(e.clientX);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    updateValueFromPointer(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle mouse move on window for smooth dragging outside thumb
  useEffect(() => {
    if (!isDragging) return;

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div className={`relative h-6 select-none ${className}`}>
      {/* Track - not interactive */}
      <div
        ref={trackRef}
        className="absolute inset-0 h-2 bg-muted rounded-full"
        style={{ userSelect: "none" }}
      >
        {/* Filled portion */}
        <div
          className="absolute left-0 top-0 h-full bg-primary rounded-full transition-all duration-75"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Thumb - only this is draggable */}
      <div
        ref={thumbRef}
        className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-primary rounded-full shadow-lg cursor-grab active:cursor-grabbing hover:scale-110 transition-transform duration-75 z-10"
        style={{ left: `${percentage}%`, transform: "translate(-50%, -50%)" }}
        onMouseDown={handleMouseDown}
      />
    </div>
  );
}
