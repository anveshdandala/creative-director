import { Router } from "express";
import { requireAuth } from "@clerk/express";
import { generateGuide } from "../controllers/generate.controller.js";
import { validateDraft } from "../controllers/validate.controller.js";

const router = Router();

router.post("/guide", requireAuth(), generateGuide);
router.post("/validate", requireAuth(), validateDraft);

export default router;
