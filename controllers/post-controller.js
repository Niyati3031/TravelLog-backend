const { default: mongoose } = require("mongoose");
const { populate } = require("../models/Post");
const Post = require("../models/Post")
const User = require("../models/User");

exports.getAllPosts = async (req, res) => {
    let posts;
    try{
        posts = await Post.find().populate("user");

    }catch(err){
        return console.log(err);
    }

    if(!posts){
        return res.status(500).json({message: "Unexpected error occured"});
    }
    return res.status(200).json({posts});
}

exports.addPosts = async (req, res) => {
    const {image, location,budget, mustVisit, avoid, hotels, market, things, food, point, user } = req.body;

    if(!budget && 
        budget?.trim() === "" && 
        !mustVisit && 
        mustVisit.trim() === "" && 
        !avoid &&
        avoid.trim() === "" &&
        !location &&
        location.trim() === "" &&
        !hotels &&
        hotels.trim() === "" &&
        !market &&
        market.trim() === "" &&
        !hotels &&
        things.trim() === "" &&
        !things &&
        !food &&
        food.trim() === "" &&
        !point &&
        point.trim() === "" &&
        image.trim() === "" &&
        !user &&
        user.trim() === ""){
            return res.status(422).json({message : "Invalid data"});
        }
        //user id
        let existingUser;
        try{
            existingUser = await User.findById(user);
        }catch(err){
            return console.log(err);
        }

        if(!existingUser){
            return res.status(404).json({message: "user not found"});
        }
        //new post
        let post;

        try {
            post = new Post ({image, location,budget, mustVisit, avoid, hotels, market, things, food, point, user});

            const session = await mongoose.startSession();

            session.startTransaction();
            await post.save({session});
            existingUser.posts.push(post);            
            await existingUser.save({session});

            await session.commitTransaction();

        } catch (err) {
            return console.log(err);
        }

        if(!post){
            return res.status(500).json({message: "unexpected error occured"});
        }
        return res.status(201).json({post});
}

exports.getPostById = async (req, res) => {
    const id = req.params.id;

    let post;
    try {
        post = await Post.findById(id);
    } catch (err) {
        return console.log(err);
    }

    if(!post){
        return res.status(404).json({message: "no post found"});
    }
    return res.status(200).json({post});
}

exports.getPostByLocation = async (req, res) => {
    const location = req.params.lc;

    let post;
    try {
        post = await Post.find({"location":location});
    } catch (err) {
        return console.log(err);
    }

    if(!post){
        return res.status(404).json({message: "no post found"});
    }
    return res.status(200).json({post});
}

exports.updatePost = async (req, res) =>{
    const id = req.params.id;
    const {image, location,budget, mustVisit, avoid, hotels, market, things, food, point, user } = req.body;

    if(!budget && 
        budget.trim() === "" && 
        !mustVisit && 
        mustVisit.trim() === "" && 
        !avoid &&
        avoid.trim() === "" &&
        !location &&
        location.trim() === "" &&
        !hotels &&
        hotels.trim() === "" &&
        !market &&
        market.trim() === "" &&
        !hotels &&
        things.trim() === "" &&
        !things &&
        !food &&
        food.trim() === "" &&
        !point &&
        point.trim() === "" &&
        image.trim() === "" &&
        !user &&
        user.trim() === ""){
            return res.status(422).json({message : "Invalid data"});
        }

        let post;
        try {
            post = await Post.findByIdAndUpdate(id,{image,budget, location, mustVisit, avoid, hotels, market, things, food, point});

        } catch (err) {
            return console.log(err);
        }

        if(!post){
            return res.status(500).json({message: "unable to update"});
        }
        return res.status(200).json({message: "updated successfully"});
}

exports.deletePost = async (req, res) => {
    const id = req.params.id;
    let post;
    try {
        const session = await mongoose.startSession();
        session.startTransaction();
        post = await Post.findById(id).populate("user");
        post.user.posts.pull(post);
        await post.user.save({session});
        post = await Post.findByIdAndRemove(id);
        session.commitTransaction();
    } catch (err) {
        return console.log(err);
    }

    if(!post){
        return res.status(500).json({message: "unable to delete"});
    }
    return res.status(200).json({message: "deleted successfully"});
}

