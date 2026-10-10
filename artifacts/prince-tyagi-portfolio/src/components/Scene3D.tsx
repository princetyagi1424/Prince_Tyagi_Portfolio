import { lazy, Suspense, useEffect, useState } from 'react';
import { Layers3 } from 'lucide-react';

const InteractiveScene = lazy(() => import('./ThreeScene'));

export function Scene3D() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [webgl, setWebgl] = useState(true);
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(query.matches);
    const change = () => setReducedMotion(query.matches);
    query.addEventListener?.('change', change);
    try {
      const canvas = document.createElement('canvas');
      setWebgl(Boolean(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))));
    } catch {
      setWebgl(false);
    }
    return () => query.removeEventListener?.('change', change);
  }, []);
  return (
    <div className="scene-frame" aria-label="Abstract interactive three-dimensional geometry">
      <div className="scene-fallback" aria-hidden="true">
        <div className="fallback-cube"><span /><span /><span /></div>
        <span className="scene-label one">Java · DSA</span>
        <span className="scene-label two">Build / test / learn</span>
        <span className="scene-label three">Mathura · IN</span>
      </div>
      {webgl && !reducedMotion && (
        <Suspense fallback={null}>
          <InteractiveScene />
        </Suspense>
      )}
      <div className="scene-caption"><Layers3 size={12} aria-hidden="true" /> {webgl && !reducedMotion ? 'Interactive geometry · move pointer to explore' : 'A small digital workspace'}</div>
    </div>
  );
}
