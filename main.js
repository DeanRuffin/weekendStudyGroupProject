//imports

//constants
const express = require('express');
const app = express(); // create application from express
const mongoose = require('mongoose'); // get mongoose from modules
const PORT = 8080; // port for express to listen on
const DB_CONNECTION= 'mongodb+srv://yoda:yoda@cluster0.euazb.mongodb.net/students?retryWrites=true&w=majority'; // <dbame>:students
// add model Student
let Student = require('./models/students');



//exports

//core logic

// connect to database
mongoose.connect(DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology:true
}); // attempt to connect to the database

const connection = mongoose.connection; // we get the connection object from mongoose

// everytime there is an error on mongoose it will log on the console
connection.on('error', error => console.log(`MongoDB Connection Error: ${error}`));
connection.once('open', () => console.log(`MongoDB database connection established`))

//boilerplate express server
app.use(express.urlencoded({extended: true}));
app.use(express.json()); // specify that we are using json objects to request and respond

//define public folder
app.use('/static', express.static('public'));

// routes
/*
Students
- first name
- last name
- email
- classes
    * name
    * grade

    /students/          get post
    /students/:id       get put delete
*/

// GET localhost:PORT/students
// mongoose.model.find -> mongoose model method
// model.find(callback(error,result));

app.get('/students', (request, response) => {
    Students.find(error /* error message if there was an error */, result /* result from search */ => {
        if(error) {
            response.status(400).json({
                message: 'Data was not found',
                error: error.message
            });
        } else {
            response.json(result);
        }
        }
)});

// POST localhost:PORT/students
// model.save -> mongoose model method
// save is a promise and uses then-catch
app.post('/students', (request, response) => {
    // new instance of model student
    let Students = new Student(request.body); //body is the data we sent from the request
    //insert document into the collection
    Students.save() // attempts to save the database
        .then(() => { //successful saving
            response.json({
                success:true
            })  
        })
        .catch(error => {// couldn't be saved
            console.log(error);
            response.status(400).json({
                success:false,
                error: error.message
            })
        })
})


// /students/:id
/* GET /students/:id
model.findById -> mongoose model method
model.findById(callback(error,result)) */
app.get('/students/:id', (request, response) => {
    const id = request.params.id; // search by id in model Student
    Student.findById( //search by id in model Student
        id, // id to search for
        (error, result) => {
            if(error){
                response.status(400);
                response.json({
                    message:'Data was not found',
                    error: error.message
                })
            } else {
                response.json(result);
            }
            }
    )
    });

// PUT /students/:id
// model.findById
//model.save

app.put(`/students/:id`, (request,response) => {
    const id = request.params.id; // get id form request params
    // get the document to update
    Student.findById(
        id,
        (error,result) => { //result: Student
            if(error) { // was there an error?
                response.status(400); //status = 400
                response.json({ // send error to client
                    message: 'Data was not found.',
                    error: error.message
                });
            }else { // there was no error
                const data = request.body; // data = request.body
                //result = data
                result.firstName = data.firstName;
                result.lastName = data.lastName;
                result.email = data.email;
                //
                result.save() //result.save
                    .then(() =>
                        response.json({
                            success:true
                        });

                    )
            }
            

        }
    )

});

// start server
app.listen(PORT, () => console.log(`Express server listening on port ${PORT}`));
