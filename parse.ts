import { csvPath, dbPath } from './lib.ts'
import { RestaurantSchema } from './schema.ts'

import { parse } from 'jsr:@std/csv'
import { existsSync } from 'jsr:@std/fs/exists'
import { DatabaseSync } from 'node:sqlite'
import { z } from 'npm:zod'

// read csv
const allRestaurant = z.array(RestaurantSchema).parse(parse(Deno.readTextFileSync(csvPath), { skipFirstRow: true }))

// delete database
if (existsSync(dbPath)) Deno.removeSync(dbPath)
// create database
const db = new DatabaseSync(dbPath)

// create table
db.exec(`
    create table restaurant (
        name text not null,
        address text not null,
        city text not null,
        country text not null,
        price integer not null,
        cuisine json not null,

        latitude real not null,
        longitude real not null,

        phone_number text,
        url text not null,
        website_url text,

        award text not null,
        green_star integer not null,

        facilities_and_services json not null,
        description text not null
    )
`)

// insert data
const insert = db.prepare(`
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
        ?, ?, ?, ?, ?, ?,
        ?, ?,
        ?, ?, ?,
        ?, ?,
        ?, ?
    )
`)

for (const restaurant of allRestaurant) {
    insert.run(
        restaurant.Name,
        restaurant.Address,
        restaurant.City,
        restaurant.Country,
        restaurant.Price,
        JSON.stringify(restaurant.Cuisine),
        restaurant.Latitude,
        restaurant.Longitude,
        restaurant.PhoneNumber,
        restaurant.Url,
        restaurant.WebsiteUrl,
        restaurant.Award,
        restaurant.GreenStar ? 1 : 0,
        JSON.stringify(restaurant.FacilitiesAndServices),
        restaurant.Description,
    )
}
