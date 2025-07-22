import { defineCollection, z } from "astro:content";

export const seals = defineCollection({
  type: "data",
  schema: ({ image }) =>
    z.object({
      name: z.string().min(1),
      image: image(),
      author: z.string().min(1),
      flavourtext: z.string().optional(),
      sealMarginTop: z.number().optional(), // New optional field, in px
    }),
});

const people = defineCollection({
  type: "data",
  schema: ({ image }) =>
    z.object({
      name: z.string().min(1),
      image: image().optional(),
      description: z.string().optional(),
      socials: z
        .array(
          z.object({
            platform: z.string(),
            url: z.string().url(),
            icon: z.string(),
          }),
        )
        .optional(),
      enrollments: z.array(
        z.object({
          year: z.number().int().positive(),
          role: z.string().min(1).optional(),
        }),
      ),
    }),
});

const placementSchema = z.object({
  year: z.number(),
  teamName: z.string().optional(),
  globalPlacement: z.number(),
  australiaPlacement: z.number().optional(),
  totalTeams: z.number().optional(),
});

export const ctfs = defineCollection({
  type: "data",
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      image: image().optional(),
      placements: z.array(placementSchema),
    }),
});

const writeups = defineCollection({
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    updatedDate: z.date().optional(),
    ctf: z.string().optional(),
    category: z.string().optional(),
    section: z.string().optional(),
    tags: z.array(z.string()).optional().default([]),
    author: z.string().optional(),
    image: image().optional(),
    hidden: z.boolean().optional().default(false),
  }),
});

const blogs = defineCollection({
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    lastUpdated: z.date().optional(),
    author: z.string().optional(),
    section: z.string().optional(),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
    image: image().optional(),
    featured: z.boolean().optional().default(false),
    draft: z.boolean().optional().default(false),
    hidden: z.boolean().optional().default(false),
    readingTime: z.number().optional(), // Optional manual override for reading time
    series: z.string().optional(), // For blog post series
    seriesOrder: z.number().optional(), // Order within a series
  }),
});

const sections = defineCollection({
  type: 'data',
  schema: ({ image }) => z.object({
    name: z.string(),
    icon: z.string().optional(),
    iconImage: image().optional(),
    description: z.string().optional(),
    color: z.string().optional(),
    image: image().optional(), // Add image field for section background
  }),
});

export const tools = defineCollection({
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string().optional(),
    url: z.string().url().optional(),
    github: z.string().url().optional(),
    documentation: z.string().url().optional(),
    platforms: z.array(z.enum([
      'windows', 
      'macos', 
      'linux', 
      'android', 
      'ios', 
      'web', 
      'cli', 
      'multiplatform',
      'docker'
    ])).optional().default([]),
    logo: image().optional(),
    categories: z.array(z.string()).optional().default([]),
    tags: z.array(z.string()).optional().default([]),
    hidden: z.boolean().optional().default(false),
  }),
});

export const categories = defineCollection({
  type: 'data',
  schema: ({ image }) => z.object({
    name: z.string(),
    icon: z.string().optional(),
    iconImage: image().optional(),
    description: z.string().optional(),
    color: z.string().optional(),
  }),
});

export const scrapbook = defineCollection({
  type: "data",
  schema: ({ image }) =>
    z.object({
      title: z.string().min(1),
      image: image(),
      date: z.date().or(z.string()).optional(), // Support both Date objects and ISO strings
      createdAt: z.date().or(z.string()).optional(), // Alternative date field
      description: z.string().optional(),
      location: z.string().optional(),
      tags: z.array(z.string()).optional().default([]),
      featured: z.boolean().optional().default(false),
      hidden: z.boolean().optional().default(false),
      photographer: z.string().optional(), // Who took the photo
      camera: z.string().optional(), // Camera/device used
      settings: z.object({
        aperture: z.string().optional(),
        shutter: z.string().optional(),
        iso: z.number().optional(),
        focalLength: z.string().optional(),
      }).optional(), // Camera settings for photography enthusiasts
    }),
});

export const collections = {
  seals,
  people,
  ctfs,
  writeups,
  blogs,
  sections,
  tools,
  categories,
  scrapbook
};