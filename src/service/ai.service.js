const { GoogleGenAI } =require("@google/genai");

const ai = new GoogleGenAI({});

async function generateResponse(prompt) {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt,
  });

  console.log(response.text);
  return response.text;
}

module.exports=generateResponse;