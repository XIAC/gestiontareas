const express = require('express');
const rutas = express.Router();
const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// registrar usuarios 
rutas.post('/registro', async (req, res) =>{
    try {
        const {nombreusuario, correo, contrasena} = req.body;
        const usuario = new Usuario ({nombreusuario, correo, contrasena});
        await usuario.save();
        res.status(201).json({mensaje: 'Usuario registrado exitosamente'});
    }
    catch(error){
        res.status(404).json({mensaje: error.message});
    }
});
// iniciar sesion
rutas.post('/login', async (req, res) =>{
    try {
        const {correo, contrasena} = req.body;
        const usuario = await Usuario.findOne({ correo });
        //encontrar al usuario
        if (!usuario){
            res.status(401).json({mensaje: 'Usuario no encotrado. Credencial incorrecto'});
        }
        //Comparar contrasena 
        const validarContrasena = await usuario.comparePassword(contrasena);
        if (!validarContrasena){
            res.status(401).json({mensaje: 'Credencial incorrecto. Vuelva a intentarlo'});
        }
        const token = jwt.sign( { userId: usuario._id }, 'clave_secreta_servidor',{expiresIn: '1h'});
        res.json(token);
    }
    catch(error){
        res.status(404).json({mensaje: error.message});
    }
});
module.exports = rutas;