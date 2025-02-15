import express from "express"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import { dbConnection } from "./mongo.js"

import authRouters from "../src/auth/auth.routers.js"
import cursosRoutes from "../src/cursos/cursos.routes.js"

const middlewares = (app)=>{
    app.use(express.urlencoded({extended: false})) //Para los forms
    app.use(express.json()) // Para que JS entienda los JSON
    app.use(cors()) // dominios que pueden acceder
    app.use(helmet()) // Es para la seguridad
    app.use(morgan('dev')) // Muestra mensajes para nuestras rutas (POST,PUT etc)
}

// RUTAS
const routes = (app)=>{
    app.use("/schoolSystem/auth",authRouters)
    app.use("/schoolSystem/cursos",cursosRoutes)
}




const conectarDb = async ()=>{
    try {
        await dbConnection()
        console.log('Conexión exitosa con la DB')
    } catch (error) {
        console.log('Error al conectarse a la DB',error)
    }
}


export const initServer = ()=>{
    const app = express() // crea el server
    const port= process.env.PORT || 3001

    try {
        middlewares(app)
        conectarDb()
        routes(app)
        app.listen(port)
        console.log(`Server running on port ${port}`)
    } catch (error) {
        console.log(`Server init failed ${error}`)
    }
}