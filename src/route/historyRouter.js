const { historyPage, getAllHistory } = require('../controller/historyController')
const { jwtAccessMiddleware } = require('../middleware/jwtAccessMiddleware')

const router = require('express').Router()

router
    .get('/history', jwtAccessMiddleware, historyPage)

module.exports = router