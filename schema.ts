import { z } from 'npm:zod'

export const PriceSchema = z.number().int().min(0).max(4)

export const AwardSchema = z.enum([
    'Selected Restaurants',
    'Bib Gourmand',
    '1 Star',
    '2 Stars',
    '3 Stars',
])

export const RestaurantSchema = z.object({
    Name: z.string(),
    Address: z.string(),
    Location: z.string(),
    Price: z.string().transform((value) => value.length).pipe(PriceSchema),
    Cuisine: z.string().transform((value) => value.split(', ')),

    Latitude: z.string(),
    Longitude: z.string(),

    PhoneNumber: z.string().transform((value) => value || null),
    Url: z.string().url(),
    WebsiteUrl: z.string().transform((value) => value || null),

    Award: AwardSchema,
    GreenStar: z.enum(['0', '1']).transform((value) => value === '1'),

    FacilitiesAndServices: z.string().transform((value) => {
        if (value === '') return []
        return value.split(',')
    }),
    Description: z.string(),
})
    .transform((value) => {
        return {
            ...value,
            ...parseCityCountry(value.Location),
        }
    })

export type Restaurant = z.infer<typeof RestaurantSchema>

function parseCityCountry(location: string): { City: string; Country: string | null } {
    const locationParts = location.split(', ')

    if (locationParts.length === 1 || locationParts.length === 2) {
        const City = locationParts[0].trim()
        if (locationParts.length === 1) return { City, Country: matchCountry(City) }
        if (locationParts.length === 2) return { City, Country: locationParts[1].trim() }
    }

    throw new Error('Invalid location format')
}

function matchCountry(city: string): string {
    switch (city) {
        case 'Abu Dhabi':
        case 'Dubai':
            return 'United Arab Emirates'

        case 'Hong Kong':
            return 'Hong Kong SAR China'

        case 'Luxembourg':
            return 'Luxembourg'

        case 'Macau':
            return 'Macau SAR China'

        case 'Singapore':
            return 'Singapore'

        default:
            throw new Error(`Unknown city: ${city}`)
    }
}
