import { sql } from './neon.ts'
import { AwardSchema, PriceSchema } from './schema.ts'

import z from 'npm:zod'

// pagination
type PaginatedResult<T> = {
    nextOffset: number
    total: number
    data: T[]
}

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
    getAllCity = async (offset: number = 0): Promise<PaginatedResult<string>> => {
        const limit = 100
        return ({
            nextOffset: offset + limit,
            total: ((await sql`select count(distinct city) as count from restaurant`)[0].count as number),
            data: ((await sql`select city from restaurant group by city order by count(*) desc limit ${limit} offset ${offset}`) as { city: string }[]).map((item) => item.city),
        })
    }

    getAllCountry = async (offset: number = 0): Promise<PaginatedResult<string>> => {
        const limit = 100
        return ({
            nextOffset: offset + limit,
            total: ((await sql`select count(distinct country) as count from restaurant`)[0].count as number),
            data: ((await sql`select country from restaurant group by country order by count(*) desc limit ${limit} offset ${offset}`) as { country: string }[]).map((item) => item.country),
        })
    }

    getAllCuisine = async (offset: number = 0): Promise<PaginatedResult<string>> => {
        const limit = 100
        return ({
            nextOffset: offset + limit,
            total: ((await sql`select count(distinct cuisine) as count from (select unnest(cuisine) as cuisine from restaurant)`)[0].count as number),
            data: ((await sql`select distinct cuisine, count(*) as count from (select unnest(cuisine) as cuisine from restaurant) group by cuisine order by count desc limit ${limit} offset ${offset}`) as { cuisine: string }[]).map((item) => item.cuisine),
        })
    }

    getAllFacilitiesAndServices = async (offset: number = 0): Promise<PaginatedResult<string>> => {
        const limit = 100
        return ({
            nextOffset: offset + limit,
            total: ((await sql`select count(distinct facilities_and_services) as count from (select unnest(facilities_and_services) as facilities_and_services from restaurant)`)[0].count as number),
            data: ((await sql`select distinct facilities_and_services, count(*) as count from (select unnest(facilities_and_services) as facilities_and_services from restaurant) group by facilities_and_services order by count desc limit ${limit} offset ${offset}`) as { facilities_and_services: string }[]).map((item) => item.facilities_and_services),
        })
    }

    getAllRestaurant = async (offset: number = 0, filter: GetAllRestaurantFilter): Promise<PaginatedResult<unknown>> => {
        const limit = 20

        const where = sql`
            where true
            and ${filter.city !== undefined ? sql`city = ${filter.city}` : 'true'}
            and ${filter.country !== undefined ? sql`country = ${filter.country}` : 'true'}
            and ${filter.minPrice !== undefined ? sql`price >= ${filter.minPrice}` : 'true'}
            and ${filter.maxPrice !== undefined ? sql`price <= ${filter.maxPrice}` : 'true'}
            and ${filter.cuisine !== undefined ? sql`any(cuisine) = ${filter.cuisine}` : 'true'}
            and ${filter.award !== undefined ? sql`award = ${filter.award}` : 'true'}
            and ${filter.greenStar !== undefined ? sql`green_star = ${filter.greenStar ? 1 : 0}` : 'true'}
            and ${filter.facilitiesAndServices !== undefined ? sql`any(facilities_and_services) = ${filter.facilitiesAndServices}` : 'true'}
        `

        return {
            nextOffset: offset + limit,
            total: ((await sql`select count(*) as count from restaurant ${where}`)[0].count as number),
            data: (await sql`select * from restaurant ${where} order by name limit ${limit} offset ${offset}`) as unknown[],
        }
    }
}

export const restaurantClient = new RestaurantClient()
