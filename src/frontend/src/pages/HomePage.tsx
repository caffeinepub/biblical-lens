import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Sparkles, RotateCcw } from 'lucide-react';
import ApiKeyInput from '@/components/ApiKeyInput';
import { useApiKey } from '@/hooks/useApiKey';
import { analyzeContent } from '@/services/claudeApi';
import { toast } from 'sonner';
import RatingCircle from '@/components/RatingCircle';
import BibleVerse from '@/components/BibleVerse';
import type { AnalysisResult } from '@/types/analysis';

export default function HomePage() {
  const [videoDescription, setVideoDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const { apiKey } = useApiKey();

  const handleAnalyze = async () => {
    if (!apiKey) {
      toast.error('Please enter your Anthropic API key first');
      return;
    }

    if (!videoDescription.trim()) {
      toast.error('Please enter a video description');
      return;
    }

    setIsAnalyzing(true);

    try {
      const result = await analyzeContent(videoDescription, apiKey);
      setAnalysisResult(result);
      toast.success('Analysis complete!');
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to analyze content. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleTryAnother = () => {
    setVideoDescription('');
    setAnalysisResult(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleAnalyze();
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-3">
        <h2 className="text-4xl font-bold tracking-tight">
          Analyze Content Through a Biblical Lens
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Paste a video title and description to receive Biblical analysis with a color-coded rating and relevant Scripture verse.
        </p>
      </div>

      <ApiKeyInput />

      <Card className="border-2 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Video Description
          </CardTitle>
          <CardDescription>
            Enter or paste the video title and description you'd like to analyze
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="video-description">Description</Label>
            <Textarea
              id="video-description"
              placeholder="Example: Video about giving money to homeless people and showing kindness to strangers..."
              value={videoDescription}
              onChange={(e) => setVideoDescription(e.target.value)}
              onKeyDown={handleKeyPress}
              rows={8}
              className="resize-none text-base"
              disabled={isAnalyzing}
            />
            <p className="text-xs text-muted-foreground">
              Press Cmd/Ctrl + Enter to analyze quickly
            </p>
          </div>

          <Button
            onClick={handleAnalyze}
            disabled={!videoDescription.trim() || isAnalyzing || !apiKey}
            size="lg"
            className="w-full text-base font-semibold"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Analyze Content
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results Section - Slides down when available */}
      {analysisResult && (
        <div className="space-y-6 animate-in slide-in-from-top-4 duration-500">
          {/* Rating Circle */}
          <div className="flex justify-center py-6">
            <RatingCircle rating={analysisResult.rating} />
          </div>

          {/* Explanation Card */}
          <Card className="border-2 shadow-md">
            <CardHeader>
              <CardTitle className="text-xl">Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base leading-relaxed">{analysisResult.explanation}</p>
            </CardContent>
          </Card>

          {/* Bible Verse Box */}
          <Card className="border-2 shadow-md bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-xl text-primary">Scripture Reference</CardTitle>
            </CardHeader>
            <CardContent>
              <BibleVerse 
                reference={analysisResult.verseReference} 
                text={analysisResult.verseText} 
              />
            </CardContent>
          </Card>

          {/* Try Another Button */}
          <div className="flex justify-center pt-4">
            <Button
              onClick={handleTryAnother}
              variant="outline"
              size="lg"
              className="text-base font-semibold"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Try Another
            </Button>
          </div>
        </div>
      )}

      {/* Rating System Info - Only show when no results */}
      {!analysisResult && (
        <div className="bg-muted/30 rounded-lg p-6 border border-border/50">
          <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">
            Rating System
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-rating-green flex-shrink-0" />
              <p className="text-sm">
                <span className="font-semibold text-foreground">Green:</span> Aligns with Biblical values
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-rating-yellow flex-shrink-0" />
              <p className="text-sm">
                <span className="font-semibold text-foreground">Yellow:</span> Neutral or needs discernment
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-rating-red flex-shrink-0" />
              <p className="text-sm">
                <span className="font-semibold text-foreground">Red:</span> Conflicts with Biblical principles
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
