import { GoogleGenAI } from "@google/genai";
import Chatbot from "../models/chatbot.js";

// Controller xử lý Chatbot bằng Gemini
export const chatWithGift = async (req, res) => {
  try {
    const { message } = req.body;
    console.log("Chatbot message received:", message);
    console.log("Gemini API Key present:", !!process.env.GEMINI_API_KEY);

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập tin nhắn",
      });
    }

    // Lấy cấu hình tính cách từ DB
    const config = (await Chatbot.findOne({ isActive: true })) || {
      personality:
        "Bạn là Gift-Con (Một câu bé hài hước, vui nhộn và ngây thơ).",
      maxTokens: 200,
    };

    console.log("Using MaxTokens:", config.maxTokens);

    let knowledgeBase = "";
    if (config.suggestedQuestions && config.suggestedQuestions.length > 0) {
      const facts = config.suggestedQuestions
        .filter((q) => q.response)
        .map((q) => `- Nếu được hỏi về "${q.text}": ${q.response}`)
        .join("\n");

      if (facts) {
        knowledgeBase = `\n\n[DỮ LIỆU KIẾN THỨC CỦA BẠN]:\n${facts}\n\n(Lưu ý: Nếu người dùng hỏi bất cứ điều gì LIÊN QUAN đến các thông tin trên, hãy ưu tiên sử dụng dữ liệu này để trả lời một cách tự nhiên nhất).`;
      }
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    // Kiểm tra xem đây có phải là câu hỏi gợi ý không
    const suggestedQuestion = config.suggestedQuestions?.find(
      (q) =>
        typeof q.text === "string" &&
        q.text.toLowerCase() === message.toLowerCase(),
    );
    const isSuggested = !!suggestedQuestion;

    // Danh sách các model Gemma 3 để fallback
    const gemmaModels = isSuggested
      ? ["gemma-3-4b-it", "gemma-3-12b-it", "gemma-3-27b-it", "gemma-3n-e4b-it"]
      : [
          "gemma-3-27b-it",
          "gemma-3-12b-it",
          "gemma-3-4b-it",
          "gemma-3n-e4b-it",
        ];

    let responseText = "";
    let usedModel = "";
    let lastError = null;

    // Thử từng model trong danh sách
    for (const modelName of gemmaModels) {
      try {
        const isSmallModel =
          modelName.includes("4b") ||
          modelName.includes("2b") ||
          modelName.includes("1b");
        const temperature = isSmallModel ? 0.4 : 0.7;

        console.log(
          `Attempting to use model: ${modelName} (isSuggested: ${isSuggested}, Temp: ${temperature})...`,
        );

        let promptText = "";
        if (isSuggested) {
          // Prompt siêu ngắn cho câu hỏi gợi ý để 4B xử lý chuẩn xác
          promptText = `
### ROLE: ${config.personality}
### USER QUESTION: ${message}
### FACT: ${suggestedQuestion.response}
### GUIDELINE: Trả lời dựa trên FACT và ROLE một cách tự nhiên, ngắn gọn.
`.trim();
        } else {
          // Prompt đầy đủ cho chat tự do
          promptText = `
### SYSTEM INSTRUCTIONS
Tính cách và vai trò của bạn: ${config.personality}
Ngôn ngữ phản hồi: Tiếng Việt.

### KNOWLEDGE BASE
${knowledgeBase || "Bạn là một trợ lý thông minh, hãy sử dụng kiến thức chung để trả lời."}

### EXAMPLES (Hãy bắt chước tông giọng này)
Người dùng: "Website này có gì hay ho không?"
Phản hồi: "Các mẫu Website dễ thương, đáng yêu dành cho bạn với nhiều mục dích như kỷ niệm, tỏ tình, chúc mừng sinh nhật, v.v... Tui đảm bảo bạn sẽ tìm được món ưng ý đó nha!"

### USER CONTEXT
Người dùng đang trò chuyện với bạn qua Website Code Dr.Gifter.

### QUESTION
${message}

### RESPONSE GUIDELINES
- Trả lời ngắn gọn, súc tích (dưới 100 từ).
- Tuyệt đối tuân thủ tính cách đã được mô tả ở trên trong mọi câu trả lời.
- Nếu không biết thông tin, hãy trả lời dựa trên tính cách nhân vật.
`.trim();
        }

        const result = await ai.models.generateContent({
          model: modelName,
          contents: promptText,
          safetySettings: [
            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_NONE",
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_NONE",
            },
          ],
          generationConfig: {
            temperature: temperature,
            topP: 0.9,
            maxOutputTokens: config.maxTokens || 200,
          },
        });

        responseText = result.text;
        usedModel = modelName;
        console.log(`Success with model: ${modelName}`);
        break; // Thành công thì thoát vòng lặp
      } catch (error) {
        console.error(`Model ${modelName} failed:`, error.message);
        lastError = error;
        // Tiếp tục vòng lặp sang model tiếp theo
      }
    }

    if (!responseText && lastError) {
      throw lastError; // Nếu tất cả model đều xịt thì quăng lỗi ra ngoài
    }

    // Lấy text trả về an toàn
    const replyText =
      responseText ||
      "Ê...không có nói bậy nha, Tui méc công an á... (Safety Block)";
    console.log(`AI Response (${usedModel}):`, replyText);

    res.json({
      success: true,
      reply: replyText,
    });
  } catch (error) {
    console.error("--- Gemini Error Details ---");
    console.error("Status:", error.status);
    console.error("Message:", error.message);
    console.dir(error, { depth: null });

    // Lấy cấu hình lỗi từ DB
    let config = await Chatbot.findOne({ isActive: true });

    let errorMsg =
      config?.errorMessage ||
      "Gift-Con bị Dr.Gifter chửi vì dám nói chuyện với người lạ. Đợi tui đi xin phép cái nha !";

    if (error.status === 429) {
      errorMsg =
        config?.rateLimitMessage ||
        "Thôi đủ rổi, Gift-Con mệt lắm rồi, để tui bổ sung năng lượng cho não của tui cái đã!";
    } else if (error.status === 404) {
      errorMsg =
        config?.modelNotFoundMessage ||
        "Bạn nói gì vậy? Gift-Con không hiểu lắm, không biết nữa, không có nhớ...!";
    } else if (
      error.message?.includes("SAFETY") ||
      error.message?.includes("blocked")
    ) {
      errorMsg = "Ê...không có nói bậy nha, Tui méc công an á...";
    }

    res.status(500).json({
      success: false,
      message: errorMsg,
      error: error.message,
    });
  }
};

