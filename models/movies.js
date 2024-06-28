import { readJSON } from '../utils.js'
import { randomUUID } from 'node:crypto'

const movies = readJSON('./movies.json')

export class MovieModel {
    static async getAll({ genre, search }) {
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

        return filteredMovies
    }

    static async getById({ id }) {
        const movie = movies.find(movie => movie.id === id)
        return movie
    }

    static async create({ input }) {
        // en base de datos
        const newMovie = {
            id: randomUUID(), //Universal Unique ID
            ...input
        }

        movies.push(newMovie)

        return newMovie
    }

    static async delete({ id }) {
        const movieIndex = movies.findIndex(movie => movie.id === id)
        if (movieIndex === -1) {
            return false
        }

        movies.splice(movieIndex, 1)
        return true
    }

    static async update({ id, input }) {
        const movieIndex = movies.findIndex(movie => movie.id === id)
        if (movieIndex === -1) return false

        movies[movieIndex] = {
            ...movies[movieIndex],
            ...input
        }

        return movies[movieIndex]
    }
}