exports.likeImage = async (req, res) => {
    const id = req.params.id;

    let Mpost;
    Mpost = await Post.findById(id);
    if(!Mpost.likesImage.includes(req.params.userId) & !Mpost.dislikesImage.includes(req.params.userId)){
        let post;
        try {
            post = await Post.findByIdAndUpdate(id,{
                $push: {likesImage: req.params.userId}
            },{
                new:true
            });

        } catch (err) {
            return console.log(err);
        }

        if(!post){
            return res.status(500).json({message: "unable to update"});
        }
        return res.status(200).json({message: "updated successfully", type: "added"});
    }
    else{
        let post;
        try {
            post = await Post.findByIdAndUpdate(id,{
                $pull:{likesImage:req.params.userId}
            },{
                new:true
            });

        } catch (err) {
            return console.log(err);
        }

        if(!post){
            return res.status(500).json({message: "unable to update"});
        }
        return res.status(200).json({message: "updated successfully", type: "removed"});
    }

}

exports.likeImageRemove = async (req, res) => {
    const id = req.params.id;

    let Mpost;
    Mpost = await Post.findById(id);
    if(!Mpost.dislikesImage.includes(req.params.userId) & !Mpost.likesImage.includes(req.params.userId)){
        let post;
        try {
            post = await Post.findByIdAndUpdate(id,{
                $push: {dislikesImage: req.params.userId}
            },{
                new:true
            });

        } catch (err) {
            return console.log(err);
        }

        if(!post){
            return res.status(500).json({message: "unable to update"});
        }
        return res.status(200).json({message: "updated successfully", type: "added"});
    }
    else{
        let post;
        try {
            post = await Post.findByIdAndUpdate(id,{
                $pull:{dislikesImage:req.params.userId}
            },{
                new:true
            });

        } catch (err) {
            return console.log(err);
        }

        if(!post){
            return res.status(500).json({message: "unable to update"});
        }
        return res.status(200).json({message: "updated successfully", type: "removed"});
    }

}

exports.likeVisit = async (req, res) => {
    const id = req.params.id;

    let Mpost;
    Mpost = await Post.findById(id);
    if(!Mpost.likesMustVisit.includes(req.params.userId) & !Mpost.dislikesMustVisit.includes(req.params.userId)){
        let post;
        try {
            post = await Post.findByIdAndUpdate(id,{
                $push: {likesMustVisit: req.params.userId}
            },{
                new:true
            });

        } catch (err) {
            return console.log(err);
        }

        if(!post){
            return res.status(500).json({message: "unable to update"});
        }
        return res.status(200).json({message: "updated successfully", type: "added"});
    }
    else{
        let post;
        try {
            post = await Post.findByIdAndUpdate(id,{
                $pull:{likesMustVisit:req.params.userId}
            },{
                new:true
            });

        } catch (err) {
            return console.log(err);
        }

        if(!post){
            return res.status(500).json({message: "unable to update"});
        }
        return res.status(200).json({message: "updated successfully", type: "removed"});
    }

}

exports.likeVisitRemove = async (req, res) => {
    const id = req.params.id;

    let Mpost;
    Mpost = await Post.findById(id);
    if(!Mpost.dislikesMustVisit.includes(req.params.userId) & !Mpost.likesMustVisit.includes(req.params.userId)){
        let post;
        try {
            post = await Post.findByIdAndUpdate(id,{
                $push: {dislikesMustVisit: req.params.userId}
            },{
                new:true
            });

        } catch (err) {
            return console.log(err);
        }

        if(!post){
            return res.status(500).json({message: "unable to update"});
        }
        return res.status(200).json({message: "updated successfully", type: "added"});
    }
    else{
        let post;
        try {
            post = await Post.findByIdAndUpdate(id,{
                $pull:{dislikesMustVisit:req.params.userId}
            },{
                new:true
            });

        } catch (err) {
            return console.log(err);
        }

        if(!post){
            return res.status(500).json({message: "unable to update"});
        }
        return res.status(200).json({message: "updated successfully", type: "removed"});
    }

}

