'use strict';

const express = require('express');
//const twilio = require('twilio');
const cors = require('cors')

const db = require('./config/db')
//const client = require('./config/twilio')


const app = express();
const  PORT = 8080;
app.use(cors());
app.use(express.json())




// Subir usuarios
app.get("/api/usuarios", (req,res)=>{
    db.query("SELECT * FROM usuarios", (err,result)=>{
            if(err) {
            console.log(err)
            } 
        res.send(result)
    //console.log(result)
});});


app.get("/api/micros", (req,res)=>{
    db.query("SELECT * FROM usuario_datos", (err,result)=>{
            if(err) {
            console.log(err)
            } 
        res.send(result)
        //console.log(result)
});});


app.get("/api/datos", (req,res)=>{
    db.query("SELECT * FROM datos INNER JOIN usuario_datos ON datos.idMicrocontrolador = usuario_datos.idMicrocontrolador;", (err,result)=>{
            if(err) {
            console.log(err)
            } 
        res.send(result)
        //console.log(result)
});});


app.put("/api/updateUser", (req, res) => {
    // Extract data from request. This can be from the body, query, or params
    const userId = req.body.id;
    const newUsername = req.body.username;
    const newCorreo = req.body.correo;
    const newTel = req.body.tel;
    // More fields can be added as needed

    // Construct the SQL query. Be cautious of SQL injection risks.
    const sqlUpdate = "UPDATE usuarios SET username = ?, correo = ?, telefono = ? WHERE idUsuario = ?";

    db.query(sqlUpdate, [newUsername, newCorreo, newTel, userId], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error updating user');
        } else {
            res.send(`User ${userId} updated successfully`);
        }
    });
});


app.put("/api/updatePassword", (req, res) => {
    // Extract data from request. This can be from the body, query, or params
    const userId = req.body.id;
    const newPass = req.body.password;
    // More fields can be added as needed

    // Construct the SQL query. Be cautious of SQL injection risks.
    const sqlUpdate = "UPDATE usuarios SET password = ? WHERE idUsuario = ?";

    db.query(sqlUpdate, [newPass, userId], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error updating user');
        } else {
            res.send(`User ${userId} updated successfully`);
        }
    });
});


app.put("/api/updateMicroName", (req, res) => {
    // Extract data from request. This can be from the body, query, or params
    const microId = req.body.id;
    const newName = req.body.name;
    // More fields can be added as needed

    // Construct the SQL query. Be cautious of SQL injection risks.
    const sqlUpdate = "UPDATE usuario_datos SET nombre = ? WHERE idMicrocontrolador = ?;";

    db.query(sqlUpdate, [newName, microId], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error updating micro');
        } else {
            res.send(`Micro ${microId} updated successfully`);
        }
    });
});



/*
var sent = false;

function checkDataAndSendSMS() {
    db.query("SELECT * FROM your_table", (err, result) => {
        if (err) {
            console.error(err);
            return;
        }

        result.forEach(row => {
            if (your_condition) {
                client.messages
                    .create({
                        body: 'Your message here',
                        to: '+1234567890',
                        from: '+10987654321'
                    })
                    .then(message => console.log(message.sid));
            }
        });
    });
}

setInterval(checkDataAndSendSMS, 10000);

*/




app.listen(PORT, ()=>{
    console.log(`Server is running on ${PORT}`)
})