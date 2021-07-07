const express = require('express');
const router = express.Router();
const Programa = require('../../models/programa');



router.get('/matprima', wrapAsync(async(req, res, next) => {







    res.render('matprima')
}))
function wrapAsync(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch(e => next(e))
    }
}
module.exports = router;