import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialize GoogleGenAI to handle missing keys gracefully
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
      aiClient = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
  }
  return aiClient;
}

// Full-stack API Route for custom-engineered masterpieces using Gemini API
app.post("/api/masterpiece", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    res.status(400).json({ error: "Action prompt is required" });
    return;
  }

  const client = getGeminiClient();

  if (!client) {
    // Elegant fallback layout block if Gemini API Key isn't configured in Secrets panel yet.
    // This keeps the user preview completely functional!
    console.warn("GEMINI_API_KEY is not defined. Using high-quality offline fallbacks.");
    
    // Customize slightly based on keywords in prompt
    let simulatedTheme = {
      title: "Apollon - Premium",
      subtitle: "Aerospace Dynamics",
      themeName: "Titanium Orbital",
      textColor: "text-blue-100",
      accentColor: "#3b82f6",
      badgeText: "ORBIT VERSION 9.0",
      heroHeadline: "Interactive orbital telemetry and hyper-sonic aerodynamic canvas systems.",
      heroSubheadline: "Constructing luxury payload lifters, thermal telemetry dashboards, and modular launch matrices with precise physical friction calculations.",
      features: [
        { title: "Symmetrical Cores", description: "Bespoke aerospace alignment lattices", icon: "Orbit" },
        { title: "Thermal Grids", description: "Simulates thermal physics at Mach 7 velocity", icon: "Flame" },
        { title: "Absolute telemetry", description: "Sub-nanosecond absolute telemetry tracking", icon: "Cpu" }
      ],
      callToAction: "Initialize Launch"
    };

    if (prompt.toLowerCase().includes("hedge") || prompt.toLowerCase().includes("fund") || prompt.toLowerCase().includes("analytics") || prompt.toLowerCase().includes("financial")) {
      simulatedTheme = {
        title: "Aethel - Core",
        subtitle: "HFT Mechanics",
        themeName: "Holographic Slate",
        textColor: "text-emerald-100",
        accentColor: "#10b981",
        badgeText: "AETHEL SYSTEM 1.2",
        heroHeadline: "Sub-millisecond high-frequency telemetry architectures built for institutional operations.",
        heroSubheadline: "Engineered with strict atomic latency timers, unified canvas analytics, and distributed security grids to track macro assets instantly.",
        features: [
          { title: "Sub-atomic Latency", description: "Synchronized to GPS atomic clocks directly", icon: "Clock" },
          { title: "Canvas Analytics", description: "120 FPS interactive WebGL visualizers", icon: "Workflow" },
          { title: "Durable Ledgers", description: "Encrypted memory-mapped transaction systems", icon: "ShieldAlert" }
        ],
        callToAction: "Request SLA Access"
      };
    }

    res.json({ layout: simulatedTheme });
    return;
  }

  try {
    const promptMessage = `
You are the elite, world-class Lead Creative Director at Aurora Design Studio, where websites cost $100,000+.
Generate an absolute masterpiece visual layout block config based on the user's creative design instruction: "${prompt}".
Refuse generic solutions. Make the copywriting look extremely professional, high-converting, intellectual, authoritative, and sophisticated.
Make sure you write compelling headlines and details.
Choose a beautiful custom neon accent hex code (like '#ea5358', '#3b82f6', '#10b981', '#f7ba2b', '#8b5cf6') that represents the prompt.
Pick 3 compelling structural features. Set 'icon' for each feature to one of these valid Lucide icon string keys: 'Atom', 'Sliders', 'Layers', 'Orbit', 'Cpu', 'Gem', 'Sparkles', 'Workflow', 'HeartPulse', 'Terminal', 'Rocket'.

Response MUST conform to the required JSON schema.
`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: promptMessage,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["title", "subtitle", "themeName", "textColor", "accentColor", "badgeText", "heroHeadline", "heroSubheadline", "features", "callToAction"],
          properties: {
            title: { type: Type.STRING, description: "Brand title" },
            subtitle: { type: Type.STRING, description: "Brand subtitle or category" },
            themeName: { type: Type.STRING, description: "Elegant descriptive theme design name" },
            textColor: { type: Type.STRING, description: "Tailwind text color class, e.g. text-amber-50" },
            accentColor: { type: Type.STRING, description: "Hex code for contrast highlights, e.g. #f7ba2b" },
            badgeText: { type: Type.STRING, description: "Exclusive edition description label" },
            heroHeadline: { type: Type.STRING, description: "Extremely bold, striking title headline" },
            heroSubheadline: { type: Type.STRING, description: "Detailed, rich elegant paragraph text" },
            features: {
              type: Type.ARRAY,
              description: "Array of exactly 3 feature pillars",
              items: {
                type: Type.OBJECT,
                required: ["title", "description", "icon"],
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  icon: { type: Type.STRING, description: "A Lucide icon name string e.g. 'Atom', 'Orbit', 'Cpu', 'Gem'" },
                },
              },
            },
            callToAction: { type: Type.STRING, description: "Action button label text" },
          },
        },
      },
    });

    const textOutput = response.text;
    if (!textOutput) {
      throw new Error("Empty response from generative machine model.");
    }

    const layout = JSON.parse(textOutput.trim());
    res.json({ layout });
  } catch (error: any) {
    console.error("Gemini API call failed:", error);
    res.status(500).json({ error: "Generative assembly failed: " + error.message });
  }
});

// Configure Vite or Static Assets middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve the compiled vite bundle output from dist/
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[AURORA SERVER ACTIVE] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
