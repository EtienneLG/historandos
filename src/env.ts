import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.url(),
  DIRECT_DATABASE_URL: z.url().optional(),
  JWT_SECRET_KEY: z.string().min(1),
  LOGIN_PASSWORD: z.string().min(1),

  // Supabase Storage — not wired up yet, kept optional until the upload
  // feature lands so this module doesn't block unrelated work.
  SUPABASE_URL: z.url().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),

  INFOMANIAK_DRIVE_SECRET: z.string().min(1),
  INFOMANIAK_DRIVE_ID: z.string().min(1),
  INFOMANIAK_METADATA_ID: z.string().min(1),
  INFOMANIAK_LOGIN_QA_ID: z.string().min(1),
  INFOMANIAK_TRACE_DIR_ID: z.string().min(1),
});

export const env = envSchema.parse(process.env);
