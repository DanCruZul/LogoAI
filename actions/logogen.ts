"use server";

import { HfInference } from "@huggingface/inference";

const hf = new HfInference(process.env.HUGGINGFACE_TOKEN);

export async function generateLogo(prompt: string, name?: string) {
  try {
    console.log(
      "HUGGINGFACE_TOKEN:",
      process.env.HUGGINGFACE_TOKEN ? "Set" : "Not set",
    );

    const randomSeed = Math.floor(Math.random() * 1000000);
    const namePrompt = name
      ? `with the name "${name}" prominently incorporated`
      : "without any text or name";
    const fullPrompt = `Create a professional, high-resolution logo ${namePrompt} based on the following description: ${prompt}. 
    The logo should be clear, scalable, and suitable for various applications including print and digital media. 
    Ensure the design is modern, memorable, and reflects the essence of the brand or concept.
    Use a harmonious color palette that fits the context described, unless specific colors are mentioned in the prompt.
    The logo should look as if it was designed by a senior graphic designer with over 20 years of experience, 
    utilizing the best concepts in design including balance, contrast, emphasis, and unity.
    The output should always resemble a professional logo, not a general illustration.
    Random seed for uniqueness: ${randomSeed}`;

    console.log("Sending request to Hugging Face with prompt:", fullPrompt);

    // Use FLUX.1 [schnell] model for image generation
    const response = await hf.textToImage({
      model: "black-forest-labs/FLUX.1-schnell",
      inputs: fullPrompt,
      options: {
        seed: randomSeed,
        num_inference_steps: 50, // Adjust if necessary for quality
        guidance_scale: 7.5, // Adjust to control creativity vs fidelity
      },
    });

    console.log("Received response from Hugging Face");

    if (response instanceof Blob) {
      const arrayBuffer = await response.arrayBuffer();
      const base64Image = Buffer.from(arrayBuffer).toString("base64");
      return { status: 200, image: base64Image };
    } else {
      throw new Error(`Unexpected response format: ${typeof response}`);
    }
  } catch (error) {
    console.error("Detailed error in generateLogo:", error);

    if (error instanceof Error) {
      if (error.message.includes("Rate limit reached")) {
        console.error("Rate limit error details:", error);
        return {
          status: 429,
          error:
            "Rate limit reached. Please try again later or contact support.",
        };
      }
      return {
        status: 500,
        error: `Failed to generate logo: ${error.message}`,
      };
    } else {
      return { status: 500, error: "Failed to generate logo: Unknown error" };
    }
  }
}
