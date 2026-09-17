import { useEffect, useRef, useState } from 'react';
import type { Project } from '../lib/content';
import '../styles/featured.css';

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
    }, 8000);
    return () => window.clearInterval(interval);
  }, [canRotate, visibleProjects.length]);

  if (visibleProjects.length === 0) return null;

  const selectedIndex = activeIndex % visibleProjects.length;
  const selected = visibleProjects[selectedIndex];
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

            <div className="featured__progress" data-running={canRotate} key={`${selected.id}-${canRotate}`} aria-hidden="true" />


          </div>
        </div>
      </div>
    </section>
  );
}
