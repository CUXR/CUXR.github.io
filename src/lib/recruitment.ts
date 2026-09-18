import { z } from 'zod';
import data from '../data/recruitment.json';

const timestamp = z.iso.datetime({ offset: true });
const eventSchema = z.object({
  id: z.string().min(1), title: z.string().min(1), location: z.string().min(1),
  startsAt: timestamp, endsAt: timestamp,
}).refine((event) => Date.parse(event.endsAt) > Date.parse(event.startsAt), 'Event must end after it starts');

export const recruitmentSchema = z.object({
  enabled: z.boolean(), season: z.string().min(1), audience: z.string().min(1),
  opensAt: timestamp, closesAt: timestamp, upperclassmenClosesAt: timestamp,
  timeZone: z.string().refine((value) => {
    try { new Intl.DateTimeFormat('en-US', { timeZone: value }); return true; } catch { return false; }
  }, 'Use an IANA time zone').optional().default('America/New_York'),
  applicationUrl: z.url().startsWith('https://').nullish(), coffeeChatUrl: z.url().startsWith('https://').nullish(),
  events: z.array(eventSchema),
}).refine((config) => Date.parse(config.closesAt) > Date.parse(config.opensAt), 'Recruitment must close after it opens')
  .refine((config) => new Set(config.events.map((event) => event.id)).size === config.events.length, 'Event ids must be unique');

export type Recruitment = z.infer<typeof recruitmentSchema>;
export const recruitment = recruitmentSchema.parse(data);

/** Shared by prerendering and browser timers; the closing instant is exclusive. */
export function isRecruiting(config: Recruitment, now = Date.now()): boolean {
  return config.enabled && now >= Date.parse(config.opensAt) && now < Date.parse(config.closesAt);
}

export function upcomingEvents(config: Recruitment, now = Date.now()) {
  return config.events.filter((event) => Date.parse(event.endsAt) > now).sort((a, b) => Date.parse(a.startsAt) - Date.parse(b.startsAt));
}

export function deadlineLabel(config: Recruitment): string {
  return new Intl.DateTimeFormat('en-US', { timeZone: config.timeZone, month: 'long', day: 'numeric' }).format(new Date(config.closesAt));
}
