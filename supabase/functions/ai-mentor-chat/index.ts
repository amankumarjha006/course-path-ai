// Load .env file first
import "jsr:@std/dotenv/load";
import { serve } from "https://deno.land/std@0.203.0/http/server.ts";

serve(async (req) => {
  try {
    const { message } = await req.json();
    const lowerMessage = message.toLowerCase();
    console.log("Generating enhanced response for:", message.substring(0, 50) + "...");

    // --- Career Guidance ---
    if (
      lowerMessage.includes("career") ||
      lowerMessage.includes("job") ||
      lowerMessage.includes("future") ||
      lowerMessage.includes("what should i do")
    ) {
      return new Response(
        `🎯 **Career Guidance - Let's Find Your Perfect Path!**\n\n[... keep your detailed career guidance text here ...]`,
        { headers: { "Content-Type": "text/plain" } },
      );
    }

    // --- Exam Preparation ---
    if (
      lowerMessage.includes("exam") ||
      lowerMessage.includes("jee") ||
      lowerMessage.includes("neet") ||
      lowerMessage.includes("board") ||
      lowerMessage.includes("competitive") ||
      lowerMessage.includes("preparation") ||
      lowerMessage.includes("study")
    ) {
      return new Response(
        `📚 **Exam Success Masterplan - Your Complete Strategy!**\n\n[... keep your detailed exam preparation text here ...]`,
        { headers: { "Content-Type": "text/plain" } },
      );
    }

    // --- Stress & Mental Health ---
    if (
      lowerMessage.includes("stress") ||
      lowerMessage.includes("anxiety") ||
      lowerMessage.includes("pressure") ||
      lowerMessage.includes("worried")
    ) {
      return new Response(
        `🧘 **Stress Management Plan**\n\n[... keep your stress response here ...]`,
        { headers: { "Content-Type": "text/plain" } },
      );
    }

    // --- College / Course Selection ---
    if (
      lowerMessage.includes("college") ||
      lowerMessage.includes("course") ||
      lowerMessage.includes("stream") ||
      lowerMessage.includes("subject")
    ) {
      return new Response(
        `🎓 **Course & College Decision Guide**\n\n[... keep your college response here ...]`,
        { headers: { "Content-Type": "text/plain" } },
      );
    }

    // --- Confusion / Help ---
    if (
      lowerMessage.includes("help") ||
      lowerMessage.includes("confused") ||
      lowerMessage.includes("don't know")
    ) {
      return new Response(
        `🌟 **Don’t worry, I’m here for you!**\n\n[... keep your help response here ...]`,
        { headers: { "Content-Type": "text/plain" } },
      );
    }

    // --- Default Response using VITE_GEN_API_KEY ---
    const apiKey = Deno.env.get("VITE_GEN_API_KEY"); // now loaded from .env
    if (apiKey) {
      try {
        console.log("Falling back to Gemini API using VITE_GEN_API_KEY...");

        const response = await fetch(
          "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              contents: [{ parts: [{ text: message }] }],
            }),
          },
        );

        if (response.ok) {
          const data = await response.json();
          const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (reply) {
            return new Response(reply, { headers: { "Content-Type": "text/plain" } });
          }
        } else {
          console.error(
            "Gemini API response not OK:",
            response.status,
            await response.text(),
          );
        }
      } catch (err) {
        console.error("Gemini API call error:", err);
      }
    }

    // --- Final Static Fallback ---
    return new Response(
      `🌟 **Hello! I’m your AI Mentor & Career Guide** 🌟  

I’m here to provide **personalized support** for your education, career, and life journey.  

📚 Academics → Study timetables, resources, exam hacks  
🎯 Career → Streams, colleges, scholarships, jobs  
🧠 Mindset → Motivation, stress management, confidence  
💼 Skills → AI, coding, design, business, communication  

✅ Tell me about yourself (school/college/job, your interests), and I’ll create a **step-by-step plan** just for you 🚀`,
      { headers: { "Content-Type": "text/plain" } },
    );
  } catch (err) {
    console.error("Function error:", err);
    return new Response(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
    });
  }
});
