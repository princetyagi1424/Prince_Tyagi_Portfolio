import { useEffect } from 'react';

const revealTargets = [
  '.section-head', '.about-aside', '.about-copy', '.skill-card', '.project-card',
  '.edu-primary', '.school-row', '.credential-card', '.incoming', '.profile-intro',
  '.leetcode-panel', '.contact-panel', '.footer-inner',
].join(',');

export function ScrollEffects() {
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    const canAnimate = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (canAnimate) body.classList.add('motion-ready');

    const revealNodes = Array.from(document.querySelectorAll<HTMLElement>(revealTargets));
    let observer: IntersectionObserver | undefined;
    if (canAnimate && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer?.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -36px 0px' });
      revealNodes.forEach((node, index) => {
        node.classList.add('motion-reveal');
        node.style.setProperty('--reveal-delay', `${Math.min(index % 5, 4) * 70}ms`);
        observer?.observe(node);
      });
    }

    let frame = 0;
    const updateScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const total = Math.max(1, root.scrollHeight - window.innerHeight);
        root.style.setProperty('--scroll-progress', `${Math.min(1, window.scrollY / total)}`);
      });
    };
    const updatePointer = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      root.style.setProperty('--pointer-x', `${event.clientX}px`);
      root.style.setProperty('--pointer-y', `${event.clientY}px`);
      const card = (event.target as HTMLElement | null)?.closest<HTMLElement>('.project-card, .skill-card');
      if (card) {
        const bounds = card.getBoundingClientRect();
        card.style.setProperty('--card-x', `${event.clientX - bounds.left}px`);
        card.style.setProperty('--card-y', `${event.clientY - bounds.top}px`);
      }
    };
    updateScroll();
    window.addEventListener('scroll', updateScroll, { passive: true });
    window.addEventListener('resize', updateScroll, { passive: true });
    window.addEventListener('pointermove', updatePointer, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      body.classList.remove('motion-ready');
      window.removeEventListener('scroll', updateScroll);
      window.removeEventListener('resize', updateScroll);
      window.removeEventListener('pointermove', updatePointer);
    };
  }, []);

  return <div className="scroll-progress" aria-hidden="true"><span /></div>;
}
