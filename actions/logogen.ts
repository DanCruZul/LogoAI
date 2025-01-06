"use server";

import { HfInference } from "@huggingface/inference";
import { saveLogo } from "./logo-actions";
import { ActionState } from "@/types/action-types";

const hf = new HfInference(process.env.HUGGINGFACE_TOKEN);

export async function generateLogo(
  prompt: string,
  name?: string,
): Promise<ActionState<{ image: string; url: string; id: number }>> {
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

    const response = await hf.textToImage({
      model: "black-forest-labs/FLUX.1-schnell",
      inputs: fullPrompt,
    });

    console.log("Received response from Hugging Face");

    if (response instanceof Blob) {
      const arrayBuffer = await response.arrayBuffer();
      const base64Image = Buffer.from(arrayBuffer).toString("base64");

      // Save the generated logo
      const saveResult = await saveLogo({
        imageData: base64Image,
        prompt: fullPrompt,
      });

      if (saveResult.status === "success") {
        console.log("Logo saved successfully");
        return {
          status: "success",
          data: {
            image: base64Image,
            url: saveResult.data.url,
            id: saveResult.data.id,
          },
        };
      } else {
        console.error("Failed to save logo:", saveResult.message);
        return { status: "error", message: "Failed to save logo" };
      }
    } else {
      throw new Error(`Unexpected response format: ${typeof response}`);
    }
  } catch (error) {
    console.error("Detailed error in generateLogo:", error);
    if (error instanceof Error) {
      if (error.message.includes("Rate limit reached")) {
        console.error("Rate limit error details:", error);
        return {
          status: "error",
          message:
            "Rate limit reached. Please try again later or contact support.",
        };
      }
      return {
        status: "error",
        message: `Failed to generate logo: ${error.message}`,
      };
    } else {
      return {
        status: "error",
        message: "Failed to generate logo: Unknown error",
      };
    }
  }
}
