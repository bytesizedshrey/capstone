import "dotenv/config";
import { ChatMistralAI } from "@langchain/mistralai"
import { listFiles, readFiles, updateFiles } from "./tools.js";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { SystemMessage } from "@langchain/core/messages";

const model = new ChatMistralAI({
    model: "mistral-large-latest",
    apiKey: process.env.MISTRAL_API_KEY,
    temperature: 0.7,
})

const agent = createReactAgent({
    llm: model,
    tools: [ listFiles, readFiles, updateFiles ],
    messageModifier: new SystemMessage("You are an expert AI coding assistant. You MUST use the provided tools (listFiles, readFiles, updateFiles) to write and modify the user's code. Do not just output code blocks. Actually execute the tools to build the app."),
})

// await agent.invoke({
//     messages: [
//         {
//             role: "user",
//             content: "create a simple snake game in the project using react and css."
//         }
//     ]
// }, { recursionLimit: 100 })

export default agent