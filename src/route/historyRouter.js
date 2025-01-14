const { historyPage, getAllHistory } = require('../controller/historyController')
const { jwtAccessMiddleware } = require('../middleware/jwtAccessMiddleware')

const router = require('express').Router()

router
    .get('/history', historyPage)
    .get('/histories', jwtAccessMiddleware, getAllHistory)

module.exports = router