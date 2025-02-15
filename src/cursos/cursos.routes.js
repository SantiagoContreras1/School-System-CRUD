import { Router } from "express";
import { check } from "express-validator";
import { saveCurso } from "./curso.controller.js";
import {validarCampos} from "../middlewares/validar-campos.js"
import { validarJWT } from "../middlewares/validar-jwt.js"
import { validarRol } from "../middlewares/validar-rol.js"

const router = Router()

router.post(
    "/",
    [
        validarJWT,
        check("email",'Email no valido!!!!').not().isEmpty(),
        validarCampos,
        validarRol("TEACHER_ROLE")
    ],
    saveCurso
)

export default router