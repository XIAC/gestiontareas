const express = require('express');
const request = require('supertest');
const tareaRutas = require('../../routes/tareaRutas');
const TareaModel = require('../../models/Tarea');
const mongoose = require ('mongoose');

const app = express();
//configurar express para JSON
app.use(express.json());
app.use('/ruta-tarea', tareaRutas);
// describe(name, fn)
describe('Pruebas unitarias para las rutas de tareas', ()=>{
    beforeEach(async ()  => {
        // conectar antes de hacer pruebas
        await mongoose.connect('mongodb://127.0.0.1:27017/dbtareas');
        await TareaModel.deleteMany({});   
    });
    afterAll(() => {
        // despues de terminar las pruebas cerra la db
        return mongoose.connection.close();
    });
    // 1. traer todas las tareas
    test('Deberia devolver todas las tareas al hace un GET a /ruta-tarea', async () => {
        //crear tareas 
        await TareaModel.create({ titulo: 'Tarea 1', descripcion: 'descripcion tarea1', prioridad:3 });
        await TareaModel.create({ titulo: 'Tarea 2', descripcion: 'descripcion tarea2', prioridad:1 });
        const res = await request(app).get('/ruta-tarea');
        //validar las respuestas 
        expect(res.statusCode).toEqual(200); ///pasoooo
        expect(res.body).toHaveLength(2)// pasoo
    });
    // 2. Agregar tarea
    test('Deberia agregar una nueva tarea', async () => {
        const nuevaTarea ={
            titulo: 'Hacer el examen de Taller de Aplicaciones en Internet',
            descripcion: 'Backend',
            prioridad: 1
        }
        const res = await request(app)
            .post('/ruta-tarea/agregar')
            .send(nuevaTarea);
        
        expect(res.statusCode).toEqual(201); ///pasooo
        expect(res.body.titulo).toEqual(nuevaTarea.titulo); ///pasoooo
        expect(res.body.prioridad).toEqual(nuevaTarea.prioridad); ///pasoooo
        expect(res.body.descripcion).toEqual(nuevaTarea.descripcion); ///pasoooo
        // expect(res.body).toHaveLength(1)// pasoo
    });

    // 3. Editar tarea
    test('Prueba unitaria para editar Tarea ', async () => {
        await TareaModel.create({ titulo: 'Tarea 1', descripcion: 'descripcion tarea1 (1)', prioridad:3 });
        await TareaModel.create({ titulo: 'Tarea 2', descripcion: 'descripcion tarea2 (2)', prioridad:1 });
        await TareaModel.create({ titulo: 'Tarea 3', descripcion: 'descripcion tarea3 (3)', prioridad:2 });
        // const tareaEncontrada2 = await TareaModel.find({ titulo: 'Tarea 2' });
        // await Character.exists({ name: /riker/i }); // null
        const tareaEncontrada2 = await TareaModel.exists({ titulo: 'Tarea 2' });

        console.log(tareaEncontrada2);
            //POSTMAN -objeto
        const tareaeditada = { 
                titulo: 'Tarea 1 (editado)', 
                descripcion: 'descripcion tarea1 (editado)', 
                prioridad: 10 };
        console.log("tarea editada",tareaeditada);
        
        const res = await request(app)
            .put(`/ruta-tarea/editar/${tareaEncontrada2._id}`)
            .send(tareaeditada);
        expect(res.statusCode).toEqual(201); 
        expect(res.body.titulo).toEqual(tareaeditada.titulo); 
        expect(res.body.descripcion).toEqual(tareaeditada.descripcion); 
    });

    // 4. Elimnar Tarea
    test('Eliminar  Tarea prueba unitaria', async () => {
        const tareaNueva = await TareaModel.create({ 
            titulo: 'Tarea Nueva', 
            descripcion: 'descripcion Nuevo', 
            prioridad: 1 });
        
        const res = await request(app)
            .delete(`/ruta-tarea/eliminar/${tareaNueva._id}`);
        expect(res.statusCode).toEqual(200); 
        expect(res.body).toEqual({mensaje: 'Tarea eliminada correctamente'}); 
    });
    // - Ordenar las tareas por prioridad de forma ascendente
    test('Devolver las tareas ordenadas por prioridad', async () => {
        await TareaModel.create({ titulo: 'Tarea 1', descripcion: 'descripcion tarea1 (1)', prioridad:3 });
        await TareaModel.create({ titulo: 'Tarea 2', descripcion: 'descripcion tarea2 (2)', prioridad:1 });
        await TareaModel.create({ titulo: 'Tarea 3', descripcion: 'descripcion tarea3 (3)', prioridad:2 });
        const res = await request(app).get('/ruta-tarea/ordenar-tarea');
        expect(res.statusCode).toEqual(200); ///pasooo
        // expect(res.body).toHaveLength(3)// pasoo
        expect(res.body[0].prioridad).toEqual(1)// pasoo
        expect(res.body[1].prioridad).toEqual(2)// pasoo
        expect(res.body[2].prioridad).toEqual(3)// pasoo
    });
});