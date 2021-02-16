const mongoose = require('mongoose');

//instantiate object Schema
let Students = new mongoose.Schema ({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
});

// allows to require this file
module.exports = mongoose.model('students', /* Mongoose identifier */ Students /* Object Schema */);