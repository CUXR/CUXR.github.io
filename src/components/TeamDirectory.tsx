import ResponsiveImage from './ResponsiveImage';
import { useEffect, useRef, useState } from 'react';
import type { Member } from '../lib/content';

type Props = { members: readonly Member[]; teamId: string; teamName: string };
const defaultRoles: Record<string, string> = { software: 'Software Engineer', game: 'Game Developer' };
const genericRole = (teamId: string, teamName: string) => defaultRoles[teamId] || `${teamName} Team Member`;

function MemberCard({ member, teamId, teamName }: { member: Member; teamId: string; teamName: string }) {
  const bodyRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const body = bodyRef.current;
    if (!body || !member.image) return;
    const name = body.querySelector('h3')!;
    const role = body.querySelector<HTMLElement>('.team-member__role');
    const links = [...body.querySelectorAll<HTMLElement>('.team-member__links a')];
    const canvas = document.createElement('canvas').getContext('2d')!;
    const textWidth = (element: HTMLElement) => {
      const style = getComputedStyle(element);
      canvas.font = style.font;
      canvas.letterSpacing = style.letterSpacing;
      return canvas.measureText(element.querySelector('.team-member__role-main')?.textContent || element.textContent || '').width;
    };
    const layout = () => {
      const width = body.clientWidth;
      const elements = [name, role];
      const counts = elements.map((element) => element
        ? Math.max(0, Math.floor((width - textWidth(element) - 8) / 28)) : 0);
      counts[0] = Math.min(counts[0], links.length);
      counts[1] = Math.min(counts[1], links.length - counts[0]);
      let remaining = links.length - counts[0] - counts[1];
      // Use spare space first; wrap the name before narrowing the role.
      for (const [index, element] of elements.entries()) {
        if (!element || !remaining) continue;
        textWidth(element);
        const longestWord = Math.max(...(element.querySelector('.team-member__role-main')?.textContent || element.textContent || '').split(/\s+/).map((word) => canvas.measureText(word).width));
        const capacity = Math.max(0, Math.floor((width - longestWord - 8) / 28));
        const extra = Math.min(remaining, Math.max(0, capacity - counts[index]));
        counts[index] += extra;
        remaining -= extra;
      }
      counts[role ? 1 : 0] += remaining;
      let nameColumns = counts[0];
      const nameWraps = textWidth(name) + (counts[0] ? counts[0] * 28 + 4 : 0) > width;
      if (nameWraps && links.length) {
        textWidth(name);
        const longestWord = Math.max(...(name.textContent || '').split(/\s+/).map((word) => canvas.measureText(word).width));
        nameColumns = Math.min(links.length, Math.max(1, Math.floor((width - longestWord - 4) / 28)));
        counts[0] = links.length;
        counts[1] = 0;
      }
      name.style.setProperty('--contact-height', nameColumns ? `${Math.ceil(counts[0] / nameColumns) * 24}px` : '0px');
      let placed = 0;
      for (const [index, element] of elements.entries()) {
        const count = counts[index];
        const columns = index === 0 ? nameColumns : count;
        element?.style.setProperty('--contact-space', `${columns ? columns * 28 + 4 : 0}px`);
        for (let slot = 0; slot < count; slot++) {
          links[placed].style.setProperty('--contact-row', `${index + 1}`);
          links[placed].style.setProperty('--contact-top', `${Math.floor(slot / columns) * 24}px`);
          links[placed++].style.setProperty('--contact-offset', `${(columns - slot % columns - 1) * 28}px`);
        }
      }
      body.style.setProperty('--details-row', '3');
    };
    const observer = new ResizeObserver(layout);
    observer.observe(body);
    void document.fonts.ready.then(() => { if (body.isConnected) layout(); });
    return () => observer.disconnect();
  }, [member.image]);
  const [expanded, setExpanded] = useState(false);
  useEffect(() => {
    if (!expanded) return;
    const dismissOutside = (event: PointerEvent) => {
      const row = bodyRef.current?.closest('article');
      if (event.target instanceof Node && !row?.contains(event.target)) setExpanded(false);
    };
    document.addEventListener('pointerdown', dismissOutside);
    return () => document.removeEventListener('pointerdown', dismissOutside);
  }, [expanded]);
  const linksId = `${teamId}-${member.id}-links`;
  const detailsId = `${teamId}-${member.id}-details`;
  const role = teamId === 'alumni'
    ? `Former ${member.role?.trim() || member.formerTeams.map((team) => genericRole(team.toLowerCase(), team)).join(' / ')}`
    : member.role?.trim() || genericRole(teamId, teamName);
  const hasDetails = Boolean(member.major || member.year || member.email || member.linkedin || member.portfolio);

  return (
    <article className={`team-member${member.image ? '' : ' team-member--compact'}`} data-expanded={expanded}
      onClick={(event) => {
        if (!member.image && hasDetails && window.matchMedia('(max-width: 600px)').matches
          && !(event.target as Element).closest('a, button')) setExpanded((value) => !value);
      }}
      onPointerEnter={(event) => { if (event.pointerType === 'mouse') setExpanded(true); }}
      onPointerLeave={(event) => {
        if (event.pointerType === 'mouse' && !event.currentTarget.contains(document.activeElement)) setExpanded(false);
      }}
      onFocus={(event) => { if (event.target.matches(':focus-visible')) setExpanded(true); }}
      onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setExpanded(false); }}
      onKeyDown={(event) => { if (event.key === 'Escape') setExpanded(false); }}>
      {member.image && <button className="team-member__portrait" type="button"
        aria-label={`Details about ${member.name}`} aria-expanded={hasDetails ? expanded : undefined}
        aria-controls={hasDetails ? `${detailsId}${member.email || member.linkedin || member.portfolio ? ` ${linksId}` : ''}` : undefined} disabled={!hasDetails}
        onClick={() => setExpanded((value) => !value)}>
        <ResponsiveImage src={member.image} alt={member.name} preset="portrait" width={711} height={1080}
          sizes="(max-width: 600px) calc((100vw - 64px) / 2), (max-width: 900px) 30vw, (max-width: 1408px) 22vw, 302px"
          onError={(event) => { event.currentTarget.style.display = 'none'; }} />
      </button>}
      <div className="team-member__body" ref={bodyRef}>
      <div className="team-member__heading">
        <h3>{member.image ? member.name : <button className="team-member__compact-toggle" type="button"
          aria-expanded={hasDetails ? expanded : undefined}
          aria-controls={hasDetails ? `${detailsId}${member.email || member.linkedin || member.portfolio ? ` ${linksId}` : ''}` : undefined}
          disabled={!hasDetails} onClick={() => setExpanded((value) => !value)}>{member.name}</button>}</h3>
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
      {role && <p className="team-member__role">
        {member.id === 'ethan-ngai' && teamId === 'software' ? <>
          <span className="team-member__role-main">{role}</span>
          <span className="team-member__role-easter-egg">+ Web Dev Lead</span>
        </> : role}
      </p>}
      <div className="team-member__details" id={detailsId}>
        {member.major && <p>{member.major}</p>}
        {member.year && <p>Class of {member.year}</p>}
      </div>
      </div>
    </article>
  );
}

export default function TeamDirectory({ members, teamId, teamName }: Props) {
  const portraits = members.filter((member) => member.image);
  const compact = members.filter((member) => !member.image);
  return <div className="team-portraits">
    {portraits.map((member) => <MemberCard key={member.id} member={member} teamId={teamId} teamName={teamName} />)}
    {compact.length > 0 && <div className={`team-roster${portraits.length % 4 === 0 ? ' team-roster--desktop-row' : ''}${portraits.length % 3 === 0 ? ' team-roster--tablet-row' : ''}`}>
      {compact.map((member) => <MemberCard key={member.id} member={member} teamId={teamId} teamName={teamName} />)}
    </div>}
  </div>;
}
