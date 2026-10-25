import { Router } from "express";
import {
  getRegistrationsByUser,
  createRegistration,
  cancelRegistration,
} from "../controllers/registratiton.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", protect, createRegistration);
router.get("/user/:userId", getRegistrationsByUser);
router.delete("/:id", protect, cancelRegistration);

export default router;
