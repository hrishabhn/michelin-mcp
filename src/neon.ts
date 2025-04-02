import { neon } from 'jsr:@neon/serverless'
export const sql = neon(Deno.env.get('DATABASE_URL')!)
