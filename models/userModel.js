const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    google: {
        googleID: String,
        email: {
            type: String,
            unique: true,
        },
        firstName: String,
        lastName:  String,
        image:  String,
    },

    facebook: {
        facebookID: String,
        facebookDisplayName: String,
        email: {
            type: String,
            unique: true,
        },
        firstName: String,
        lastName:  String,
        image:  String,
    },

    local: {
        email: {
            type: String,
            unique: true,
        },
        firstName: String,
        lastName:  String,
        password:  String,
        confirmPassword: String,
    },

    gender: String,
    height: String,
    weight: String,
    mobileNumber: String,
    birthDate: String,
    country: String,
    postalCode: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
   
});

// UserSchema.pre('save', async function(next) {
//     this.password = await bcrypt.hash(this.passowrd, 12);

//     this.confirmPassword = undefined;

//     next();
// });

const User = mongoose.model('User', UserSchema);

module.exports = User;