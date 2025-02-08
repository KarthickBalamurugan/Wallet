import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

function PageTransition({ children }) {
  const pageRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial page load animation
      gsap.fromTo(pageRef.current,
        {
          opacity: 0,
          y: 20
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out"
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef}>
      {children}
    </div>
  );
}

export default PageTransition; 