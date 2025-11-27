const userModel = require ('../models/user.model')
const foodPartnerModel = require('../models/foodpartner.model')
const bcrypt = require('bcryptjs')
const jwt = require ('jsonwebtoken')

// register API 
async function registerUser(req,res){
    const {fullName,email,password} = req.body;

    const isUserAlreadyExists = await userModel.findOne({
        email
    })

    // userCheck 
    if(isUserAlreadyExists){
        return res.status(400).json({
            message: "User already exists"
        })
    }

    // hashing password 
    const hashedPassword = await bcrypt.hash(password,10);

    // user creation 
    const user = await userModel.create({
        fullName,
        email,
        password: hashedPassword,
    })

    // token creation 
    const token = jwt.sign({
        id: user._id,
    },process.env.JWT_SECRET)
    res.cookie("token",token)

    res.status(201).json({
        message: "User registered successfully",
        user:{
            _id: user._id,
            email: user.email,
            fullName: user.fullName,
        }

    })

}

// login API 
async function loginUser (req,res){
    const{email,password} = req.body;
    const user = await userModel.findOne({
        email,
    })
    if(!user){
        res.status(400).json({
            message: "Invalid email or password"
        })
    }

    

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid){
        return res.status(400).json({
            message: "Invalid user or passwords"
        })
    }

    const token = jwt.sign({
        id:user._id,
    },process.env.JWT_SECRET)
    res.cookie("token",token)


    res.status(201).json({
        message: "User loggedIn successfully",
        user:{
            _id:user.id,
            email:user.email,
            fullName: user.fullName,
        }
    })
}

// logout API 

async function logoutUser(req,res){
    res.clearCookie("token");
    res.status(200).json({
        message: "Logout successfully"
    })
}




// foodPartner register API 
async function registerFoodPartner(req,res){
    const{name,email,password} = req.body;

    const isAccountAlreadyExists = await foodPartnerModel.findOne({
        email,
    })
    if(isAccountAlreadyExists){
        return res.status(400).json({
            message:"Food partner account already exists"
        })

    }
    const hashedpassword = await bcrypt.hash(password, 10)
    const foodPartner = await foodPartnerModel.create({
        name,
        email,
        password: hashedpassword
    })

    const token = jwt.sign({
        id: foodPartner._id,  
    },process.env.JWT_SECRET)

    res.cookie("token",token)
    res.status(201).json({
        message:"Food partner registered successfully",
        foodPartner:{
            _id: foodPartner._id,
            email: foodPartner.email,
            name: foodPartner.name,
        }
    })
}

// login API for FoodPartner 
async function loginFoodPartner(req,res){
    const {email, password} = req.body;

    const foodPartnerUser = await foodPartnerModel.findOne({
        email,
    })
    if(!foodPartnerUser){
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, foodPartnerUser.password);
    if(!isPasswordValid){
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }
    const token = jwt.sign({
        _id: foodPartnerUser._id,
    },process.env.JWT_SECRET)
    res.cookie("token",token);

    res.status(201).json({
        message: "Food partner user login successfully",
        foodPartnerUser:{
            _id: foodPartnerUser._id,
            email: foodPartnerUser.email,
            name: foodPartnerUser.name
        }
    })
}

// Logout API  
async function logoutFoodPartner(req,res){
    res.clearCookie("token")
    res.status(200).json({
        message: "Food partner logout successfully"
    })
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    registerFoodPartner,
    loginFoodPartner,
    logoutFoodPartner
}