var express = require('express');
var mongoose = require('mongoose');
var dotenv = require('dotenv');
// const url = 'mongodb://0.0.0.0:27017/TravelLog';
const bodyParser = require('body-parser');

const userRouter =  require("./routing/user-routes");
const postRouter = require('./routing/post-routes');
const quesRouter = require('./routing/question-routes');
const ansRouter = require('./routing/answer-routes');
const cors = require('cors');

const app = express();
dotenv.config();
//middlewares
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(cors({
    origin: ["http://localhost:3000/", "https://travel-mania.onrender.com/"]
}));
app.use(express.json());
app.use("/users", userRouter); 
app.use("/posts", postRouter);
app.use("/questions", quesRouter);
app.use("/answers", ansRouter);
//connections
//`mongodb+srv://admin:${process.env.MONGODB_PASSWORD}@cluster0.ccblsit.mongodb.net/?retryWrites=true&w=majority`
mongoose.connect(
    `mongodb+srv://admin:${process.env.MONGODB_PASSWORD}@cluster0.ccblsit.mongodb.net/?retryWrites=true&w=majority`
    )
    .then(() => app.listen(5050,() => console.log('listening to localhost post 5050'))
    )
    .catch((err) => console.log(err));

//adminTravel1234



