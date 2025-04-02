# Michelin MCP

This is an implementation of the Model Context Protocol (MCP) for the Michelin dataset. It can be integrated with an LLM using the MCP protocol via the SSE deployment at the endpoint [`https://mcp.michelin.com`](https://mcp.michelin.com). The MCP protocol is used to provide a structured way for a model to interact with external APIs.

## Tools

-   `getAllCity` - Get a list of all cities ordered by the number of restaurants in descending order. Call again with the next offset to get more cities.
-   `getAllCountry` - Get a list of all countries ordered by the number of restaurants in descending order. Call again with the next offset to get more countries.
-   `getAllCuisine` - Get a list of all cuisines ordered by the number of restaurants in descending order. Call again with the next offset to get more cuisines.
-   `getAllAward` - Get a list of all awards ordered by ranking ascending.
-   `getAllFacilitiesAndServices` - Get a list of all facilities and services ordered by the number of restaurants in descending order. Call again with the next offset to get more facilities and services.
-   `getAllRestaurant` - Get a list of all restaurants with given filters. Do not provide empty strings or null values as filters. Omit the filter to get all restaurants.
