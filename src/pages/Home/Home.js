import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import PageTransition from '../../components/PageTransition';

function Home() {
  const elementsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Stagger animation for elements
      gsap.fromTo(elementsRef.current,
        {
          opacity: 0,
          y: 30
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power2.out"
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <PageTransition>
      <div className="home-container">
        {/* Add ref to elements you want to animate */}
        <h1 ref={el => elementsRef.current[0] = el}>Welcome</h1>
        <div ref={el => elementsRef.current[1] = el}>
          {/* Your content */}
        </div>
      </div>
    </PageTransition>
  );
}

export default Home; 