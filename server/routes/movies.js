const mongoose = require('mongoose');
const router = require('express').Router();   
const Movie = mongoose.model('Movie');
const utils = require('../lib/utils');
// const escapeStringRegexp = require('escape-string-regexp');

//search route for movies
router.get('/search', (req, res) => {
    const {name, sort_by, sort_order, genre, page = 0} = req.query;
    let sortBy;
    switch (sort_by) {
        case 'moviename':
            sortBy = 'name'
            break;
        case 'popularity':
            sortBy = 'imdb_score'
            break;
        case 'directorname':
            sortBy = 'director'
            break;
        default:
            sortBy = 'name'
            break;
    }
    const searchObj = {};
    if(name) {
        searchObj.$or = [{ name: {$regex: name, $options: 'i'}}, {director: {$regex: name, $options: 'i'}}]
    }
    if(genre) searchObj.genre = genre;
    // skipping of pages is needed for infinite scroll
    const skipPages = parseInt(page) * 15;
    Movie.find(searchObj)
        .sort({ [sortBy]: sort_order === 'asc' ? 1 : -1 })
        .skip(skipPages)
        .limit(15)
        .select({ name: 1, genre: 1, '99popularity': 1, imdb_score: 1, director: 1 })
        .exec(function (err, movie) {
            if (err) res.send({success: false, msg: err});
            else res.send({success: true, msg: movie, page: parseInt(page) + 1, lastPage: movie.length < 15 ? true : false});
        });
})

//Route protecting using admin middleware
router.post('/delete', utils.adminMiddleware, (req, res) => {
    const {mid} = req.body;
    Movie.deleteOne({ _id: mid })
    .exec((err, movie) => {
        if(err) res.send({success: false, msg: err});
        else res.send({success: true, msg: movie});
    });
})

router.post('/add', utils.adminMiddleware, (req, res) => {
    const {name, director, rating, genre} = req.body;
    const Rating = rating ? parseFloat(rating) : rating;
    const errObj = {name: '', director: '', rating: '', genre: ''};
    let isError = false;
    if(!name || typeof(name) !== 'string') {
        errObj.name = 'Movie name cannot be empty'
        isError = true
    }
    if(!director || typeof(director) !== 'string') {
        errObj.director = 'Director name cannot be empty'
        isError = true
    }
    if(!Rating || Rating > 10 || Rating < 0) {
        errObj.rating = 'Rating must be between 0 & 10'
        isError = true
    }
    if(!genre || typeof(genre) !== 'object' || genre.length === 0) {
        errObj.genre = 'Genre is required'
        isError = true
    }
    if (isError) res.send({success: false, msg: errObj});
    else Movie.create({ name, director, imdb_score: Rating, genre, '99popularity': Rating*10 }, (err, movie) => {
        if(err) res.send({success: false, msg: {...errObj, general: err}});
        else res.send({success: true, msg: movie});
    });
})

router.post('/edit', utils.adminMiddleware, (req, res) => {
    const {name, director, rating, genre, id} = req.body;
    const Rating = rating ? parseInt(rating) : rating;
    const errObj = {name: '', director: '', rating: '', genre: ''};
    let isError = false;
    if(!name || typeof(name) !== 'string') {
        errObj.name = 'Movie name cannot be empty'
        isError = true
    }
    if(!director || typeof(director) !== 'string') {
        errObj.director = 'Director name cannot be empty'
        isError = true
    }
    if(!rating || typeof(rating) !== 'number' || Rating > 10 || Rating < 0) {
        errObj.rating = 'Rating must be between 0 & 10'
        isError = true
    }
    if(!genre || typeof(genre) !== 'array' || genre.length === 0) {
        errObj.genre = 'Genre is required'
        isError = true
    }
    if(!id) res.send({success: false, msg: 'Movie doesn\'t exist'})
    else if (isError) res.send({success: false, msg: errObj});
    else Movie.findByIdAndUpdate(id, { director, imdb_score: rating, genre, '99popularity': Rating*10 })
    .exec((err, movie) => {
        if(err) res.send({success: false, msg: {...errObj, general: err}});
        else res.send({success: true, msg: movie});
    });
})

router.get('/getMovie/:mid', (req, res) => {
    const {mid} = req.params;
    Movie.findById(mid)
    .exec((err, movie) => {
        if(err) res.send({success: false, msg: err});
        else res.send({success: true, msg: movie});
    })
})

module.exports = router