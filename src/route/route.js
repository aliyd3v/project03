const rootRouter = require("./rootRouter")
const adminRouter = require("./adminRouter")
const authRouter = require("./authRouter")
const bookingRouter = require("./bookingRouter")
const categoryRouter = require("./categoryRouter")
const historyRouter = require("./historyRouter")
const mealRouter = require("./mealRouter")
const orderRouter = require("./orderRouter")
const stolRouter = require("./stolRouter")
const otherRoutes = require('./otherRoutes')
const apiRouter = require('../api/route/route')

exports.appRouter = (app) => {
    app.use('/api', apiRouter)
    app.use('/', rootRouter)
    app.use('/', adminRouter)
    app.use('/', authRouter)
    app.use('/', bookingRouter)
    app.use('/', categoryRouter)
    app.use('/', historyRouter)
    app.use('/', mealRouter)
    app.use('/', orderRouter)
    app.use('/', stolRouter)
    app.use('/', otherRoutes)
}