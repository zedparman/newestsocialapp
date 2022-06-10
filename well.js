const verifyToken = (req, res, next) => {
    const authHeader = req.headers.token;
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT_SEC, (err, user) => {
            if (err) res.status(403).json("Token is not valid!");
            req.user = user;
            next();
        });
    } else {
        return res.status(401).json("You are not authenticated!");
    }
};

const verifyTokenAndAuthorization = (req, res, next) => {

    const authHeader = req.headers.token;
    if (!authHeader) return res.status(401).json("You are not authenticated!");

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SEC, (err, user) => {
        if (err) res.status(403).json("Token is not valid!");

        if ((user.id === req.params.id) || user.isAdmin) {
            return next
        }
        res.status(403).json("You are not alowed to do that!");
    });

};




const mongoose = require("mongoose");

const Schema = mongoose.Schema({
    userIp: {
        type: String,
        unique: true
    }
})

const BlackListModel = mongoose.model('black-list', Schema);



// index.js


app.use((req,res, next) => {
    const userIp = req.headers['x-forwareded-for'] // || req.address;

    BlackListModel.findOne({ userIp }).then(res => {
        if(!res) return next();
        return next(new Error('Your blocekd'))
    }).catch(next)

});



const router = require('express').Router;



router.get('/api/posts' , (req, res, next) => {
    // google.com/api/posts?category=latest
    // google.com/api/posts?category=best
    // google.com/api/posts?category=favorites
    // google.com/api/posts?category=oldest
    const { category } = req.query;

    const query = {};

    if(category === 'latest') {
        query.sort('-createdAt');
    } else if (category === 'best') {
        // query.rate = max
    } else if ( category == 'oldest') {
        query.sort('+createdAt');
    }
});