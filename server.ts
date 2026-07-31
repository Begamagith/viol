import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Helper for GenAI initialization
function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({ apiKey });
}

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "FretMaster Teoria Musical API" });
});

// AI Music Theory Tutor Endpoint for Guitar & Violão
app.post("/api/ai/tutor", async (req, res) => {
  try {
    const { prompt, context, instrument, tuning, topic } = req.body;
    const ai = getGenAI();

    if (!ai) {
      // Fallback response if GEMINI_API_KEY is not set yet in environment
      return res.json({
        success: true,
        isFallback: true,
        response: `**Dica do Professor:** Para utilizar a IA em tempo real, configure sua chave GEMINI_API_KEY nas opções do AI Studio. 

Enquanto isso, aqui está um resumo rápido sobre **${topic || 'Teoria no Violão e Guitarra'}**:
- **O Segredo do Braço:** Lembre-se que as cordas são afinadas em *quintas* (Mi-Lá-Ré-Sol) exceto entre a 3ª e a 2ª corda (Sol-Si), que é uma *terça maior*! Isso altera a simetria visual dos acordes e escalas entre as cordas mais agudas.
- **Dica Prática:** Tente aplicar este conceito na sua rotina diária tocando o arpejo e depois a escala em todo o braço.`
      });
    }

    const systemInstruction = `Você é um Professor Master de Teoria Musical especializado em Violão (acústico) e Guitarra Elétrica, didático, empolgante e extremamente prático.
Seu objetivo é ensinar teoria musical aplicada diretamente ao braço do instrumento (fretboard), conectando conceitos abstratos com visualização prática, trastes, cordas, sistema CAGED, intervalos e sonoridade.
Responda SEMPRE em Português do Brasil (pt-BR).
Formate a resposta com Markdown limpo, usar tópicos claros, exemplos práticos (como notas nas cordas ou numeração de trastes) e dicas para melhorar o treino no violão ou guitarra.
Instrumento atual do usuário: ${instrument === 'violao_nylon' ? 'Violão Nylon' : instrument === 'violao_aco' ? 'Violão Aço' : 'Guitarra Elétrica'}
Afinação: ${tuning || 'Padrão (E-A-D-G-B-E)'}`;

    const fullPrompt = `${context ? `[Contexto do módulo que o aluno está estudando: ${context}]\n` : ''}
Pergunta ou tema solicitado pelo aluno:
"${prompt}"

Por favor, explique com clareza, mostre como visualizar no braço do violão/guitarra, cite os intervalos envolvidos e sugira um exercício prático ou desenho para praticar hoje.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: fullPrompt,
      config: {
        systemInstruction,
        temperature: 0.7,
        maxOutputTokens: 1500,
      },
    });

    return res.json({
      success: true,
      response: response.text || "Não foi possível gerar a resposta no momento.",
    });
  } catch (error: any) {
    console.error("Erro na API Gemini Tutor:", error);
    return res.status(500).json({
      success: false,
      error: "Erro ao consultar o Professor IA. Verifique sua chave de API ou tente novamente em instantes.",
    });
  }
});

// Vite Middleware for development & static file serving for production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor FretMaster rodando na porta ${PORT}`);
  });
}

startServer();
