const Account = require('../models/Account');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) newObj[el] = obj[el];
    });

    return newObj;
};

module.exports = {
    getMe: (req, res, next) => {
        req.params.id = req.user.id;
        next();
    },
    updateMe: catchAsync(async (req, res, next) => {
        // Create error if user POSTs password data
        if (req.body.password || req.body.passwordConfirm) {
            return next(
                new AppError("This route is not for password updates. Please use /updateMyPassword.", 400)
            );
        }

        // Filtered out unwanted fields names that are not allowed to be updated
        const filteredBody = filterObj(req.body, "username", "address", "phoneNumber", "residentId", "cashBalance", "tokenBalance");
        // if (req.file) filteredBody.photo = req.file.filename; // Use for upload photo

        const [_, updatedRows] = await Account.update(filteredBody, {
            where: { id: req.user.id },
            returning: true, // Get the updated rows
        });
        
        res.status(200).json({
            status: "success",
            data: updatedRows
        });
    }),
    deleteMe: catchAsync(async (req, res, next) => {
        const account = await Account.findByPk(req.user.id);

        if (!account) {
            return next(new AppError("No account found with that ID", 404));
        }

        await account.update({ active: false });

        res.status(204).json({
            status: "success",
            data: null,
        });
    }),
    createAccount: (req, res) => {
        res.status(500).json({
            status: "error",
            message: "This route is not yet defined! Please use /signup instead"
        });
    },

    getAccount: factory.getOne(Account),
    getAllAccounts: factory.getAll(Account),
    updateAccount: factory.updateOne(Account),
    deleteAccount: factory.deleteOne(Account)
}