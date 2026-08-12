import { z } from 'zod';
export const schemas = {
  pages: {
    home: z.object({
      "hero": z.object({
        "greeting": z.string(),
        "tagline": z.string(),
        "mainChannelLabel": z.string(),
        "mainChannelUrl": z.string()
      }),
      "catalog": z.object({
        "sectionTitle": z.string(),
        "sectionSubtitle": z.string(),
        "rulesUrl": z.string(),
        "items": z.array(z.object({
          "id": z.string(),
          "name": z.string(),
          "description": z.string(),
          "price": z.string()
        }))
      }),
      "cart": z.object({
        "ctaLabel": z.string(),
        "ctaSubtext": z.string()
      })
    }),
    catalog: z.object({
      "meta": z.object({
        "title": z.string(),
        "description": z.string()
      }),
      "hero": z.object({
        "eyebrow": z.string(),
        "title": z.string(),
        "subtitle": z.string()
      }),
      "rulesUrl": z.string(),
      "mainChannelUrl": z.string(),
      "categories": z.array(z.object({
        "id": z.string(),
        "name": z.string(),
        "description": z.string(),
        "items": z.array(z.object({
          "id": z.string(),
          "name": z.string(),
          "description": z.string(),
          "price": z.string(),
          "badge": z.string(),
          "type": z.string(),
          "stock": z.number().optional()
        }))
      })),
      "reminders": z.object({
        "title": z.string(),
        "lines": z.array(z.string())
      })
    }),
    cart: z.object({
      "hero": z.object({
        "title": z.string(),
        "subtitle": z.string()
      }),
      "empty": z.object({
        "message": z.string(),
        "browseCta": z.string()
      }),
      "email": z.object({
        "heading": z.string(),
        "body": z.string(),
        "namePlaceholder": z.string(),
        "emailPlaceholder": z.string(),
        "confirmText": z.string(),
        "submitCta": z.string(),
        "backLabel": z.string()
      }),
      "processing": z.object({
        "heading": z.string(),
        "body": z.string()
      }),
      "success": z.object({
        "heading": z.string(),
        "body": z.string(),
        "webhookLabel": z.string(),
        "continueCta": z.string()
      }),
      "error": z.object({
        "heading": z.string(),
        "fallback": z.string(),
        "retryCta": z.string()
      }),
      "reminders": z.object({
        "title": z.string(),
        "lines": z.array(z.string())
      })
    })
  }
};
export type Schemas = typeof schemas;