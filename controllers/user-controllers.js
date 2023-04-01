const bcrypt = require("bcryptjs");
const User =  require("../models/User");


exports.getAllUsers = async(req, res) => {
    let users;
    try{
        users = await User.find();
    }catch(err){
        console.log(err);
    }
    if(!users){
        return res.status(500).json({message: "Unexpected Error occured"});
    }
    return res.status(200).json({users});
};

exports.signup = async(req, res, next) => {
    const {name, email, password } = req.body;
    if(!name && name.trim() =="" && !email && email.trim() =="" && !password && password.trim() == "" && password.length <6){
        return res.status(422).json({message: "Invalid data"});
    }
    const hashedPassword = bcrypt.hashSync(password);
    let user;
    try {
        user = new User({email, name, password: hashedPassword});
        await user.save();
    }catch(err) {
        return console.log(err);
    }

    if(!user) {
        return res.status(500).json({message: "Unexpected Error Occured"});
    }

    return res.status(201).json({user});
};

exports.login = async (req, res, next) =>{
    const {email, password} = req.body;
    if(!email && email.trim() =="" && !password && password.trim() == "" && password.length <6){
        return res.status(422).json({message: "Invalid data"});
    }

    let existingUser;
    try{
        existingUser = await User.findOne({email});
    }catch(err){
        return console.log(err);
    }
    if(!existingUser){
        return res.status(404).json({message: "No user found"});
    }

    const isPassCorrect = bcrypt.compareSync(password, existingUser.password);
    if(!isPassCorrect){
        return res.status(400).json({message: "Incorrect password"});
    }
    return res.status(200).json({id: existingUser.id, message: "Login Successful"});
};

exports.getUserById = async(req, res) => {
    const id = req.params.id;

    let user;
    try {
        user = await User.findById(id).populate("posts");
    } catch (error) {
        return console.log(error);
    }

    if(!user){
        return res.status(404).json({message:"no user found"});
    }

    return res.status(200).json({user});
}
