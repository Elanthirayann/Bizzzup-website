"use client";

import { useRef, useState, type ReactNode, type MouseEvent } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const springValues = {
  damping: 26,
  stiffness: 132,
  mass: 1.65,
};

export type TiltedCardProps = {
  imageSrc?: string;
  altText?: string;
  /** Renders inside the tilted face when `imageSrc` is omitted */
  children?: ReactNode;
  captionText?: string;
  containerHeight?: string;
  containerWidth?: string;
  imageHeight?: string;
  imageWidth?: string;
  scaleOnHover?: number;
  rotateAmplitude?: number;
  showMobileWarning?: boolean;
  showTooltip?: boolean;
  overlayContent?: ReactNode;
  displayOverlayContent?: boolean;
  /** Skip tilt and springs (e.g. prefers-reduced-motion) */
  disabled?: boolean;
  className?: string;
};

export default function TiltedCard({
  imageSrc,
  altText = "Card",
  children,
  captionText = "",
  containerHeight = "300px",
  containerWidth = "100%",
  imageHeight = "300px",
  imageWidth = "300px",
  scaleOnHover = 1.1,
  rotateAmplitude = 14,
  showMobileWarning = true,
  showTooltip = true,
  overlayContent = null,
  displayOverlayContent = false,
  disabled = false,
  className = "",
}: TiltedCardProps) {
  const ref = useRef<HTMLElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useMotionValue(0), springValues);
  const rotateY = useSpring(useMotionValue(0), springValues);
  const scale = useSpring(1, springValues);
  const opacity = useSpring(0);
  const rotateFigcaption = useSpring(0, {
    stiffness: 400,
    damping: 28,
    mass: 0.9,
  });

  const [lastY, setLastY] = useState(0);

  function handleMouse(e: MouseEvent<HTMLElement>) {
    if (disabled || !ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;

    const rotationX = (offsetY / (rect.height / 2)) * -rotateAmplitude;
    const rotationY = (offsetX / (rect.width / 2)) * rotateAmplitude;

    rotateX.set(rotationX);
    rotateY.set(rotationY);

    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);

    const velocityY = offsetY - lastY;
    rotateFigcaption.set(-velocityY * 0.85);
    setLastY(offsetY);
  }

  function handleMouseEnter() {
    if (disabled) return;
    scale.set(scaleOnHover);
    opacity.set(1);
  }

  function handleMouseLeave() {
    opacity.set(0);
    scale.set(1);
    rotateX.set(0);
    rotateY.set(0);
    rotateFigcaption.set(0);
    setLastY(0);
  }

  const useImage = Boolean(imageSrc);

  return (
    <figure
      ref={ref}
      className={`relative flex h-full w-full flex-col items-center justify-center [perspective:560px] ${className}`}
      style={{
        height: containerHeight,
        width: containerWidth,
      }}
      onMouseMove={disabled ? undefined : handleMouse}
      onMouseEnter={disabled ? undefined : handleMouseEnter}
      onMouseLeave={disabled ? undefined : handleMouseLeave}
    >
      {showMobileWarning && (
        <div className="absolute top-4 block text-center text-sm sm:hidden">
          This effect is not optimized for mobile. Check on desktop.
        </div>
      )}

      <motion.div
        className="relative [transform-style:preserve-3d]"
        style={{
          width: imageWidth,
          height: imageHeight,
          rotateX: disabled ? 0 : rotateX,
          rotateY: disabled ? 0 : rotateY,
          scale: disabled ? 1 : scale,
        }}
      >
        {useImage ? (
          <motion.img
            src={imageSrc}
            alt={altText}
            className="absolute top-0 left-0 rounded-[15px] object-cover will-change-transform [transform:translateZ(0)]"
            style={{
              width: imageWidth,
              height: imageHeight,
            }}
          />
        ) : (
          <motion.div
            className="absolute top-0 left-0 overflow-hidden rounded-[15px] will-change-transform [transform:translateZ(0)]"
            style={{
              width: imageWidth,
              height: imageHeight,
            }}
          >
            {children}
          </motion.div>
        )}

        {displayOverlayContent && overlayContent && (
          <motion.div className="absolute top-0 left-0 z-[2] flex h-full w-full items-end justify-center p-3 will-change-transform [transform:translateZ(30px)]">
            {overlayContent}
          </motion.div>
        )}
      </motion.div>

      {showTooltip && captionText && !disabled && (
        <motion.figcaption
          className="pointer-events-none absolute top-0 left-0 z-[3] hidden rounded border border-border bg-bg-card px-2.5 py-1 font-mono text-[10px] text-text-primary shadow-sm sm:block"
          style={{
            x,
            y,
            opacity,
            rotate: rotateFigcaption,
          }}
        >
          {captionText}
        </motion.figcaption>
      )}
    </figure>
  );
}
