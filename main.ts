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
    execute: async ({ offset }) => JSON.stringify(await restaurantClient.getAllCity(offset)),
})

server.addTool({
    name: 'getAllCountry',
    description: 'Get a list of all countries ordered by the number of restaurants in descending order. Call again with the next offset to get more countries.',
    parameters: z.object({ offset: z.number().optional() }),
    execute: async ({ offset }) => JSON.stringify(await restaurantClient.getAllCountry(offset)),
})

server.addTool({
    name: 'getAllCuisine',
    description: 'Get a list of all cuisines ordered by the number of restaurants in descending order. Call again with the next offset to get more cuisines.',
    parameters: z.object({ offset: z.number().optional() }),
    execute: async ({ offset }) => JSON.stringify(await restaurantClient.getAllCuisine(offset)),
})

server.addTool({
    name: 'getAllAward',
    description: 'Get a list of all awards ordered by ranking ascending.',
    parameters: z.object({}),
    // deno-lint-ignore require-await
    execute: async () => JSON.stringify(allAward),
})

server.addTool({
    name: 'getAllFacilitiesAndServices',
    description: 'Get a list of all facilities and services ordered by the number of restaurants in descending order. Call again with the next offset to get more facilities and services.',
    parameters: z.object({ offset: z.number().optional() }),
    execute: async ({ offset }) => JSON.stringify(await restaurantClient.getAllFacilitiesAndServices(offset)),
})

server.addTool({
    name: 'getAllRestaurant',
    description: 'Get a list of all restaurants with given filters. Do not provide empty strings or null values as filters. Omit the filter to get all restaurants.',
    parameters: z.object({
        offset: z.number().optional(),
        filter: GetAllRestaurantFilterSchema.default({}),
    }),
    execute: async ({ offset, filter }) => JSON.stringify(await restaurantClient.getAllRestaurant(offset, filter)),
})

server.start({
    transportType: 'httpStream',
    httpStream: {
        endpoint: '/',
        port: 8080,
    },
})
