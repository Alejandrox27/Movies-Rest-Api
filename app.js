import express, { json } from 'express'
import { randomUUID } from 'node:crypto'
import cors from 'cors'
import { validateMovie, validatePartialMovie } from './schemas/movies.js'

// REST: Representational state Transfer
// - Arquitectura de Software
// - 2000 Roy Fielding
// Escabilidad, fiabilidad, simplicidad, portabilidad, visibilidad, facil de modificar
// - Resources: cada uno se identifica con una URL
// - no todas las apis tienen que ser JSON, pero puede ser XML, HTML, etc.

// import movies from './movies.json' with {type: 'json'} ## experimental
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const movies = require('./movies.json')

const app = express()
app.disable('x-powered-by')

app.use(json())
/* 
###
Con app.use(cors()) no hay necesidad de agregar options al
final para los CORS PRE Flight
y tampoco poner los validos en cada metodo
*/
app.use(cors({
    origin: (origin, callback) => {
        const ACCEPTED_ORIGINS = [
            'https://movies.com',
            'http://127.0.0.1:5500',
        ]

        if (ACCEPTED_ORIGINS.includes(origin)) {
            return callback(null, true)
        }

        if (!origin) {
            return callback(null, true)
        }

        return callback(new Error('Not allowed by CORS'))
    }
}))
// CORS PRE-Flight
// OPTIONS

/*const ACCEPTED_ORIGINS = [
    'https://movies.com',
    'http://127.0.0.1:5500',
]*/

app.get('/movies', (req, res) => {
    /*const origin = req.header('origin')
    if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
        res.header('Access-Control-Allow-Origin', origin)
    }*/
    const { genre, search } = req.query
    let filteredMovies = movies
    if (genre) {
        filteredMovies = filteredMovies.filter(
            movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
        )
    }
    if (search) {
        filteredMovies = filteredMovies.filter(
            movie => movie.title.toLowerCase() === search.toLowerCase()
        )
    }

    return res.json(filteredMovies)
})

app.get('/movies/:id', (req, res) => { // path-to-regexp
    const { id } = req.params
    const movie = movies.find(movie => movie.id === id)
    if (movie) return res.json(movie)

    res.status(404).json({ message: 'Movie not found' })
})

app.post('/movies', (req, res) => {
    const result = validateMovie(req.body)

    if (result.error) {
        // 422: Unprocessable Entity
        return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    // en base de datos
    const newMovie = {
        id: randomUUID(), //Universal Unique ID
        ...result.data
    }

    // no es REST debido a que se guarda en memoria
    // Debe ser guardado en base de datos
    movies.push(newMovie)

    res.status(201).json(movies)
})

app.delete('/movies/:id', (req, res) => {
    /*const origin = req.header('origin')
    if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
        res.header('Access-Control-Allow-Origin', origin)
    }*/
    const { id } = req.params
    const movieIndex = movies.findIndex(movie => movie.id === id)

    if (movieIndex === -1) {
        return res.status(404).json({ message: 'Movie not found' })
    }

    movies.splice(movieIndex, 1)

    return res.json({ message: 'Movie deleted' })
})

app.patch('/movies/:id', (req, res) => {
    const result = validatePartialMovie(req.body)

    if (!result.success) {
        return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    const { id } = req.params
    const movieIndex = movies.findIndex(movie => movie.id === id)

    if (movieIndex < 0) {
        return res.status(404).json({ message: `Movie not found` })
    }

    const updateMovie = {
        ...movies[movieIndex],
        ...result.data
    }

    movies[movieIndex] = updateMovie

    return res.json(updateMovie)
})

/*app.options('/movies/:id', (req, res) => {
    const origin = req.header('origin')

    if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
        res.header('Access-Control-Allow-Origin', origin)
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
    }
    res.send(200)
})*/

const PORT = process.env.PORT ?? 1234

app.listen(PORT, () => {
    console.log(`listening on port http://localhost:${PORT}`)
})

//idempotencia: propiedad de realizar una acción varias veces y obtener siempre el mismo resultado