import { defineConfig } from 'drizzle-kit';
import { url } from './src/database/connection';

export default defineConfig({
    schema: './src/database/schema.ts',
    out: './src/database/migrations',
    dialect: 'mysql',
    dbCredentials: {
        url: url,
    },
    verbose: true,
    strict: true
});