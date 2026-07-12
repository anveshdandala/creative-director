import { Router } from "express";

import {authenticate} from "../middlewares/auth.middleware.js"
import { syncUser } from "../controllers/auth.controller.js";
import { generateGuide } from "../controllers/generate.controller.js";
import { validateDraft } from "../controllers/validate.controller.js";
import getHistory from "../controllers/history.controller.js";

const router = Router();

router.post("/auth/sync", syncUser);
router.post("/guide", authenticate, generateGuide);
router.post("/validate", authenticate, validateDraft);
router.get('/history', authenticate, getHistory);


export default router;
