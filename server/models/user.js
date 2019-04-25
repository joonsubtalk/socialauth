const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

// Create/Describe the Schema
const userSchema = new Schema({
    method: {
        type: String,
        enum: ['local', 'google', 'facebook'],
        required: true,
    },
    local: {
        email: {
            type: String,
            lowercase: true,
        },
        password: {
            type: String,
        },
    },
    google: {
        id: String,
        email: {
            type: String,
            lowercase: true,
        }
    },
    facebook: {
        id: String,
        email: {
            type: String,
            lowercase: true,
        }
    },
});

// runs before the save()
userSchema.pre('save', async function(next){
    try {

        if (this.method !== 'local') next();

        // generate a salt
        const salt = await bcrypt.genSalt(10)
        // hash password with salt
        const passwordHash = await bcrypt.hash(this.local.password, salt);

        // set password to the new hashed password and replace plain text
        this.local.password = passwordHash;
        next();

    } catch (error) {
        next(error);
    }
});

userSchema.methods.isValidPassword = async function(newPassword) {
    try {
        // this.password will have been the new hashed pw
        return await bcrypt.compare(newPassword, this.local.password);
    } catch (error) {
        throw new Error(error);
    }
}

// Create Model (should be singular as mongoose will make it plural)
const User = mongoose.model('user', userSchema);

// Export Model
module.exports = User;
