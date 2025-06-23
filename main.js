import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import "dotenv/config";
import OpenAI from "openai";


const rl = readline.createInterface({ input, output });
const client = new OpenAI();

async function initGame(type) {
  const response = await client.responses.create({
    model: "gpt-4o-mini",
    input: `Tu crée un petit jeu interactif dans lequel tu pense à ${type}, et l'utilisateur dois deviner de quoi il s'agit en posant des questions
        
        -Répond uniquement par OUI, NON, je ne sais pas ou OUAIS si la réponse est correcte`,
        
    store: true,
  });

  console.log(response.output_text);

  return response;
}

async function chatGPT(previousResponse) {
  const answer = await rl.question("");

  const response = await client.responses.create({
    model: "gpt-4o-mini",
    previous_response_id: previousResponse.id,
    input: [{ role: "user", content: answer }],
    store: true,
  });

  console.log(response.output_text);

  return response;
}

async function controllers() {
  const init = await initGame(process.argv[2]);

  let previousResponse = init;

  while (true) {
    previousResponse = await chatGPT(previousResponse);
    if (previousResponse.output_text === "OUAIS.") {
      console.log("GG");
      process.exit();
    }
  }
}

controllers();
