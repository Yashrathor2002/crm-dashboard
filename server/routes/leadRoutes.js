import express from "express";
import {
  getLeads,
  createLead,
  updateLead,
  deleteLead,
  getLead,
} from "../controllers/leadController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();
router.use(protect);

router.route("/").get(getLeads).post(createLead);
router.route("/:id").get(getLead).put(updateLead).delete(deleteLead);

export default router;
