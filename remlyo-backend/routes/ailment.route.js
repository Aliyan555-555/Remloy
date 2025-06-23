import express from "express";
import {
  checkSlugUniqueness,
  createAilment,
  deleteAilment,
  generateSlug,
  getAilment,
  getAilmentBySlug,
  getAilmentsWithCategoriesSorted,
  getAilmentsWithOnlyName,
  getAllAilments,
  updateAilment,
} from "../controllers/ailment.controller.js";
import auth from "../middleware/auth.middleware.js";
import validator from './../validations/validator.js';
import ailmentValidationSchema from './../validations/ailment.validation.js';

const AilmentRouter = express.Router();
// get all ailments base on categories
AilmentRouter.get("/categories",getAilmentsWithCategoriesSorted);
// get ailment with only name 
AilmentRouter.get("/name",getAilmentsWithOnlyName)
// create ailments route
AilmentRouter.post("/", auth,validator(ailmentValidationSchema), createAilment);
// get all ailments route
AilmentRouter.get("/", getAllAilments);
// get ailment by id
AilmentRouter.get("/:id", getAilment);
// update ailment by id
AilmentRouter.put("/:id",auth,updateAilment);
// delete ailment by id
AilmentRouter.delete("/:id", auth, deleteAilment);
// unique generate slug 
AilmentRouter.post("/generate-slug",generateSlug);
// check slug if not unique
AilmentRouter.get("/check-slug/:slug",checkSlugUniqueness);
// get Ailments by slug
AilmentRouter.get("/slug/:slug",getAilmentBySlug);





export default AilmentRouter;
