import { randomUUID } from 'node:crypto'

import { Router } from 'express'

import { validateMovie, validatePartialMovie } from './schemas/movies.js'

import { readJSON } from './utils.js'

const movies = readJSON('./movies.json')

const router = Router()

router.get('/', (req, res) => {
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

router.get('/:id', (req, res) => { // path-to-regexp
    const { id } = req.params
    const movie = movies.find(movie => movie.id === id)
    if (movie) return res.json(movie)

    res.status(404).json({ message: 'Movie not found' })
})

router.post('/', (req, res) => {
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

    res.status(201).json(newMovie)
})

router.delete('/:id', (req, res) => {
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

router.patch('/:id', (req, res) => {
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

export default router