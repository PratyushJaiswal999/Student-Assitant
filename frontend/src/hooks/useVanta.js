/**
 * useVanta — initialises VANTA.RINGS on #vanta-bg and destroys it on unmount.
 * Re-initialises when theme changes so colors stay in sync.
 */
import { useEffect, useRef } from 'react';

export function useVanta(theme) {
  const effectRef = useRef(null);

  useEffect(() => {
    const el = document.getElementById('vanta-bg');
    if (!el || !window.VANTA) return;

    // Destroy previous instance before reinitialising
    if (effectRef.current) {
      effectRef.current.destroy();
      effectRef.current = null;
    }

    const isDark = theme === 'dark';

    effectRef.current = window.VANTA.RINGS({
      el,
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200,
      minWidth: 200,
      scale: 1.0,
      scaleMobile: 1.0,
      backgroundColor: isDark ? 0x0f0f13 : 0xf5f4f0,
      color: isDark ? 0x6d5ef5 : 0x3d35c8,
    });

    return () => {
      if (effectRef.current) {
        effectRef.current.destroy();
        effectRef.current = null;
      }
    };
  }, [theme]);
}
