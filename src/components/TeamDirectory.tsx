import { useState } from 'react';
import type { Member } from '../lib/content';

type Props = { members: readonly Member[]; teamId: string; teamName: string };
const defaultRoles: Record<string, string> = { software: 'Software Engineer', game: 'Game Developer' };
const initials = (name: string) => name.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase();

function Portrait({ member, teamId, teamName }: { member: Member; teamId: string; teamName: string }) {
  const [expanded, setExpanded] = useState(false);
  const linksId = `${teamId}-${member.id}-links`;
  const detailsId = `${teamId}-${member.id}-details`;
  const role = teamId === 'alumni'
    ? member.formerTeams.join(' / ')
    : member.role?.trim() || (defaultRoles[teamId] || `${teamName} Team Member`);
  const hasDetails = Boolean(member.major || member.year || member.email || member.linkedin || member.portfolio);

  return (
    <article className="team-member" data-expanded={expanded}
      onPointerEnter={(event) => { if (event.pointerType === 'mouse') setExpanded(true); }}
      onPointerLeave={(event) => {
        if (event.pointerType === 'mouse' && !event.currentTarget.contains(document.activeElement)) setExpanded(false);
      }}
      onFocus={(event) => { if (event.target.matches(':focus-visible')) setExpanded(true); }}
      onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setExpanded(false); }}
      onKeyDown={(event) => { if (event.key === 'Escape') setExpanded(false); }}>
      <button className="team-member__portrait" type="button"
        aria-label={`Details about ${member.name}`} aria-expanded={hasDetails ? expanded : undefined}
        aria-controls={hasDetails ? `${detailsId}${member.email || member.linkedin || member.portfolio ? ` ${linksId}` : ''}` : undefined} disabled={!hasDetails}
        onClick={() => setExpanded((value) => !value)}>
        <span className="team-member__initials" aria-hidden="true">{initials(member.name)}</span>
        <img src={member.image} alt={member.name} loading="lazy" decoding="async"
          onError={(event) => { event.currentTarget.style.display = 'none'; }} />
      </button>
      <div className="team-member__heading">
        <h3>{member.name}</h3>
        {(member.email || member.linkedin || member.portfolio) && <div className="team-member__links" id={linksId}>
          {member.email && <a href={`mailto:${member.email}`} aria-label={`Email ${member.name}`} title={`Email ${member.name}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <rect x="3" y="5" width="18" height="14" rx="1" /><path d="m3 6 9 7 9-7" />
            </svg>
          </a>}
          {member.linkedin && <a href={member.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" title="LinkedIn">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M20.45 2H3.55C2.69 2 2 2.68 2 3.52v16.96C2 21.32 2.69 22 3.55 22h16.9c.86 0 1.55-.68 1.55-1.52V3.52C22 2.68 21.31 2 20.45 2ZM7.93 18.75H4.98V9.2h2.95v9.55ZM6.45 7.89a1.71 1.71 0 1 1 0-3.42 1.71 1.71 0 0 1 0 3.42Zm12.3 10.86H15.8V14.1c0-1.11-.02-2.54-1.55-2.54-1.55 0-1.79 1.21-1.79 2.46v4.73H9.51V9.2h2.83v1.3h.04c.39-.74 1.36-1.52 2.79-1.52 2.98 0 3.58 1.96 3.58 4.51v5.26Z" />
            </svg>
          </a>}
          {member.portfolio && <a href={member.portfolio} target="_blank" rel="noreferrer" aria-label="Portfolio" title="Portfolio">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M14 4h6v6M20 4l-9 9" /><path d="M20 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h4" />
            </svg>
          </a>}
        </div>}
      </div>
      {role && <p className="team-member__role">{role}</p>}
      <div className="team-member__details" id={detailsId}>
        {member.major && <p>{member.major}</p>}
        {member.year && <p>Class of {member.year}</p>}
      </div>
    </article>
  );
}

export default function TeamDirectory({ members, teamId, teamName }: Props) {
  return <div className="team-portraits">
    {members.map((member) => <Portrait key={member.id} member={member} teamId={teamId} teamName={teamName} />)}
  </div>;
}
