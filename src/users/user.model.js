import {Schema,model} from "mongoose";

const UserSchema = Schema({
    name:{
        type:String,
        required:[true,'El nombre es obligatoriooo'],
        minLength: 3
    },
    email:{
        type:String,
        required:true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Email inválido'] // 🔥 Validación de email
    },
    password:{
        type:String,
        required:[true,'Contraseña obligatoriaaaa'],
        minLength: 6
    },
    estado:{
        type: Boolean,
        default: true
    },
    role:{
        type:String,
        required:true,
        enum: ['TEACHER_ROLE','STUDENT_ROLE']
    },
    cursos:[{
        type: Schema.Types.ObjectId,
        ref: 'Curso', // Almacena los cursos del estudiante
        default: [] // Por default, el array de cursos no tiene nada
    }]
},
{
    timestamps:true,
    versionKey: false
}
)

UserSchema.methods.toJSON= function(){
    const {__v,password,_id,...usuario} = this.toObject()
    usuario.uid = _id
    return usuario
}

export default model('User',UserSchema)