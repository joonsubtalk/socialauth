const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create/Describe the Schema
const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
});

// Create Model (should be singular as mongoose will make it plural)
const User = mongoose.model('user', userSchema);

// Export Model
module.exports = User;
