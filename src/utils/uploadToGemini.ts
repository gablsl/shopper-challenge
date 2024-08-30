import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleAIFileManager } from '@google/generative-ai/server';
import fs from 'fs';
import path from 'path';
import os from 'os';

const apiKey = process.env.GEMINI_API_KEY as string;
const genAI = new GoogleGenerativeAI(apiKey);
const fileManager = new GoogleAIFileManager(apiKey);

export async function uploadToGemini(imageUrl: string) {
    try {
        const base64Data = imageUrl.replace(/^data:image\/\w+;base64,/, '');

        const imageBuffer = Buffer.from(base64Data, 'base64');

        const tempFilePath = path.join(os.tmpdir(), 'temp_image.jpg');
        fs.writeFileSync(tempFilePath, imageBuffer);

        const uploadResult = await fileManager.uploadFile(tempFilePath, {
            mimeType: 'image/jpeg',
            displayName: 'temp_image.jpg',
        });

        const file = uploadResult.file;

        const model = genAI.getGenerativeModel({
            model: 'gemini-1.5-flash',
        });

        const generationConfig = {
            temperature: 0.9,
            topP: 0.95,
            topK: 64,
            maxOutputTokens: 1024,
            responseMimeType: 'text/plain',
        };

        const chatSession = model.startChat({
            generationConfig,
            history: [
                {
                    role: 'user',
                    parts: [
                        {
                            fileData: {
                                mimeType: file.mimeType,
                                fileUri: file.uri,
                            },
                        },
                        {
                            text: 'Pegue o valor da medição da imagem e me retorne um Int com todas as casas decimais.',
                        },
                    ],
                },
            ],
        });

        const result = await chatSession.sendMessage(
            'Por favor, extraia o valor da medição da imagem fornecida e me retorne um número com todas as casas decimais. Ignore o texto quero somente um Int'
        );
        const measurementText = result.response.text().trim();

        return { tempFilePath, measurementText };
    } catch (error) {
        throw new Error('Houve um erro com o Gemini AI, tente novamente');
    }
}
