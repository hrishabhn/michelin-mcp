import { GetAllRestaurantFilterSchema, restaurantClient } from './src/client.ts'
import { allAward } from './src/schema.ts'

import { FastMCP } from 'npm:fastmcp'
import { z } from 'npm:zod'

const server = new FastMCP({
    name: 'Michelin MCP',
    version: '1.0.0',
})

server.addTool({
    name: 'getAllCity',
    description: 'Get a list of all cities ordered by the number of restaurants in descending order. Call again with the next offset to get more cities.',
    parameters: z.object({ offset: z.number().optional() }),
    execute: async ({ offset }) => {
        const { nextOffset, total, data } = await restaurantClient.getAllCity(offset)
        return {
            content: [
                { type: 'text', text: `Next offset: ${nextOffset}` },
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
    description: 'Get a list of all countries ordered by the number of restaurants in descending order. Call again with the next offset to get more countries.',
    parameters: z.object({ offset: z.number().optional() }),
    execute: async ({ offset }) => {
        const { nextOffset, total, data } = await restaurantClient.getAllCountry(offset)
        return {
            content: [
                { type: 'text', text: `Next offset: ${nextOffset}` },
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
    description: 'Get a list of all cuisines ordered by the number of restaurants in descending order. Call again with the next offset to get more cuisines.',
    parameters: z.object({ offset: z.number().optional() }),
    execute: async ({ offset }) => {
        const { nextOffset, total, data } = await restaurantClient.getAllCuisine(offset)
        return {
            content: [
                { type: 'text', text: `Next offset: ${nextOffset}` },
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
    description: 'Get a list of all awards ordered by ranking ascending.',
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
    description: 'Get a list of all facilities and services ordered by the number of restaurants in descending order. Call again with the next offset to get more facilities and services.',
    parameters: z.object({ offset: z.number().optional() }),
    execute: async ({ offset }) => {
        const { nextOffset, total, data } = await restaurantClient.getAllFacilitiesAndServices(offset)
        return {
            content: [
                { type: 'text', text: `Next offset: ${nextOffset}` },
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
    description: 'Get a list of all restaurants with given filters. Do not provide empty strings or null values as filters. Omit the filter to get all restaurants.',
    parameters: z.object({
        offset: z.number().optional(),
        filter: GetAllRestaurantFilterSchema.default({}),
    }),
    execute: async ({ offset, filter }) => {
        const { nextOffset, total, data } = await restaurantClient.getAllRestaurant(offset, filter)
        return {
            content: [
                { type: 'text', text: `Next offset: ${nextOffset}` },
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
