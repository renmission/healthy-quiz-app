const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuizSchema = new Schema({
    gender: {
        type: String,
        enum: ['Male', 'Female'],
        required: true
    },
    height: String,
    weight: String,
    reason: {
        type: 'string',
    }
});

const Quiz = mongoose.model('Quiz', QuizSchema);

module.exports = Quiz;