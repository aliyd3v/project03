const { checkSchema } = require('express-validator')
const { createVerifyTokenForGetAllBookingsOrdersValidationSchema } = require('../validation/createVerifyTokenForGetAllBookingsOrdersValidationSchema')
const { createVerifyForGetAllBookingAndOrder, verifyTokenAndCreateOrderOrBooking } = require('../controller/verifyContorller')
const { queryEmailValidationSchema } = require('../validation/queryEmailValidationSchema')
const { cancelBookingForCustomer, getOneCustomer } = require('../controller/customerContoller')
const { jwtAccessMiddleware } = require('../middleware/jwtAccessMiddleware')
const { getOneCustomerValidationSchema } = require('../validation/getOneCustomerValidationSchema')
const { searchMCategoriesValidatorSchema } = require('../validation/searchCategoriesValidationSchema')
const { searchingCategory, searchingMeals, searchCustomer } = require('../controller/searchController')
const { searchMealsValidatorSchema } = require('../validation/searchMealsValidationSchema')
const { searchCustomerValidatorSchema } = require('../validation/searchCustomerValidatorSchema')
const { directNotFound } = require('../controller/directNotFoundMessage')
const { deleteAllCategories } = require('../controller/categoryController')
const { deleteAllBookings } = require('../controller/bookingController')
const { deleteAllOrders } = require('../controller/orderController')
const { deleteManyStols } = require('../controller/stolController')
const { deleteManyMeals } = require('../controller/mealController')
const { deleteAllHistory } = require('../controller/historyController')
const { badRequest } = require('../controller/badRequestPage')

const router = require('express').Router()

router

    // Checking token to valid.
    .get('/checking/token', jwtAccessMiddleware, (req, res) => res.status(200).send({ success: true, error: false, data: { message: "Token is valid." } }))

    // Customer cabinet route.
    .post('/cabinet/create-verify', checkSchema(createVerifyTokenForGetAllBookingsOrdersValidationSchema), createVerifyForGetAllBookingAndOrder)
    .post('/cabinet/cancel-booking/:id', checkSchema(queryEmailValidationSchema), cancelBookingForCustomer)

    // Customer route for admin.
    .get('/customer/get-one', jwtAccessMiddleware, checkSchema(getOneCustomerValidationSchema), getOneCustomer)

    // Verify token route.
    .get('/verify/:id', verifyTokenAndCreateOrderOrBooking)

    // Search route.
    .get('/search/category', checkSchema(searchMCategoriesValidatorSchema), searchingCategory)
    .get('/search/meal', checkSchema(searchMealsValidatorSchema), searchingMeals)
    .get('/search/search', jwtAccessMiddleware, checkSchema(searchCustomerValidatorSchema), searchCustomer)

    // Bad request message.
    .get('/bad-request', badRequest)
    
    // Direct not found message.
    .use(directNotFound)

    // For testing.
    .post('/categories/delete-all', jwtAccessMiddleware, deleteAllCategories)
    .post('/booking/delete-all', jwtAccessMiddleware, deleteAllBookings)
    .post('/order/delete-all', jwtAccessMiddleware, deleteAllOrders)
    .post('/stol/delete-all', jwtAccessMiddleware, deleteManyStols)
    .post('/meal/delete-all', jwtAccessMiddleware, deleteManyMeals)
    .post('/history/delete-all', jwtAccessMiddleware, deleteAllHistory)


module.exports = router