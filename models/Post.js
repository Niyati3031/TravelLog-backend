const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    image: [{
        type: String,
        required: true,
    }],
    likesImage:[{type:mongoose.Types.ObjectId,ref:"User"}],
    dislikesImage: [{type:mongoose.Types.ObjectId,ref:"User"}],
    location: {
        type: String,
        required: true,
    },
    budget: {
        type: Number,
        required : true,
    },
    mustVisit: [{type: String, required: true}],
    likesMustVisit: [{type:mongoose.Types.ObjectId,ref:"User"}],
    dislikesMustVisit: [{type:mongoose.Types.ObjectId,ref:"User"}],
    avoid: [{type: String, required: true}],
    likesAvoid: [{type:mongoose.Types.ObjectId,ref:"User"}],
    dislikesAvoid: [{type:mongoose.Types.ObjectId,ref:"User"}],
    hotels: [{type: String, required: true}],
    likesHotel:[{type:mongoose.Types.ObjectId,ref:"User"}],
    dislikesHotel: [{type:mongoose.Types.ObjectId,ref:"User"}],
    market: [{type: String, required: true}],
    likesMarket: [{type:mongoose.Types.ObjectId,ref:"User"}],
    dislikesMarket: [{type:mongoose.Types.ObjectId,ref:"User"}],
    things: [{type: String, required: true}],
    likesThings: [{type:mongoose.Types.ObjectId,ref:"User"}],
    dislikesThings: [{type:mongoose.Types.ObjectId,ref:"User"}],
    food: [{type: String, required: true}],
    likesFood: [{type:mongoose.Types.ObjectId,ref:"User"}],
    dislikesFood: [{type:mongoose.Types.ObjectId,ref:"User"}],
    point: [{type: String, required: true}],
    likesPoint: [{type:mongoose.Types.ObjectId,ref:"User"}],
    dislikesPoint: [{type:mongoose.Types.ObjectId,ref:"User"}],
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
    }
});

module.exports = mongoose.model('Post',postSchema);