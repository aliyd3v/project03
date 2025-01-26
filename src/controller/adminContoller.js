const { salt } = require("../config/config")
const { scryptHash } = require("../helper/crypto")
const { Admin } = require("../model/userModel")
const { errorHandling } = require("./errorController")
const { idChecking } = require("./idController")
const { uploadImage, getImageUrl } = require("./imageConroller")
const { validationController } = require("./validationController")
const fs = require('fs')

exports.adminsPage = async (req, res) => {
    try {
        // Get user.
        const user = await Admin.findById(req.cookies.userId)

        // Get all admins from database.
        const admins = await Admin.paginate({}, { sort: { username: 1 } })

        // Rendering.
        return res.render('admin', {
            layout: false,
            user,
            admins
        })
    }

    // Error handling.
    catch (error) {
        errorHandling(error, res)
    }
}

exports.adminCreatePage = async (req, res) => {
    try {
        // Get user.
        const user = await Admin.findById(req.cookies.userId)

        // Rendering.
        return res.render('admin-create', {
            layout: false,
            user
        })
    }

    // Error handling.
    catch (error) {
        errorHandling(error, res)
    }
}

exports.adminCreate = async (req, res) => {
    try {
        // Get user.
        const user = await Admin.findById(req.cookies.userId)

        // Result validation.
        const { data, error } = validationController(req, res)
        if (error) {
            // Rendering.
            return res.render('admin-create', {
                layout: false,
                inputedData: data,
                errorMessage: error,
                user
            })
        }

        // Registration path and name of file.
        const filePath = req.file.path
        const fileName = req.file.filename

        // Checking for existence admin with currend username.
        const condidat = await Admin.findOne({ username: data.username })
        if (condidat) {
            // Rendering.
            fs.unlinkSync(filePath)
            return res.render('admin-create', {
                layout: false,
                inputedData: data,
                errorMessage: `'${data.username}' already used. Please, enter another username!`,
                user
            })
        }

        // Uploading image to supabse storage and get image url.
        const { errorSupabase } = await uploadImage(fileName, filePath)
        if (errorSupabase) {
            fs.unlinkSync(filePath)
            // Responding.
            return res.render('category-create', {
                layout: false,
                inputed: data,
                errorMessage: 'Error uploading image! Please try again later.',
                user
            })
        }
        const { publicUrl } = await getImageUrl(fileName, filePath)
        fs.unlinkSync(filePath)

        // Hashing password.
        const passwordHash = await scryptHash(data.password, salt)

        // Writing new admin to database.
        await Admin.create({
            name: data.name,
            username: data.username,
            password: passwordHash,
            email: data.email,
            phone: data.phone,
            role: "ADMIN",
            image_url: publicUrl,
            image_name: fileName
        })

        // Redirect.
        return res.redirect('/admin')
    }

    // Error handling.
    catch (error) {
        errorHandling(error, res)
    }
}

exports.updateOneAdmin = async (req, res) => {
    const { params: { id } } = req
    try {
        // Checking id to valid.
        const idError = idChecking(req, id)
        if (idError) {
            // Rendering.
            return res.render('bad-request', { layout: false })
        }

        // Checking admin for existence.
        const admin = await Admin.findById(id)
        if (!admin) {
            // Rendering.
            return res.render('not-found', { layout: false })
        }

        // Checking admin role.
        if (admin.role == 'SUPERUSER') {
            // Rendering.
            return res.render('bad-request', { layout: false })
        }

        // Deleting admin from database.
        await Admin.findByIdAndUpdate(id, admin)

        // Redirect.
        return res.redirect('/admin')
    }

    // Error handling.
    catch (error) {
        errorHandling(error, res)
    }
}

exports.deleteOneAdmin = async (req, res) => {
    const { params: { id } } = req
    try {
        // Checking id to valid.
        const idError = idChecking(req, id)
        if (idError) {
            // Rendering.
            return res.render('bad-request', { layout: false })
        }

        // Checking admin for existence.
        const admin = await Admin.findById(id)
        if (!admin) {
            // Rendering.
            return res.render('not-found', { layout: false })
        }

        // Checking admin role.
        if (admin.role == 'SUPERUSER') {
            // Rendering.
            return res.render('bad-request', { layout: false })
        }

        // Deleting admin from database.
        await Admin.findByIdAndDelete(id)

        // Redirect.
        return res.redirect('/admin')
    }

    // Error handling.
    catch (error) {
        errorHandling(error, res)
    }
}

exports.profilePage = async (req, res) => {
    try {
        // Getting userId from cookies.
        const id = req.cookies.userId
        // Checking id to valid.
        const idError = idChecking(req, id)
        if (idError) {
            // Rendering.
            return res.render('bad-request', { layout: false })
        }

        // Find profile from database.
        const profile = await Admin.findById(id)
        if (!profile) {
            // Rendering.
            return res.render('not-found', { layout: false })
        }
        const user = profile

        // Rendering.
        return res.render('profile', {
            layout: false,
            userId: id,
            profile,
            user
        })
    }

    // Error handling.
    catch (error) {
        errorHandling(error, res)
    }
}