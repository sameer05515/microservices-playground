import express from 'express';
import itemsRoutesV3 from "../routes/items.routes.v3";
import taskRoutesV3 from "../routes/task.routes.v3";
import serverRoutesV1 from "./v1";
import serverRoutesV10 from "./v10";
import serverRoutesV11 from "./v11";
import serverRoutesV12 from "./v12";
import serverRoutesV13 from "./v13";
import serverRoutesV4 from "./v4";
import serverRoutesV5 from "./v5";
import serverRoutesV6 from "./v6";
import serverRoutesV7 from "./v7";
import serverRoutesV8 from "./v8";
import serverRoutesV9 from "./v9";

const app = express.Router();

/**
 * @swagger
 * /api/v1/items:
 *   get:
 *     summary: Retrieve a list of items (v1)
 *     tags: [Items]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter items by category
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [price]
 *         description: Sort items by price
 *     responses:
 *       200:
 *         description: List of items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   category:
 *                     type: string
 *                   price:
 *                     type: number
 */
app.use("/api/v1", serverRoutesV1);

/** 
 * @swagger
 * /api/v2/items:
 *   get:
 *     summary: Retrieve a list of items (v2, same as v1)
 *     tags: [Items]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter items by category
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [price]
 *         description: Sort items by price
 *     responses:
 *       200:
 *         description: List of items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   category:
 *                     type: string
 *                   price:
 *                     type: number
 */
app.use("/api/v2", serverRoutesV1);

/**
 * @swagger
 * /api/v3/items:
 *   get:
 *     summary: Retrieve list of items (v3)
 *     tags: [Items]
 *     responses:
 *       200:
 *         description: List of items (v3)
 * /api/v3/tasks:
 *   get:
 *     summary: Retrieve list of tasks (v3)
 *     tags: [Tasks]
 *     responses:
 *       200:
 *         description: List of tasks (v3)
 */
app.use("/api/v3", itemsRoutesV3);
app.use("/api/v3", taskRoutesV3); // All task-related routes will be prefixed with /api/v3

/**
 * @swagger
 * /api/v4:
 *   get:
 *     summary: API version 4 root endpoint
 *     tags: [V4]
 *     responses:
 *       200:
 *         description: Successful response
 */
app.use("/api/v4", serverRoutesV4);

/**
 * @swagger
 * /api/v5:
 *   get:
 *     summary: API version 5 root endpoint
 *     tags: [V5]
 *     responses:
 *       200:
 *         description: Successful response
 */
app.use("/api/v5", serverRoutesV5);

/**
 * @swagger
 * /api/v6:
 *   get:
 *     summary: API version 6 root endpoint
 *     tags: [V6]
 *     responses:
 *       200:
 *         description: Successful response
 */
app.use("/api/v6", serverRoutesV6);

/**
 * @swagger
 * /api/v7:
 *   get:
 *     summary: API version 7 root endpoint
 *     tags: [V7]
 *     responses:
 *       200:
 *         description: Successful response
 */
app.use("/api/v7", serverRoutesV7);

/**
 * @swagger
 * /api/v8:
 *   get:
 *     summary: API version 8 root endpoint
 *     tags: [V8]
 *     responses:
 *       200:
 *         description: Successful response
 */
app.use("/api/v8", serverRoutesV8);

/**
 * @swagger
 * /api/v9:
 *   get:
 *     summary: API version 9 root endpoint
 *     tags: [V9]
 *     responses:
 *       200:
 *         description: Successful response
 */
app.use("/api/v9", serverRoutesV9);

/**
 * @swagger
 * /api/v10:
 *   get:
 *     summary: API version 10 root endpoint
 *     tags: [V10]
 *     responses:
 *       200:
 *         description: Successful response
 */
app.use("/api/v10", serverRoutesV10);

/**
 * @swagger
 * /api/v11/auth/login:
 *   post:
 *     summary: Login and receive a JWT token (v11)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful, returns token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *       400:
 *         description: Email is required
 *       401:
 *         description: Unauthorized
 */
app.use("/api/v11", serverRoutesV11);

/**
 * @swagger
 * /api/v12:
 *   get:
 *     summary: API version 12 root endpoint
 *     tags: [V12]
 *     responses:
 *       200:
 *         description: Successful response
 */
app.use("/api/v12", serverRoutesV12);

/**
 * @swagger
 * /api/v13:
 *   get:
 *     summary: API version 13 root endpoint
 *     tags: [V13]
 *     responses:
 *       200:
 *         description: Successful response
 */
app.use("/api/v13", serverRoutesV13);

export default app;