import { existsSync } from 'node:fs';
import { z } from 'zod';
import projectData from '../data/projects.json';
import memberData from '../data/members.json';
import subteamData from '../data/subteams.json';

const slug = z.string().regex(/^[a-z0-9-]+$/);
const image = z.string().startsWith('/');
const projectSchema = z.object({
  id: slug, title: z.string().min(1), category: z.string().min(1),
  summary: z.string().min(1), description: z.string().min(1),
  image, imageAlt: z.string().min(1),
  status: z.enum(['active', 'archived', 'hidden']), featured: z.boolean(),
});
const memberSchema = z.object({
  id: slug, name: z.string().min(1), role: z.string().optional(), teams: z.array(z.enum(['lead', 'haptics', 'bci', 'software', 'game', 'business', 'alumni'])),
  major: z.string(), year: z.string(),
  email: z.union([z.email(), z.literal('')]),
  formerTeams: z.array(z.string().min(1)).default([]),
  portfolio: z.union([z.url().startsWith('https://'), z.literal('')]).optional(),
  linkedin: z.union([z.url().startsWith('https://'), z.literal('')]),
}).transform((member) => {
  const image = `/team/headshots/${member.id}.webp`;
  return { ...member, image: existsSync(`public${image}`) ? image : null };
});

/** Duplicate anchors silently break navigation; reject them during builds. */
function uniqueById<T extends { id: string }>(items: T[]): T[] {
  if (new Set(items.map(({ id }) => id)).size !== items.length) throw new Error('Duplicate content id');
  return items;
}

export type Project = z.infer<typeof projectSchema>;
export type Member = z.infer<typeof memberSchema>;
export const projects = uniqueById(z.array(projectSchema).parse(projectData)).filter((project) => project.status !== 'hidden');
export const members = uniqueById(z.array(memberSchema).parse(memberData));
export const subteams = uniqueById(z.array(z.object({ id: slug, name: z.string(), description: z.string() })).parse(subteamData));
