import z from 'zod'

// validate movies

const movieSchema = object({
    title: z.string({
        invalid_type_error: 'Movie title must be a string',
        required_error: 'Movie title is required.'
    }),
    year: z.number().int().min(1900).max(2024),
    director: z.string(),
    duration: z.number().int().positive(),
    rate: z.number().min(0).max(10).default(5),
    poster: z.string().url({ message: 'Poster must be a valid URL' }).endsWith('.jpg', '.png'),
    genre: z.array(
        z.enum(['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Thriller', 'Sci-Fi', 'Crime']),
        {
            required_error: 'Movie genre is required',
            invalid_type_error: 'Movie genre must be an array of enum Genre'
        }
    )
})

export function validateMovie(input) {
    return movieSchema.safeParse(input)
}

export function validatePartialMovie(input) {
    // partial va a hacer cada una de las propiedades de movie Schema opcionales
    // sí no está no pasa nada, pero sí si está entonces se valida normalmente
    return movieSchema.partial().safeParse(input)
}