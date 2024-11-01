import { drizzle } from "drizzle-orm/mysql2";
import * as schema from './schema';

export const url: string = `mysql://${Bun.env.DB_USER}:${Bun.env.DB_PASSWORD}@${Bun.env.DB_HOST}:${Bun.env.DB_PORT}/${Bun.env.DB_NAME}`

export const db = drizzle(url, {
    schema,
    mode: 'planetscale',
    logger: true
});