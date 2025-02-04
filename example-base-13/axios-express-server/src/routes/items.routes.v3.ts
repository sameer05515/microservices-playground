import express from "express";
import { getItemsFromDB, addItemToDB } from "../controllers/items.controller.v3";

const router = express.Router();

// Version 1 (Hardcoded Data)
// router.get("/items", getItems);

// Version 2 (MongoDB)
router.get("/items", getItemsFromDB);
router.post("/items", addItemToDB);

export default router;
