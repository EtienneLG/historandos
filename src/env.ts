import { z } from 'zod';

/**
 * DEMO branch: this app never reads/writes the real database or calls the
 * Infomaniak Drive AP, so those secrets are optional.
 */
const envSchema = z.object({
  DATABASE_URL: z.url().default('postgres://demo:demo@localhost:5432/demo'),
  DIRECT_DATABASE_URL: z.url().optional(),
  JWT_SECRET_KEY: z.string().min(1),
  LOGIN_PASSWORD: z.string().min(1),

  INFOMANIAK_DRIVE_SECRET: z.string().min(1).default('demo'),
  INFOMANIAK_DRIVE_ID: z.string().min(1).default('demo'),
  INFOMANIAK_LOGIN_QA_ID: z.string().min(1).default('demo'),
  INFOMANIAK_TRACE_DIR_ID: z.string().min(1).default('demo'),
});

export const env = envSchema.parse(process.env);
