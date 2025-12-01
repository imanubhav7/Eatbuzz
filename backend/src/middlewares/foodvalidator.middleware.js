const { body } = require("express-validator");
const foodValidator = [
    body("name")
    .notEmpty()
    .withMessage("Food name is required")
    .isLength({min:3})
    .withMessage("Food name must be at least 3 characters"),

    body("description")
    .notEmpty()
    .withMessage("Food desc is required")
    .isLength({min:5})
    .withMessage("Food desc must be at least 5 characters")
]

module.exports = {
    foodValidator
}