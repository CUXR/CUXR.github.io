import { useEffect, useRef, useState } from 'react';
import type { Project } from '../lib/content';
import '../styles/featured.css';

const CAROUSEL_INTERVAL_MS = 5000;
const PROGRESS_RESET_MS = 220;
const PROGRESS_RESET_EASING = 'cubic-bezier(0.22, 1, 0.36, 1)';

type Props = {
  projects: Project[];
};

export default function FeaturedProjects({ projects }: Props) {
  const visibleProjects = projects.filter((project) => project.status !== 'hidden').slice(0, 5);
  const [activeIndex, setActiveIndex] = useState(0);
  const [pointerInside, setPointerInside] = useState(false);
  const [inView, setInView] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [motionAllowed, setMotionAllowed] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const previousProjectId = useRef<string | undefined>(visibleProjects[0]?.id);
  const selectedIndex = visibleProjects.length === 0 ? 0 : activeIndex % visibleProjects.length;
  const selected = visibleProjects[selectedIndex];

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotion = () => setMotionAllowed(!media.matches);
    const updateVisibility = () => setPageVisible(!document.hidden);
    updateMotion();
    updateVisibility();
    media.addEventListener('change', updateMotion);
    document.addEventListener('visibilitychange', updateVisibility);

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.1 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => {
      media.removeEventListener('change', updateMotion);
      document.removeEventListener('visibilitychange', updateVisibility);
      observer.disconnect();
    };
  }, []);

  const canRotate =
    visibleProjects.length > 1 &&
    motionAllowed &&
    pageVisible &&
    inView &&
    !pointerInside;

  useEffect(() => {
    if (!canRotate) return;
    const interval = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % visibleProjects.length);
    }, CAROUSEL_INTERVAL_MS);
    return () => window.clearInterval(interval);
  }, [canRotate, visibleProjects.length]);

  useEffect(() => {
    const progress = progressRef.current;
    if (!progress || !selected) return;

    if (!motionAllowed) {
      progress.getAnimations().forEach((animation) => animation.cancel());
      progress.style.transform = 'scaleX(0)';
      return;
    }

    const transform = getComputedStyle(progress).transform;
    const currentScale = transform === 'none' ? 0 : new DOMMatrixReadOnly(transform).a;
    const projectChanged = previousProjectId.current !== selected.id;
    previousProjectId.current = selected.id;

    const animation = canRotate && projectChanged && currentScale > 0.01
      ? progress.animate(
          [
            { transform: `scaleX(${currentScale})`, easing: PROGRESS_RESET_EASING },
            { transform: 'scaleX(0)', offset: PROGRESS_RESET_MS / CAROUSEL_INTERVAL_MS, easing: 'linear' },
            { transform: 'scaleX(1)' },
          ],
          { duration: CAROUSEL_INTERVAL_MS, fill: 'forwards' },
        )
      : progress.animate(
          [
            { transform: `scaleX(${currentScale})` },
            { transform: canRotate ? 'scaleX(1)' : 'scaleX(0)' },
          ],
          {
            duration: canRotate ? CAROUSEL_INTERVAL_MS : PROGRESS_RESET_MS,
            easing: canRotate ? 'linear' : PROGRESS_RESET_EASING,
            fill: 'forwards',
          },
        );

    return () => {
      // Preserve the sampled scale so an interrupted cycle retracts instead of snapping.
      progress.style.transform = getComputedStyle(progress).transform;
      animation.cancel();
    };
  }, [canRotate, motionAllowed, selected]);

  if (!selected) return null;

  const choose = (index: number) => {
    setActiveIndex((index + visibleProjects.length) % visibleProjects.length);
  };

  return (
    <section
      className="featured section"
      id="featured"
      aria-labelledby="featured-title"
      ref={sectionRef}
    >
      <div className="container">
        <div className="featured__intro">
          <div>
            <h2 id="featured-title">Projects</h2>
          </div>
          <a className="text-link featured__all-link" href="/projects/">
            All projects
          </a>
        </div>

        <div className="featured__panel" aria-live="off">
          <div className="featured__media" onPointerEnter={() => setPointerInside(true)} onPointerLeave={() => setPointerInside(false)}>
            <button className="featured__neighbor featured__neighbor--previous" type="button" onClick={() => choose(selectedIndex - 1)} aria-label={`Show previous project: ${visibleProjects[(selectedIndex - 1 + visibleProjects.length) % visibleProjects.length].title}`}>
              <img src={visibleProjects[(selectedIndex - 1 + visibleProjects.length) % visibleProjects.length].image} alt="" width="253" height="288" />
            </button>
            <div className="featured__media-art">
              <img
                key={selected.id}
                src={selected.image}
                alt={selected.imageAlt}
                width="253"
                height="288"
                loading={selectedIndex === 0 ? 'eager' : 'lazy'}
              />
            </div>
            <button className="featured__neighbor featured__neighbor--next" type="button" onClick={() => choose(selectedIndex + 1)} aria-label={`Show next project: ${visibleProjects[(selectedIndex + 1) % visibleProjects.length].title}`}>
              <img src={visibleProjects[(selectedIndex + 1) % visibleProjects.length].image} alt="" width="253" height="288" />
            </button>
          </div>

          <div className="featured__body">
            <div className="featured__story" key={selected.id}>
              <div className="featured__meta">
                <span>{selected.category}</span>
              </div>
              <h3>{selected.title}</h3>
              <p>{selected.summary}</p>
              <a className="text-link featured__project-link" href={`/projects/#${selected.id}`}>
                Explore the project
              </a>
            </div>

            <div className="featured__progress" data-running={canRotate} aria-hidden="true">
              <span ref={progressRef} />
            </div>


          </div>
        </div>
      </div>
    </section>
  );
}
