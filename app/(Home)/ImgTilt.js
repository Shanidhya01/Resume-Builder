'use client'
import { useRef, useEffect } from 'react';

const ImgTilt = ({ children, tiltMaxAngleX = 15, tiltMaxAngleY = 15, perspective = 1000, scale = 1.02, transitionDuration = 300, gyroscope = true }) => {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let mouseLeaveDelay;

    const handleMouseEnter = (event) => {
      clearTimeout(mouseLeaveDelay);
      element.style.willChange = 'transform';
      element.style.transition = '';
    };

    const handleMouseMove = (event) => {
      if (!element) return;

      const elementRect = element.getBoundingClientRect();
      const elementCenterX = elementRect.left + elementRect.width / 2;
      const elementCenterY = elementRect.top + elementRect.height / 2;

      const mouseX = event.clientX - elementCenterX;
      const mouseY = event.clientY - elementCenterY;

      const rotateX = (mouseY / (elementRect.height / 2)) * tiltMaxAngleX;
      const rotateY = (mouseX / (elementRect.width / 2)) * tiltMaxAngleY;

      element.style.transform = `
        perspective(${perspective}px)
        rotateX(${-rotateX}deg)
        rotateY(${rotateY}deg)
        scale3d(${scale}, ${scale}, ${scale})
      `;
    };

    const handleMouseLeave = () => {
      clearTimeout(mouseLeaveDelay);
      
      if (element) {
        element.style.transition = `transform ${transitionDuration}ms cubic-bezier(0.03, 0.98, 0.52, 0.99)`;
        element.style.transform = `
          perspective(${perspective}px)
          rotateX(0deg)
          rotateY(0deg)
          scale3d(1, 1, 1)
        `;
      }
      
      mouseLeaveDelay = setTimeout(() => {
        if (element) {
          element.style.willChange = 'auto';
        }
      }, transitionDuration);
    };

    // Device orientation support for mobile
    const handleDeviceOrientation = (event) => {
      if (!gyroscope || !element || !event.gamma || !event.beta) return;
      
      const rotateX = (event.beta / 90) * tiltMaxAngleX;
      const rotateY = (event.gamma / 90) * tiltMaxAngleY;

      element.style.transform = `
        perspective(${perspective}px)
        rotateX(${Math.max(-tiltMaxAngleX, Math.min(tiltMaxAngleX, rotateX))}deg)
        rotateY(${Math.max(-tiltMaxAngleY, Math.min(tiltMaxAngleY, rotateY))}deg)
        scale3d(${scale}, ${scale}, ${scale})
      `;
    };

    // Touch support for mobile
    const handleTouchMove = (event) => {
      if (!element || event.touches.length !== 1) return;
      
      const touch = event.touches[0];
      const elementRect = element.getBoundingClientRect();
      const elementCenterX = elementRect.left + elementRect.width / 2;
      const elementCenterY = elementRect.top + elementRect.height / 2;

      const touchX = touch.clientX - elementCenterX;
      const touchY = touch.clientY - elementCenterY;

      const rotateX = (touchY / (elementRect.height / 2)) * tiltMaxAngleX;
      const rotateY = (touchX / (elementRect.width / 2)) * tiltMaxAngleY;

      element.style.transform = `
        perspective(${perspective}px)
        rotateX(${-rotateX}deg)
        rotateY(${rotateY}deg)
        scale3d(${scale}, ${scale}, ${scale})
      `;
    };

    const handleTouchEnd = () => {
      handleMouseLeave();
    };

    // Event listeners
    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);
    element.addEventListener('touchmove', handleTouchMove, { passive: true });
    element.addEventListener('touchend', handleTouchEnd);

    // Gyroscope support
    if (gyroscope && typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
      window.addEventListener('deviceorientation', handleDeviceOrientation);
    }

    // Cleanup
    return () => {
      clearTimeout(mouseLeaveDelay);
      if (element) {
        element.removeEventListener('mouseenter', handleMouseEnter);
        element.removeEventListener('mousemove', handleMouseMove);
        element.removeEventListener('mouseleave', handleMouseLeave);
        element.removeEventListener('touchmove', handleTouchMove);
        element.removeEventListener('touchend', handleTouchEnd);
      }
      if (gyroscope && typeof window !== 'undefined') {
        window.removeEventListener('deviceorientation', handleDeviceOrientation);
      }
    };
  }, [tiltMaxAngleX, tiltMaxAngleY, perspective, scale, transitionDuration, gyroscope]);

  return (
    <div 
      ref={ref} 
      className="transform-gpu transition-transform duration-300 ease-out cursor-pointer select-none"
      style={{ 
        transformStyle: 'preserve-3d',
        backfaceVisibility: 'hidden'
      }}
    >
      {children}
    </div>
  );
};

export default ImgTilt;
