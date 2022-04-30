const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: String,
    username: {
        type: String,
        required: true
    },
    hash: String,
    salt: String,
    isAdmin: {type: Boolean, default: true},
    timestamp: {
        type: Date,
        default: Date.now()
    }
});

mongoose.model('User', UserSchema);