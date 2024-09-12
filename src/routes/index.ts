import express from "express";
import { delete_icon, get_svgs, update_icon } from "../controllers";
import { upload_svgs } from "../controllers";
const router = express.Router();

router.get("/get", get_svgs);
router.post("/post", upload_svgs);
router.patch("/update/:id", update_icon);
router.delete("/delete/:id", delete_icon);

export default router;
