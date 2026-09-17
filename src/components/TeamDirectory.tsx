import { useEffect, useMemo, useState } from 'react';
import type { Member } from '../lib/content';

type TeamId = 'lead' | 'haptics' | 'bci' | 'software' | 'game' | 'business' | 'alumni';

type TeamDirectoryProps = {
  members: readonly Member[];
};

const filters: readonly { id: TeamId | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'lead', label: 'Leads' },
  { id: 'haptics', label: 'Haptics' },
  { id: 'bci', label: 'BCI' },
  { id: 'software', label: 'Software' },
  { id: 'game', label: 'Game' },
  { id: 'business', label: 'Business' },
  { id: 'alumni', label: 'Alumni' },
];

const initials = (name: string) => name.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase();
const filterFromHash = (): TeamId | 'all' => {
  const hash = window.location.hash.replace(/^#directory-?/, '');
  return filters.some((filter) => filter.id === hash) ? hash as TeamId | 'all' : 'all';
};

export default function TeamDirectory({ members }: TeamDirectoryProps) {
  const [activeFilter, setActiveFilter] = useState<TeamId | 'all'>('all');
  useEffect(() => {
    const applyHashFilter = () => setActiveFilter(filterFromHash());
    applyHashFilter();
    window.addEventListener('hashchange', applyHashFilter);
    return () => window.removeEventListener('hashchange', applyHashFilter);
  }, []);

  const filteredMembers = useMemo(
    () => activeFilter === 'all' ? members : members.filter((member) => member.teams.includes(activeFilter)),
    [activeFilter, members],
  );

  return (
    <div className="directory">
      <nav className="directory__filters" aria-label="Filter team directory">
        {filters.map((filter) => (
          <button
            className={`directory__filter${activeFilter === filter.id ? ' directory__filter--active' : ''}`}
            id={`directory-${filter.id}`}
            type="button"
            aria-pressed={activeFilter === filter.id}
            onClick={() => setActiveFilter(filter.id)}
            key={filter.id}
          >
            {filter.label}
          </button>
        ))}
      </nav>
      <p className="directory__status" role="status" aria-live="polite">
        Showing {filteredMembers.length} {filteredMembers.length === 1 ? 'member' : 'members'}
      </p>

      <div className="directory__grid">
        {filteredMembers.map((member) => (
          <article className="member-card" id={`member-${member.id}`} key={member.id}>
            <div className="member-card__portrait">
              <span className="member-card__initials" aria-hidden="true">{initials(member.name)}</span>
              {member.image && (
                <img
                  src={member.image}
                  alt={`${member.name}, ${member.role}`}
                  loading="lazy"
                  decoding="async"
                  onError={(event) => {
                    event.currentTarget.hidden = true;
                  }}
                />
              )}
            </div>
            <div className="member-card__body">
              <h3>{member.name}</h3>
              <p className="member-card__role">{member.role}</p>
              <dl className="member-card__details">
                {member.major && <div><dt>Major</dt><dd>{member.major}</dd></div>}
                {member.year && <div><dt>Year</dt><dd>{member.year}</dd></div>}
              </dl>
              <div className="member-card__links">
                {member.email && <a className="text-link link--external" href={`mailto:${member.email}`}>Email</a>}
                {member.linkedin && <a className="text-link link--external" href={member.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>}
              </div>
            </div>
          </article>
        ))}
      </div>

      {filteredMembers.length === 0 && <p className="directory__empty">No team members are listed in this group yet.</p>}
    </div>
  );
}
