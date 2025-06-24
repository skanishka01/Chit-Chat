const Together = require("together-ai");
require('dotenv').config();

const together = new Together({ apiKey: "92645e9ac5bedf0f7b997cf71d48f269a45990e2cc4423a332330be95e058da0" });

const aiChat = async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }
  
  try {
    const response = await together.chat.completions.create({
      messages: [
        {
          role: "user",
          content: message
        }
      ],
      model: "deepseek-ai/DeepSeek-V3"
    });
    
    const aiMessage = response.choices[0].message.content.trim();
    res.json({ aiMessage });
  } catch (error) {
    console.error('Together.ai API error:', error);
    res.status(500).json({ error: 'Failed to get AI response' });
  }
};

module.exports = { aiChat }; 