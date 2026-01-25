import express from "express";
import cors from "cors";
import topicRoutes from "./routes/topic.route.js";
import codeRoutes from "./routes/code.route.js";
import tagRoutes from "./routes/tag.route.js";
import userRoutes from "./routes/user.route.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import carouselRoutes from "./routes/carousel.route.js";
import chatbotRoutes from "./routes/chatbot.route.js";


const app = express();
app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("🚀 Code Showcase API is running!");
});

app.use("/api/carousels", carouselRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/topics", topicRoutes);
app.use("/api/codes", codeRoutes);
app.use("/api/tags", tagRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chatbot", chatbotRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(400).json({
    message: err.message,
    code: err.code
  });
});


export default app;
