import { Router } from "express";
import agent from "../agents/code.agent.js";

const agentRouter = Router();

agentRouter.post("/invoke", async (req, res) => {
  try {
    const { message, projectId } = req.body;
    
    const response = await agent.invoke({
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
    },
    {
      configurable: {
        projectId
      },
      recursionLimit: 100
    });
    res.json({ response });
  } catch (error) {
    console.error(`Error invoking agent : `, error);
    res.status(500).json({ error: "Failed to invoke agent." });
  }
});

export default agentRouter;
