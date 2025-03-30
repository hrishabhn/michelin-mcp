import { FastMCP } from 'npm:fastmcp'
import { z } from 'npm:zod'
import { restaurantClient } from './client.ts'
import { AwardSchema, PriceSchema } from './schema.ts'

const server = new FastMCP({
    name: 'Michelin MCP',
    version: '1.0.0',
})

server.addTool({
    name: 'getAllCity',
    description: 'Get a list of all cities',
    parameters: z.object({}),
    // deno-lint-ignore require-await
    execute: async () => ({
        content: restaurantClient.getAllCity().map((city) => ({
            type: 'text',
            text: city,
        })),
    }),
})

server.addTool({
    name: 'getAllCountry',
    description: 'Get a list of all countries',
    parameters: z.object({}),
    // deno-lint-ignore require-await
    execute: async () => ({
        content: restaurantClient.getAllCountry().map((country) => ({
            type: 'text',
            text: country,
        })),
    }),
})

server.addTool({
    name: 'getAllCuisine',
    description: 'Get a list of all cuisines',
    parameters: z.object({}),
    // deno-lint-ignore require-await
    execute: async () => ({
        content: restaurantClient.getAllCuisine().map((cuisine) => ({
            type: 'text',
            text: cuisine,
        })),
    }),
})

server.addTool({
    name: 'getAllRestaurant',
    description: 'Get a list of all restaurants with given filters',
    parameters: z.object({
        city: z.array(z.string()),
        country: z.array(z.string()),
        price: z.array(PriceSchema),
        cuisine: z.array(z.string()),
        award: z.array(AwardSchema),
        greenStar: z.boolean().optional(),
        facilitiesAndServices: z.array(z.string()),
    }),
    // deno-lint-ignore require-await
    execute: async (args) => {
        return {
            content: restaurantClient.restaurants
                // city
                .filter((item) => {
                    if (args.city.length === 0) return true
                    return args.city.includes(item.City)
                })
                // country
                .filter((item) => {
                    if (args.country.length === 0) return true
                    if (item.Country === null) return false
                    return args.country.includes(item.Country)
                })
                // price
                .filter((item) => {
                    if (args.price.length === 0) return true
                    return args.price.includes(item.Price)
                })
                // cuisine
                .filter((item) => {
                    if (args.cuisine.length === 0) return true
                    return args.cuisine.some((c) => item.Cuisine.includes(c))
                })
                // award
                .filter((item) => {
                    if (args.award.length === 0) return true
                    return args.award.includes(item.Award)
                })
                // greenStar
                .filter((item) => {
                    if (args.greenStar === undefined) return true
                    return args.greenStar === item.GreenStar
                })
                // facilitiesAndServices
                .filter((item) => {
                    if (args.facilitiesAndServices.length === 0) return true
                    return args.facilitiesAndServices.some((f) => item.FacilitiesAndServices.includes(f))
                })
                // return
                .map((item) => ({
                    type: 'text',
                    text: JSON.stringify(item, null, 2),
                })),
        }
    },
})

server.start({
    transportType: 'sse',
    sse: {
        endpoint: '/',
        port: 8080,
    },
})
