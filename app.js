import express, { json } from 'express'
import moviesRouter from './routes/movies.js'
import { corsMiddleware } from './middlewares/cors.js'
// REST: Representational state Transfer
// - Arquitectura de Software
// - 2000 Roy Fielding
// Escabilidad, fiabilidad, simplicidad, portabilidad, visibilidad, facil de modificar
// - Resources: cada uno se identifica con una URL
// - no todas las apis tienen que ser JSON, pero puede ser XML, HTML, etc.

// import movies from './movies.json' with {type: 'json'} ## experimental
const app = express()
app.disable('x-powered-by')
app.use(corsMiddleware())

app.use(json())
/* 
###
Con app.use(cors()) no hay necesidad de agregar options al
final para los CORS PRE Flight
y tampoco poner los validos en cada metodo
*/

// CORS PRE-Flight
// OPTIONS

/*const ACCEPTED_ORIGINS = [
    'https://movies.com',
    'http://127.0.0.1:5500',
]*/

app.use('/movies', moviesRouter)

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