export const getChatConfig = async (req, res) => {
  try {
    let config = await Chatbot.findOne({ isActive: true });

    if (!config) {
      // Tạo default nếu chưa có
      config = await Chatbot.create({
        botName: "Gift-Con",
        personality: "Bạn là Gift-Con.",
        welcomeMessage:
          "Chào bạn! Tui là Gift-Con đây. Chào mừng bạn đến với kho Website đáng yêu của Dr.Gifter! Bạn cần tui giúp gì không nè?",
        suggestedQuestions: [
          {
            text: "Website này có gì hay ho không?",
            label: "Khám phá Website",
            response:
              "Các mẫu Website dễ thương, đáng yêu dành cho bạn với nhiều mục dích như kỷ niệm, tỏ tình, chúc mừng sinh nhật, v.v... Tui đảm bảo bạn sẽ tìm được món ưng ý đó nha!",
          },
        ],
        errorMessage:
          "Gift-Con bị Dr.Gifter chửi vì dám nói chuyện với người lạ. Đợi tui đi xin phép cái nha !",
        rateLimitMessage:
          "Thôi đủ rổi, Gift-Con mệt lắm rồi, để tui bổ sung năng lượng cho não của tui cái đã!",
        modelNotFoundMessage:
          "Bạn nói gì vậy? Gift-Con không hiểu lắm, không biết nữa, không có nhớ...!",
      });
    }

    res.json({
      success: true,
      data: config,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Không thể lấy cấu hình chatbot",
      error: error.message,
    });
  }
};

export const updateChatConfig = async (req, res) => {
  try {
    const configData = req.body;
    const config = await Chatbot.findOneAndUpdate(
      { isActive: true },
      { ...configData, updatedAt: Date.now() },
      { new: true, upsert: true },
    );

    res.json({
      success: true,
      message: "Cập nhật cấu hình chatbot thành công!",
      data: config,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi cập nhật cấu hình",
      error: error.message,
    });
  }
};
