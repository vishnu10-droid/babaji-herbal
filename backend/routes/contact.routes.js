import Router from "express";
import { createContact, getContact, deleteContact } from "../controller/contactcontroller.js";
import { protect } from "../middleware/auth.middleware.js";
import { admin } from "../middleware/adminMiddleware.js";

const contactRouter = Router();

/* Public - website form */
contactRouter.post("/", createContact);

/* Admin only */
contactRouter.get("/", protect, admin, getContact);
contactRouter.delete("/:id", protect, admin, deleteContact);

export default contactRouter;
