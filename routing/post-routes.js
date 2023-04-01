const { Router } = require("express");
const {getAllPosts, addPosts, getPostById, updatePost, getPostByLocation, deletePost, likeImage, likeImageRemove, likeVisit, likeVisitRemove, likeAvoid, likeAvoidRemove, likeHotel, likeHotelRemove, likeMarket, likeMarketRemove, likeFood, likeFoodRemove, likeThings, likeThingsRemove, likePoints, likePointsRemove} = require("../controllers/post-controller");

const postRouter = Router();

postRouter.get("/", getAllPosts);
postRouter.get("/useId/:id",getPostById);
postRouter.get("/:lc",getPostByLocation);
postRouter.post("/", addPosts);
postRouter.put("/:id",updatePost);

postRouter.put("/likeimage/:id/:userId",likeImage);
postRouter.put("/dislikeimage/:id/:userId",likeImageRemove);

postRouter.put("/likemustVisit/:id/:userId",likeVisit);
postRouter.put("/dislikemustVisit/:id/:userId",likeVisitRemove);

postRouter.put("/likeavoid/:id/:userId",likeAvoid);
postRouter.put("/dislikeavoid/:id/:userId",likeAvoidRemove);

postRouter.put("/likehotels/:id/:userId",likeHotel);
postRouter.put("/dislikehotels/:id/:userId",likeHotelRemove);

postRouter.put("/likemarket/:id/:userId",likeMarket);
postRouter.put("/dislikemarket/:id/:userId",likeMarketRemove);

postRouter.put("/likethings/:id/:userId",likeThings);
postRouter.put("/dislikethings/:id/:userId",likeThingsRemove);

postRouter.put("/likefood/:id/:userId",likeFood);
postRouter.put("/dislikefood/:id/:userId",likeFoodRemove);

postRouter.put("/likepoint/:id/:userId",likePoints);
postRouter.put("/dislikepoint/:id/:userId",likePointsRemove);

postRouter.delete("/:id",deletePost);

module.exports = postRouter;