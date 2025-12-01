const {validationResult} = require('express-validator')
const foodModel = require ('../models/food.model')
const storageService = require('../services/storage.service')
const{v4: uuid} = require('uuid')


async function createFood (req,res){

    const error = validationResult(req)
    if(!error.isEmpty()){
        return res.status(400).json({
            success: false,
            message: error.array()
        })
    }

    try {

        if(!req.file)
        {
            res.status(400).json({
                message: "Please upload file"
            })
        }

        
        const fileUploadResult = await storageService.uploadFile(req.file.buffer,uuid())
        console.log(fileUploadResult)
    
        const foodItem = await foodModel.create({
            name: req.body.name,
            description: req.body.description,
            video: fileUploadResult.url,
            foodPartner: req.foodPartner._id
        })
    
        res.status(201).json({
            message: "Food Created successfully",
            food:foodItem,
        })
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
        })
    }

    // console.log(req.foodPartner)
    // console.log(req.body)
    // console.log(req.file)

}

module.exports = {
    createFood
}