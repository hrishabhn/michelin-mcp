import { parse } from 'jsr:@std/csv'
import { type Restaurant, RestaurantSchema } from './schema.ts'
import { z } from 'npm:zod'
import path from 'node:path'

// dirname
const dirname = import.meta.dirname
if (dirname === undefined) throw new Error('`dirname` is undefined')

class RestaurantClient {
    restaurants: Restaurant[]

    constructor() {
        // read csv
        const rawData = parse(
            Deno.readTextFileSync(path.join(import.meta.dirname!, 'michelin_my_maps.csv')),
            { skipFirstRow: true },
        )

        // parse and save
        this.restaurants = z.array(RestaurantSchema).parse(rawData)

        // save to json
        // Deno.writeTextFileSync('michelin_my_maps.json', JSON.stringify(this.restaurants, null, 2))
    }

    getAllCity = (): string[] => [...new Set(this.restaurants.map((item) => item.City))].toSorted()
    getAllCountry = (): string[] => [...new Set(this.restaurants.map((item) => item.Country).filter((item) => item !== null))].toSorted()
    getAllCuisine = (): string[] => [...new Set(this.restaurants.map((item) => item.Cuisine).flat())].toSorted()
}

export const restaurantClient = new RestaurantClient()
