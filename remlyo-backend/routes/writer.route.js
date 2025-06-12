import express from "express";
import ArticleRouter from "./article.route.js";

const WriterRouter = express.Router();


WriterRouter.use('/articles',ArticleRouter)

export default WriterRouter;
