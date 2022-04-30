const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
    '99popularity': {
        type: Number,
        required: true,
    },
    director: {
        type: String,
        required: true
    },
    genre: {
        type: Array,
        required: true
    },
    imdb_score: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
})

mongoose.model('Movie', MovieSchema);