exports.likeAvoid = async (req, res) => {
    const id = req.params.id;

    let Mpost;
    Mpost = await Post.findById(id);
    if(!Mpost.likesAvoid.includes(req.params.userId) & !Mpost.dislikesAvoid.includes(req.params.userId)){
        let post;
        try {
            post = await Post.findByIdAndUpdate(id,{
                $push: {likesAvoid: req.params.userId}
            },{
                new:true
            });

        } catch (err) {
            return console.log(err);
        }

        if(!post){
            return res.status(500).json({message: "unable to update"});
        }
        return res.status(200).json({message: "updated successfully", type: "added"});
    }
    else{
        let post;
        try {
            post = await Post.findByIdAndUpdate(id,{
                $pull:{likesAvoid:req.params.userId}
            },{
                new:true
            });

        } catch (err) {
            return console.log(err);
        }

        if(!post){
            return res.status(500).json({message: "unable to update"});
        }
        return res.status(200).json({message: "updated successfully", type: "removed"});
    }

}

exports.likeAvoidRemove = async (req, res) => {
    const id = req.params.id;

    let Mpost;
    Mpost = await Post.findById(id);
    if(!Mpost.dislikesAvoid.includes(req.params.userId) & !Mpost.likesAvoid.includes(req.params.userId)){
        let post;
        try {
            post = await Post.findByIdAndUpdate(id,{
                $push: {dislikesAvoid: req.params.userId}
            },{
                new:true
            });

        } catch (err) {
            return console.log(err);
        }

        if(!post){
            return res.status(500).json({message: "unable to update"});
        }
        return res.status(200).json({message: "updated successfully", type: "added"});
    }
    else{
        let post;
        try {
            post = await Post.findByIdAndUpdate(id,{
                $pull:{dislikesAvoid:req.params.userId}
            },{
                new:true
            });

        } catch (err) {
            return console.log(err);
        }

        if(!post){
            return res.status(500).json({message: "unable to update"});
        }
        return res.status(200).json({message: "updated successfully", type: "removed"});
    }

}

exports.likeHotel = async (req, res) => {
    const id = req.params.id;

    let Mpost;
    Mpost = await Post.findById(id);
    if(!Mpost.likesHotel.includes(req.params.userId) & !Mpost.dislikesHotel.includes(req.params.userId)){
        let post;
        try {
            post = await Post.findByIdAndUpdate(id,{
                $push: {likesHotel: req.params.userId}
            },{
                new:true
            });

        } catch (err) {
            return console.log(err);
        }

        if(!post){
            return res.status(500).json({message: "unable to update"});
        }
        return res.status(200).json({message: "updated successfully", type: "added"});
    }
    else{
        let post;
        try {
            post = await Post.findByIdAndUpdate(id,{
                $pull:{likesHotel:req.params.userId}
            },{
                new:true
            });

        } catch (err) {
            return console.log(err);
        }

        if(!post){
            return res.status(500).json({message: "unable to update"});
        }
        return res.status(200).json({message: "updated successfully", type: "removed"});
    }

}

exports.likeHotelRemove = async (req, res) => {
    const id = req.params.id;

    let Mpost;
    Mpost = await Post.findById(id);
    if(!Mpost.dislikesHotel.includes(req.params.userId) & !Mpost.likesHotel.includes(req.params.userId)){
        let post;
        try {
            post = await Post.findByIdAndUpdate(id,{
                $push: {dislikesHotel: req.params.userId}
            },{
                new:true
            });

        } catch (err) {
            return console.log(err);
        }

        if(!post){
            return res.status(500).json({message: "unable to update"});
        }
        return res.status(200).json({message: "updated successfully", type: "added"});
    }
    else{
        let post;
        try {
            post = await Post.findByIdAndUpdate(id,{
                $pull:{dislikesHotel:req.params.userId}
            },{
                new:true
            });

        } catch (err) {
            return console.log(err);
        }

        if(!post){
            return res.status(500).json({message: "unable to update"});
        }
        return res.status(200).json({message: "updated successfully", type: "removed"});
    }

}

