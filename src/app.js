import express from "express";
import cors from "cors";
import topicRoutes from "./routes/topic.route.js";
import codeRoutes from "./routes/code.route.js";
import tagRoutes from "./routes/tag.route.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("🚀 Code Showcase API is running!");
});


app.use("/api/topics", topicRoutes);
app.use("/api/codes", codeRoutes);
app.use("/api/tags", tagRoutes);

app.use("/api/codes", (req, res, next) => {
  if (!req.query.showUnpublished) {
    req.query.isPublished = true;
  }
  next();
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong" });
});

export default app;
