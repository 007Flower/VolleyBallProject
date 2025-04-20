import express from "express";
import {
    getSetsByGame,
    getSetById,
    createSet,
    updateSet,
    deleteSet
} from "../controllers/setController.js";

const router = express.Router({ mergeParams: true });

router.get("/", getSetsByGame);
router.get("/:id", getSetById);
router.post("/", createSet);
router.post("/:id/update", updateSet);
router.post("/:id/delete", deleteSet);

export default router;
