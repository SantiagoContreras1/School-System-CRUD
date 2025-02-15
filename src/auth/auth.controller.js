import User from "../users/user.model.js";
import {generarJWT} from "../helpers/generate-jwt.js"
import { hash,verify } from "argon2";

export const register = async(req,res)=>{
    
    try {
        const data = req.body // accede a la data del body
        
        // Encriptar pass
        const encryptedPassword = await hash(data.password)

        //CREAR USUARIO
        const user = await User.create({
            name: data.name,
            email: data.email,
            password: encryptedPassword,
            role: data.role || 'STUDENT_ROLE' // Si no manda rol, se asigna STUDENT_ROLE
        })
        
        res.status(200).json({
            message: "Usuario creado con exito",
            userDetails:{
                user: user.email
            }
        })

    } catch (error) {
        console.log(error)
        return res.status(400).json({
            message: "Error al registrar usuario",
            error: error.message
        })
    }

}

export const login = async (req,res) => {
    const {email,password} = req.body
    
    try {
        const user = await User.findOne({email})

        // ⚠️ VALIDACIONES ⚠️
        if (!user) {
            return res.status(400).json({
                message: "Usuario no registrado"
            })
        }

        // Revisar si el usuario se le hizo un delete
        if (!user.estado) {
            return res.status(400).json({
                message: "Usuario inactivo"
            })
        }

        // 🔐 Comparar contraseñas con argon2
        const validPassword = await verify(user.password,password)
        if (!validPassword) {
            return res.status(400).json({
                message: "Contraseña incorrecta"
            })
        }
        // ⚠️ VALIDACIONES ⚠️


        const token = await generarJWT(user.id)
        return res.status(200).json({
            msg: 'Usuario correcto',
            userDetails:{
                email: user.email,
                token: token
            }
        })

    } catch (error) {
        console.log(error)
        return res.status(400).json({
            message: "Error al iniciar sesión",
            error: error.message
        })
    }
}