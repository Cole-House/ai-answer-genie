import Groq from "groq-sdk";

const client = new Groq({
  apiKey: process.env["GROQ_API_KEY"], // This is the default and can be omitted
});

export async function getGroqResponse(message: string) {
  try {
    console.log("Sending message to Groq...");
    const chatCompletion = await client.chat.completions.create({
      messages: [
        // system message sets guidleines for the AI
        { role: "system", content: "You are a helpful research asistant. ypu always cite your sources and base your responses only on the context that you have been provided. Please think step by step about your response " },
        { role: "user", content: message },
      ],
      model: "llama-3.1-8b-instant",
    });
    
    console.log("Received Groq response", chatCompletion);
    return chatCompletion.choices[0].message.content;
  } catch (error) {
    console.error("Error:", error);
    return "An error occurred while processing your request";
  }
}   