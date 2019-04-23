const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
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

// runs before the save()
userSchema.pre('save', async function(next){
    try {
        // generate a salt
        const salt = await bcrypt.genSalt(10)
        // hash password with salt
        const passwordHash = await bcrypt.hash(this.password, salt);

        // set password to the new hashed password and replace plain text
        this.password = passwordHash;
        next();

    } catch (error) {
        next(error);
    }
});

userSchema.methods.isValidPassword = async function(newPassword) {
    try {
        // this.password will have been the new hashed pw
        return await bcrypt.compare(newPassword, this.password);
    } catch (error) {
        throw new Error(error);
    }
}

// Create Model (should be singular as mongoose will make it plural)
const User = mongoose.model('user', userSchema);

// Export Model
module.exports = User;
