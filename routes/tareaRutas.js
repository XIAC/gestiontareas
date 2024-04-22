const express = require('express');
const rutas = express.Router();
const TareaModel = require('../models/Tarea');

rutas.get('/', async (req, res) =>{
    try {
        const tareas = await TareaModel.find();
        // console.log(tareas);
        res.json(tareas);
    }
    catch(error){
        res.status(404).json({mensaje: error.message});
    }
});

rutas.post('/agregar', async (req, res) =>{
    console.log(req.body);
    const nuevaTarea = new TareaModel({
        titulo: req.body.titulo,
        descripcion: req.body.descripcion,
        prioridad: req.body.prioridad
    });
    try {
        const guardarTarea = await nuevaTarea.save();
        res.status(201).json(guardarTarea);
        
    } catch(error){
        res.status(400).json({mensaje: error.message});
    }
});

rutas.put('/editar/:id', async (req, res) =>{
    try {
        const actualizarTarea = await TareaModel.findByIdAndUpdate(req.params.id, req.body, { new: true});
        res.status(201).json(actualizarTarea);
        
    } catch(error){
        res.status(400).json({mensaje: error.message});
    }
});

rutas.delete('/eliminar/:id', async (req, res) =>{
    try {
        const eliminarTarea = await TareaModel.findByIdAndDelete(req.params.id);
        res.json({mensaje: 'Tarea eliminada correctamente'});
        
    } catch(error){
        res.status(400).json({mensaje: error.message});
    }
});
//consultas ----------------------
// - Listar todas las tareas con prioridad 5
rutas.get('/tarea-prioridad/:id', async (req, res) =>{
    try {
        console.log(req.params.id);
        const tareasPrioridad = await TareaModel.find({ prioridad: req.params.id});
        res.json(tareasPrioridad);
    }
    catch(error){
        res.status(404).json({mensaje: error.message});
    }
});

// - Ordenar las tareas por prioridad de forma ascendente
rutas.get('/ordenar-tarea', async (req, res) =>{
    try {
        const tareasASC = await TareaModel.find().sort({prioridad: 1});
        res.json(tareasASC);
    }
    catch(error){
        res.status(404).json({mensaje: error.message});
    }
});
// - Consultar una tarea especifica por Id
rutas.get('/tarea/:id', async (req, res) =>{
    try {
        console.log(req.params.id);
        const tarea = await TareaModel.findById(req.params.id);
        res.json(tarea);
    }
    catch(error){
        res.status(404).json({mensaje: error.message});
    }
});
// - Eliminar todas las tareas con una prioridad determinada
rutas.delete('/eliminar-prioridad/:prioridad', async (req, res) =>{
    try {
        console.log(req.params.prioridad);
        const prioridad = req.params.prioridad
        const eliminarTareas = await TareaModel.deleteMany({prioridad});
        res.json({mensaje: 'Tareas eliminada correctamente'});
        
    } catch(error){
        res.status(400).json({mensaje: error.message});
    }
});
// - Consultar la tarea mas reciente anadida a la base de datos
rutas.get('/tarea-reciente', async (req, res) =>{
    try {
        const tarea = await TareaModel.findOne().sort({_id: -1});
        res.json(tarea);
    }
    catch(error){
        res.status(404).json({mensaje: error.message});
    }
});
module.exports = rutas;
