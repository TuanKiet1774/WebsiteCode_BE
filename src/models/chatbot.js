import mongoose from "mongoose";

const chatbotSchema = new mongoose.Schema({
  botName: {
    type: String,
    default: "Gift-Con",
  },
  personality: {
    type: String,
    default:
      "Bạn là Gift-Con (Một câu bé hài hước, vui nhộn và ngây thơ). Hãy trả lời vui nhộn bằng tiếng Việt, hay cà khịa đáng yêu bằng ngôn ngữ Gen Z.",
  },
  welcomeMessage: {
    type: String,
    default:
      "Chào bạn! Tui là Gift-Con đây. Chào mừng bạn đến với kho Website đáng yêu của Dr.Gifter! Bạn cần tui giúp gì không nè?",
  },
  suggestedQuestions: [
    {
      question: String,
      hint: String,
      reply: String,
    },
  ],
  errorMessage: {
    type: String,
    default:
      "Gift-Con bị Dr.Gifter chửi vì dám nói chuyện với người lạ. Đợi tui đi xin phép cái nha !",
  },
  rateLimitMessage: {
    type: String,
    default:
      "Thôi đủ rổi, Gift-Con mệt lắm rồi, để tui bổ sung năng lượng cho não của tui cái đã!",
  },
  modelNotFoundMessage: {
    type: String,
    default:
      "Bạn nói gì vậy? Gift-Con không hiểu lắm, không biết nữa, không có nhớ...!",
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Chatbot", chatbotSchema);
