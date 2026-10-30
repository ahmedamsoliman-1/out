import { z } from "zod";

export const eventStatusSchema = z.enum(["draft", "in_review", "published", "cancelled", "sold_out", "expired", "archived"]);
export const contextSchema = z.enum(["date", "solo", "group", "family"]);
export const eventSchema = z.object({
  id: z.string(), slug: z.string(), title: z.string().min(2), city: z.literal("dubai"), area: z.string(),
  venue: z.string(), startAt: z.string().datetime(), endAt: z.string().datetime().optional(), timezone: z.literal("Asia/Dubai"),
  status: eventStatusSchema, categories: z.array(z.string()), vibes: z.array(z.string()), goodFor: z.array(contextSchema),
  effort: z.enum(["Easy", "A little effort", "Make a night of it"]), indoorOutdoor: z.enum(["Indoor", "Outdoor", "Mixed"]),
  price: z.object({ label: z.string(), min: z.number().optional(), max: z.number().optional(), isFree: z.boolean() }),
  whyGo: z.string(), qualityScore: z.number().min(0).max(100), featured: z.boolean(),
  image: z.object({ url: z.string(), alt: z.string(), sourceName: z.string(), rightsStatus: z.enum(["owned", "licensed", "provided"]) }),
  bookingUrl: z.string().url().optional(), mapsUrl: z.string().url().optional(), description: z.string(), createdAt: z.string().datetime(), updatedAt: z.string().datetime()
});
export type Event = z.infer<typeof eventSchema>;
export const preferencesSchema = z.object({ city: z.literal("dubai").default("dubai"), categories: z.array(z.string()).max(6), budget: z.enum(["Free mostly", "Under AED 150", "AED 150–400", "No fixed limit"]), areas: z.array(z.string()).max(5), contexts: z.array(contextSchema).min(1) });
export type Preferences = z.infer<typeof preferencesSchema>;
export const eventQuerySchema = z.object({ date: z.enum(["tonight", "weekend", "all"]).default("tonight"), area: z.string().optional(), category: z.string().optional(), vibe: z.string().optional(), context: contextSchema.optional(), format: z.enum(["Indoor", "Outdoor", "Mixed"]).optional(), free: z.coerce.boolean().optional() });
export const submissionSchema = z.object({ title: z.string().min(3).max(120), organizerName: z.string().min(2), organizerEmail: z.string().email(), venue: z.string().min(2), area: z.string().min(2), startAt: z.string().datetime(), bookingUrl: z.string().url().optional(), description: z.string().min(20).max(2000), imageUrl: z.string().url().optional(), permissionsConfirmed: z.literal(true) });
export type Submission = z.infer<typeof submissionSchema>;
export const apiErrorSchema = z.object({ error: z.object({ code: z.string(), message: z.string() }) });
