import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';

import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import * as schema from "./schema"
import { userTable, sessionTable } from './schema';

config({ path: '.env' });

const client = createClient({
  url: process.env.TURSO_CONNECTION_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export const db = drizzle(client, {schema: schema});
export const adapter = new DrizzleSQLiteAdapter(db, sessionTable, userTable);