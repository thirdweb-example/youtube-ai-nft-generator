import { NextRequest } from 'next/server';
import { OpenAI } from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
    const { imagePrompt } = await req.json();

    if (!imagePrompt) {
        return new Response(JSON.stringify({ error: "Missing required fields" }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    const prompt = `${imagePrompt}`;

    try {
        const response = await openai.images.generate({
            model: "dall-e-3",
            prompt: prompt,
            n: 1,
            size: "1024x1024"
        });

        if (!response.data) {
            throw new Error("Failed to generate image");
        }

        console.log("Generated image: " + JSON.stringify(response, null, 2));
        console.log("Generated image: " + response.data[0].url);
        console.log("b64Json: " + response.data[0].b64_json);
        return new Response(JSON.stringify({ data: response.data}), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: "Failed to generate image due to internal server error" }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
};
