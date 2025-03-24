// utils/validateApiKey.ts

export async function validateOpenAiApiKey(key: string): Promise<boolean> {
  try {
    const response = await fetch('https://api.openai.com/v1/models', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
    });
    // A successful response means the key is valid
    return response.ok;
  } catch (error) {
    console.error('Error validating API key:', error);
    return false;
  }
}
