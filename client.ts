import { dbPath } from './lib.ts'
import { AwardSchema, PriceSchema } from './schema.ts'

import { existsSync } from 'jsr:@std/fs/exists'
import { Database } from 'jsr:@db/sqlite'
import z from 'npm:zod'

// check for db
if (!existsSync(dbPath)) throw new Error('Database not found')
const db = new Database(dbPath, { readonly: true })

// pagination
type PaginatedResult<T> = {
    data: T[]
    total: number
    nextOffset: number
}

const limit = 15

// params
export const GetAllRestaurantFilterSchema = z.object({
    city: z.string().optional(),
    country: z.string().optional(),
    minPrice: PriceSchema.optional(),
    maxPrice: PriceSchema.optional(),
    cuisine: z.string().optional(),
    award: AwardSchema.optional(),
    greenStar: z.boolean().optional(),
    facilitiesAndServices: z.string().optional(),
})

type GetAllRestaurantFilter = z.infer<typeof GetAllRestaurantFilterSchema>

class RestaurantClient {
    getAllCity = (offset: number = 0): PaginatedResult<string> => ({
        nextOffset: offset + limit,
        total: (db.prepare('select count(*) as count from (select city from restaurant group by city)').get() as { count: number }).count,
        data: (db.prepare('select city from restaurant group by city order by count(*) desc limit ? offset ?').all(limit, offset) as { city: string }[]).map((item) => item.city),
    })

    getAllCountry = (offset: number = 0): PaginatedResult<string> => ({
        nextOffset: offset + limit,
        total: (db.prepare('select count(*) as count from (select country from restaurant group by country)').get() as { count: number }).count,
        data: (db.prepare('select country from restaurant group by country order by count(*) desc limit ? offset ?').all(limit, offset) as { country: string }[]).map((item) => item.country),
    })

    getAllCuisine = (offset: number = 0): PaginatedResult<string> => ({
        nextOffset: offset + limit,
        total: (db.prepare(`select count(*) as count from (with cuisine as (select json_each.value as cuisine from restaurant, json_each(cuisine)) select cuisine from cuisine group by cuisine)`).get() as { count: number }).count,
        data: (db.prepare(`with cuisine as (select json_each.value as cuisine from restaurant, json_each(cuisine)) select cuisine from cuisine group by cuisine order by count(*) desc limit ? offset ?`).all(limit, offset) as { cuisine: string }[]).map((item) => item.cuisine),
    })

    getAllFacilitiesAndServices = (offset: number = 0): PaginatedResult<string> => ({
        nextOffset: offset + limit,
        total: (db.prepare('select count(*) as count from (with facilities_and_services as (select json_each.value as facilities_and_services from restaurant, json_each(facilities_and_services)) select facilities_and_services from facilities_and_services group by facilities_and_services)').get() as { count: number }).count,
        data: (db.prepare('with facilities_and_services as (select json_each.value as facilities_and_services from restaurant, json_each(facilities_and_services)) select facilities_and_services from facilities_and_services group by facilities_and_services order by count(*) desc limit ? offset ?').all(limit, offset) as { facilities_and_services: string }[]).map((item) => item.facilities_and_services),
    })

    getAllRestaurant = (offset: number = 0, filter: GetAllRestaurantFilter): PaginatedResult<unknown> => {
        const whereItems: string[] = []

        if (filter.city !== undefined) whereItems.push(`city = '${filter.city}'`)
        if (filter.country !== undefined) whereItems.push(`country = '${filter.country}'`)
        if (filter.minPrice !== undefined) whereItems.push(`price >= '${filter.minPrice}'`)
        if (filter.maxPrice !== undefined) whereItems.push(`price <= '${filter.maxPrice}'`)
        if (filter.cuisine !== undefined) whereItems.push(`json_extract(cuisine, '$') like '%${filter.cuisine}%'`)
        if (filter.award !== undefined) whereItems.push(`award = '${filter.award}'`)
        if (filter.greenStar !== undefined) whereItems.push(`green_star = ${filter.greenStar ? 1 : 0}`)
        if (filter.facilitiesAndServices !== undefined) whereItems.push(`json_extract(facilities_and_services, '$') like '%${filter.facilitiesAndServices}%'`)

        const where = whereItems.length > 0 ? `where ${whereItems.join(' and ')}` : ''

        return {
            nextOffset: offset + limit,
            total: (db.prepare(`select count(*) as count from restaurant ${where}`).get() as { count: number }).count,
            data: (db.prepare(`select * from restaurant ${where} order by name limit ? offset ?`).all(limit, offset)),
        }
    }
}

export const restaurantClient = new RestaurantClient()
