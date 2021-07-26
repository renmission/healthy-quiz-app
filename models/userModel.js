const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    googleID: String,
    email: {
        type: String,
        required: true
    },
    firstName: String,
    lastName:  String,
    password:  String,
    confirmPassword: String,
    image:  String,
});

// UserSchema.pre('save', async function(next) {
//     this.password = await bcrypt.hash(this.passowrd, 12);

//     this.confirmPassword = undefined;

//     next();
// });

const User = mongoose.model('User', UserSchema);

module.exports = User;