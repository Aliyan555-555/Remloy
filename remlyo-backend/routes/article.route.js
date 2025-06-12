import express from "express";
import {
  createArticle,
  getAllArticles,
  getArticleById,
  getArticlesByWriterId,
  updateArticle,
  checkSlugUniqueness,
} from "../controllers/article.controller.js";

const ArticleRouter = express.Router();
// create Article route
ArticleRouter.post("/", createArticle);
// get all articles route
ArticleRouter.get("/", getAllArticles);
// get article by writer - this needs to come before /:id route
ArticleRouter.get("/author", getArticlesByWriterId);
// get single article route
ArticleRouter.get("/:id", getArticleById);
// update article
ArticleRouter.put("/:id", updateArticle);
// check slug uniqueness
ArticleRouter.get("/check-slug/:slug", checkSlugUniqueness);

export default ArticleRouter;