exports.likeMarket = async (req, res) => {
    const id = req.params.id;

    let Mpost;
    Mpost = await Post.findById(id);
    if(!Mpost.likesMarket.includes(req.params.userId) & !Mpost.dislikesMarket.includes(req.params.userId)){
        let post;
        try {
            post = await Post.findByIdAndUpdate(id,{
                $push: {likesMarket: req.params.userId}
            },{
                new:true
            });

        } catch (err) {
            return console.log(err);
        }

        if(!post){
            return res.status(500).json({message: "unable to update"});
        }
        return res.status(200).json({message: "updated successfully", type: "added"});
    }
    else{
        let post;
        try {
            post = await Post.findByIdAndUpdate(id,{
                $pull:{likesMarket:req.params.userId}
            },{
                new:true
            });

        } catch (err) {
            return console.log(err);
        }

        if(!post){
            return res.status(500).json({message: "unable to update"});
        }
        return res.status(200).json({message: "updated successfully", type: "removed"});
    }

}

exports.likeMarketRemove = async (req, res) => {
    const id = req.params.id;

    let Mpost;
    Mpost = await Post.findById(id);
    if(!Mpost.dislikesMarket.includes(req.params.userId) & !Mpost.likesMarket.includes(req.params.userId)){
        let post;
        try {
            post = await Post.findByIdAndUpdate(id,{
                $push: {dislikesMarket: req.params.userId}
            },{
                new:true
            });

        } catch (err) {
            return console.log(err);
        }

        if(!post){
            return res.status(500).json({message: "unable to update"});
        }
        return res.status(200).json({message: "updated successfully", type: "added"});
    }
    else{
        let post;
        try {
            post = await Post.findByIdAndUpdate(id,{
                $pull:{dislikesMarket:req.params.userId}
            },{
                new:true
            });

        } catch (err) {
            return console.log(err);
        }

        if(!post){
            return res.status(500).json({message: "unable to update"});
        }
        return res.status(200).json({message: "updated successfully", type: "removed"});
    }

}
exports.likeFood = async (req, res) => {
    const id = req.params.id;

    let Mpost;
    Mpost = await Post.findById(id);
    if(!Mpost.likesFood.includes(req.params.userId) & !Mpost.dislikesFood.includes(req.params.userId)){
        let post;
        try {
            post = await Post.findByIdAndUpdate(id,{
                $push: {likesFood: req.params.userId}
            },{
                new:true
            });

        } catch (err) {
            return console.log(err);
        }

        if(!post){
            return res.status(500).json({message: "unable to update"});
        }
        return res.status(200).json({message: "updated successfully", type: "added"});
    }
    else{
        let post;
        try {
            post = await Post.findByIdAndUpdate(id,{
                $pull:{likesFood:req.params.userId}
            },{
                new:true
            });

        } catch (err) {
            return console.log(err);
        }

        if(!post){
            return res.status(500).json({message: "unable to update"});
        }
        return res.status(200).json({message: "updated successfully", type: "removed"});
    }

}

exports.likeFoodRemove = async (req, res) => {
    const id = req.params.id;

    let Mpost;
    Mpost = await Post.findById(id);
    if(!Mpost.dislikesFood.includes(req.params.userId) & !Mpost.likesFood.includes(req.params.userId)){
        let post;
        try {
            post = await Post.findByIdAndUpdate(id,{
                $push: {dislikesFood: req.params.userId}
            },{
                new:true
            });

        } catch (err) {
            return console.log(err);
        }

        if(!post){
            return res.status(500).json({message: "unable to update"});
        }
        return res.status(200).json({message: "updated successfully", type: "added"});
    }
    else{
        let post;
        try {
            post = await Post.findByIdAndUpdate(id,{
                $pull:{dislikesFood:req.params.userId}
            },{
                new:true
            });

        } catch (err) {
            return console.log(err);
        }

        if(!post){
            return res.status(500).json({message: "unable to update"});
        }
        return res.status(200).json({message: "updated successfully", type: "removed"});
    }

}

