import { csvPath } from '../lib.ts'
import { RestaurantSchema } from '../schema.ts'
import { sql } from '../src/neon.ts'

import { parse } from 'jsr:@std/csv'
import { z } from 'npm:zod'

// read csv
const allRestaurant = z.array(RestaurantSchema).parse(parse(Deno.readTextFileSync(csvPath), { skipFirstRow: true }))

// delete table
await sql`drop table if exists restaurant`

// create table
await sql`
    create table restaurant (
        name text not null,
        address text not null,
        city text not null,
        country text not null,
        price integer not null,
        cuisine text[] not null,

        latitude real not null,
        longitude real not null,

        phone_number text,
        url text not null,
        website_url text,

        award text not null,
        green_star boolean not null,

        facilities_and_services text[] not null,
        description text not null
    )
`

// insert data
await sql.transaction(
    allRestaurant.map((restaurant) =>
        sql`
            insert into restaurant (
                name,
                address,
                city,
                country,
                price,
                cuisine,

                latitude,
                longitude,

                phone_number,
                url,
                website_url,

                award,
                green_star,

                facilities_and_services,
                description
            )
            values (
                ${restaurant.Name}, ${restaurant.Address}, ${restaurant.City}, ${restaurant.Country}, ${restaurant.Price}, ${restaurant.Cuisine},
                ${restaurant.Latitude}, ${restaurant.Longitude},
                ${restaurant.PhoneNumber}, ${restaurant.Url}, ${restaurant.WebsiteUrl},
                ${restaurant.Award}, ${restaurant.GreenStar ? 1 : 0},
                ${restaurant.FacilitiesAndServices}, ${restaurant.Description}
            )
        `
    ),
)
