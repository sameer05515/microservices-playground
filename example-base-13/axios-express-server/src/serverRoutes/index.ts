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

const app= express.Router();

// Routes
app.use("/api/v1", serverRoutesV1);
/** v2 version was only rewrite of v1 by seggregating code into multple files, hence separate route not needed*/
app.use("/api/v2", serverRoutesV1);

app.use("/api/v3", itemsRoutesV3);
app.use("/api/v3", taskRoutesV3); // All task-related routes will be prefixed with /api/v3

app.use("/api/v4", serverRoutesV4);

app.use("/api/v5", serverRoutesV5);

app.use("/api/v6", serverRoutesV6);

app.use("/api/v7", serverRoutesV7);

app.use("/api/v8", serverRoutesV8);

app.use("/api/v9", serverRoutesV9);

app.use("/api/v10", serverRoutesV10);

app.use("/api/v11", serverRoutesV11);

// Add this line before `app.use(notFoundHandler)`
app.use("/api/v12", serverRoutesV12);

app.use("/api/v13", serverRoutesV13);

export default app;