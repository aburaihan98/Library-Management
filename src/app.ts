import express, { Application, Request, Response } from "express";
import { bookRoutes } from "./app/controllers/book.controller";
import { borrowRoutes } from "./app/controllers/borrow.controller";
import cors from "cors";

const app: Application = express();

// middleware
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use("/", bookRoutes);
app.use("/", borrowRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Library Management app");
});

export default app;
