import { Router } from "express";
import { upload } from "../configs/cloudinary.js";
import {
  createEvent,
  updateEvent,
  getAllEvents,
  getEventById,
  getMyEvents,
  deleteEvent,
} from "../controllers/event.controller.js";
import { protect, verifyOrganizer } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", getAllEvents);
router.get("/mine", protect, verifyOrganizer, getMyEvents);
router.get("/:id", getEventById);

router.post(
  "/",
  protect,
  verifyOrganizer,
  upload.single("coverImage"),
  createEvent,
);
router.put(
  "/:id",
  protect,
  verifyOrganizer,
  upload.single("coverImage"),
  updateEvent,
);
router.delete("/:id", protect, verifyOrganizer, deleteEvent);

export default router;