exports.likeThings = async (req, res) => {
    const id = req.params.id;

    let Mpost;
    Mpost = await Post.findById(id);
    if(!Mpost.likesThings.includes(req.params.userId) & !Mpost.dislikesThings.includes(req.params.userId)){
        let post;
        try {
            post = await Post.findByIdAndUpdate(id,{
                $push: {likesThings: req.params.userId}
            },{
                new:true
            });

        } catch (err) {
            return console.log(err);
        }

        if(!post){
            return res.status(500).json({message: "unable to update"});
        }
        return res.status(200).json({message: "updated successfully", type: "added"});
    }
    else{
        let post;
        try {
            post = await Post.findByIdAndUpdate(id,{
                $pull:{likesThings:req.params.userId}
            },{
                new:true
            });

        } catch (err) {
            return console.log(err);
        }

        if(!post){
            return res.status(500).json({message: "unable to update"});
        }
        return res.status(200).json({message: "updated successfully", type: "removed"});
    }

}

exports.likeThingsRemove = async (req, res) => {
    const id = req.params.id;

    let Mpost;
    Mpost = await Post.findById(id);
    if(!Mpost.dislikesThings.includes(req.params.userId) & !Mpost.likesThings.includes(req.params.userId)){
        let post;
        try {
            post = await Post.findByIdAndUpdate(id,{
                $push: {dislikesThings: req.params.userId}
            },{
                new:true
            });

        } catch (err) {
            return console.log(err);
        }

        if(!post){
            return res.status(500).json({message: "unable to update"});
        }
        return res.status(200).json({message: "updated successfully", type: "added"});
    }
    else{
        let post;
        try {
            post = await Post.findByIdAndUpdate(id,{
                $pull:{dislikesThings:req.params.userId}
            },{
                new:true
            });

        } catch (err) {
            return console.log(err);
        }

        if(!post){
            return res.status(500).json({message: "unable to update"});
        }
        return res.status(200).json({message: "updated successfully", type: "removed"});
    }

}

exports.likePoints = async (req, res) => {
    const id = req.params.id;

    let Mpost;
    Mpost = await Post.findById(id);
    if(!Mpost.likesPoint.includes(req.params.userId) & !Mpost.dislikesPoint.includes(req.params.userId)){
        let post;
        try {
            post = await Post.findByIdAndUpdate(id,{
                $push: {likesPoint: req.params.userId}
            },{
                new:true
            });

        } catch (err) {
            return console.log(err);
        }

        if(!post){
            return res.status(500).json({message: "unable to update"});
        }
        return res.status(200).json({message: "updated successfully", type: "added"});
    }
    else{
        let post;
        try {
            post = await Post.findByIdAndUpdate(id,{
                $pull:{likesPoint:req.params.userId}
            },{
                new:true
            });

        } catch (err) {
            return console.log(err);
        }

        if(!post){
            return res.status(500).json({message: "unable to update"});
        }
        return res.status(200).json({message: "updated successfully", type: "removed"});
    }

}

exports.likePointsRemove = async (req, res) => {
    const id = req.params.id;

    let Mpost;
    Mpost = await Post.findById(id);
    if(!Mpost.dislikesPoint.includes(req.params.userId) & !Mpost.likesPoint.includes(req.params.userId)){
        let post;
        try {
            post = await Post.findByIdAndUpdate(id,{
                $push: {dislikesPoint: req.params.userId}
            },{
                new:true
            });

        } catch (err) {
            return console.log(err);
        }

        if(!post){
            return res.status(500).json({message: "unable to update"});
        }
        return res.status(200).json({message: "updated successfully", type: "added"});
    }
    else{
        let post;
        try {
            post = await Post.findByIdAndUpdate(id,{
                $pull:{dislikesPoint:req.params.userId}
            },{
                new:true
            });

        } catch (err) {
            return console.log(err);
        }

        if(!post){
            return res.status(500).json({message: "unable to update"});
        }
        return res.status(200).json({message: "updated successfully", type: "removed"});
    }

}
