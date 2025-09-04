import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import path from "path";

import apiRouter from "./routes";
import { notFound, errorHandler } from "./misc/errors";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "2mb" }));
// Request logger (morgan) + explicit start/finish logs with duration
app.use(morgan(":method :url :status :res[content-length] - :response-time ms"));
app.use((req: any, res: any, next: any) => {
  const startedAt = Date.now();
  const url = req.originalUrl || req.url;
  console.log(`[req] ${req.method} ${url}`);
  res.on("finish", () => {
    const duration = Date.now() - startedAt;
    const len = res.getHeader("content-length") || 0;
    console.log(`[res] ${req.method} ${url} → ${res.statusCode} ${len}b ${duration}ms`);
  });
  next();
});

// Custom concise log of headers for debugging (toggle via env)
if (process.env.LOG_HEADERS === "1") {
  app.use((req: any, _res: any, next: any) => {
    console.log(`[req] ${req.method} ${req.originalUrl} headers=`, req.headers);
    next();
  });
}

app.use("/api", apiRouter);
app.use("/downloads", express.static(path.join(__dirname, "../downloads")));

app.use(notFound);
app.use(errorHandler);

export default app;
