import { dbPath } from './lib.ts'

import { existsSync } from 'jsr:@std/fs/exists'
import { DatabaseSync } from 'node:sqlite'

// check for db
if (!existsSync(dbPath)) throw new Error('Database not found')
const db = new DatabaseSync(dbPath, { readOnly: true })

class RestaurantClient {
    getAllCity = (): string[] => (db.prepare('select city from restaurant group by city order by count(*) desc').all() as { city: string }[]).map((item) => item.city)
    getAllCountry = (): string[] => (db.prepare('select country from restaurant group by country order by count(*) desc').all() as { country: string }[]).map((item) => item.country)
    getAllCuisine = (): string[] => (db.prepare(`with cuisine as (select json_each.value as cuisine from restaurant, json_each(cuisine)) select cuisine from cuisine group by cuisine order by count(*) desc`).all() as { cuisine: string }[]).map((item) => item.cuisine)
}

export const restaurantClient = new RestaurantClient()
