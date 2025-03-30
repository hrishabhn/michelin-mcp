import { GetAllRestaurantFilterSchema, restaurantClient } from './client.ts'

import { FastMCP } from 'npm:fastmcp'
import { z } from 'npm:zod'
import { allAward } from './schema.ts'

const server = new FastMCP({
    name: 'Michelin MCP',
    version: '1.0.0',
})

server.addTool({
    name: 'getAllCity',
    description: 'Get a list of all cities',
    parameters: z.object({ offset: z.number().optional() }),
    // deno-lint-ignore require-await
    execute: async ({ offset }) => {
        const { total, data } = restaurantClient.getAllCity(offset)
        return {
            content: [
                { type: 'text', text: `Total: ${total}` },
                ...data.map((city) => ({
                    type: 'text' as const,
                    text: city,
                })),
            ],
        }
    },
})

server.addTool({
    name: 'getAllCountry',
    description: 'Get a list of all countries',
    parameters: z.object({ offset: z.number().optional() }),
    // deno-lint-ignore require-await
    execute: async ({ offset }) => {
        const { total, data } = restaurantClient.getAllCountry(offset)
        return {
            content: [
                { type: 'text', text: `Total: ${total}` },
                ...data.map((country) => ({
                    type: 'text' as const,
                    text: country,
                })),
            ],
        }
    },
})

server.addTool({
    name: 'getAllCuisine',
    description: 'Get a list of all cuisines',
    parameters: z.object({ offset: z.number().optional() }),
    // deno-lint-ignore require-await
    execute: async ({ offset }) => {
        const { total, data } = restaurantClient.getAllCuisine(offset)
        return {
            content: [
                { type: 'text', text: `Total: ${total}` },
                ...data.map((cuisine) => ({
                    type: 'text' as const,
                    text: cuisine,
                })),
            ],
        }
    },
})

server.addTool({
    name: 'getAllAward',
    description: 'Get a list of all awards',
    parameters: z.object({}),
    // deno-lint-ignore require-await
    execute: async () => {
        return {
            content: allAward.map((award) => ({
                type: 'text' as const,
                text: award,
            })),
        }
    },
})

server.addTool({
    name: 'getAllFacilitiesAndServices',
    description: 'Get a list of all facilities and services',
    parameters: z.object({ offset: z.number().optional() }),
    // deno-lint-ignore require-await
    execute: async ({ offset }) => {
        const { total, data } = restaurantClient.getAllFacilitiesAndServices(offset)
        return {
            content: [
                { type: 'text', text: `Total: ${total}` },
                ...data.map((facilitiesAndServices) => ({
                    type: 'text' as const,
                    text: facilitiesAndServices,
                })),
            ],
        }
    },
})

server.addTool({
    name: 'getAllRestaurant',
    description: 'Get a list of all restaurants with given filters. Validate the filters using the other tools before running this tool.',
    parameters: z.object({
        offset: z.number().optional(),
        filter: GetAllRestaurantFilterSchema,
    }),
    // deno-lint-ignore require-await
    execute: async ({ offset, filter }) => {
        const { total, data } = restaurantClient.getAllRestaurant(offset, filter)
        return {
            content: [
                { type: 'text', text: `Total: ${total}` },
                ...data.map((restaurant) => ({
                    type: 'text' as const,
                    text: JSON.stringify(restaurant, null, 2),
                })),
            ],
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
