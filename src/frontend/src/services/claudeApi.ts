import type { AnalysisResult } from '@/types/analysis';

const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';
const CLAUDE_MODEL = 'claude-3-5-sonnet-20241022';

export async function analyzeContent(
  videoDescription: string,
  apiKey: string
): Promise<AnalysisResult> {
  const prompt = `You are a Biblical scholar analyzing video content. Analyze the following video description and provide:

1. A rating: "green" (aligns with Biblical values), "yellow" (neutral/needs discernment), or "red" (conflicts with Biblical principles)
2. A one-sentence explanation of why it received this rating
3. A relevant Bible verse from the NIV translation with its reference

Consider Biblical principles like: love, honesty, purity, kindness, generosity, humility vs. greed, violence, deception, immorality, pride.

Video Description:
"${videoDescription}"

Respond in this exact JSON format:
{
  "rating": "green|yellow|red",
  "explanation": "One sentence explanation here",
  "verseReference": "Book Chapter:Verse",
  "verseText": "The actual verse text from NIV"
}`;

  try {
    const response = await fetch(CLAUDE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: CLAUDE_MODEL,
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      if (response.status === 401) {
        throw new Error('Invalid API key. Please check your Anthropic API key.');
      }
      
      throw new Error(
        errorData.error?.message || `API request failed with status ${response.status}`
      );
    }

    const data = await response.json();
    
    if (!data.content || !data.content[0] || !data.content[0].text) {
      throw new Error('Invalid response format from Claude API');
    }

    const responseText = data.content[0].text;
    
    // Extract JSON from the response (Claude might wrap it in markdown code blocks)
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not parse response from Claude API');
    }

    const result = JSON.parse(jsonMatch[0]) as AnalysisResult;

    // Validate the response
    if (!['green', 'yellow', 'red'].includes(result.rating)) {
      throw new Error('Invalid rating in response');
    }

    if (!result.explanation || !result.verseReference || !result.verseText) {
      throw new Error('Incomplete response from Claude API');
    }

    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred while analyzing content');
  }
}
