import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Key, ExternalLink, Check } from 'lucide-react';
import { useApiKey } from '@/hooks/useApiKey';
import { toast } from 'sonner';

export default function ApiKeyInput() {
  const { apiKey, setApiKey, clearApiKey } = useApiKey();
  const [inputValue, setInputValue] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isEditing, setIsEditing] = useState(!apiKey);

  const handleSave = () => {
    if (!inputValue.trim()) {
      toast.error('Please enter an API key');
      return;
    }

    if (!inputValue.startsWith('sk-ant-')) {
      toast.error('Invalid API key format. Anthropic keys start with "sk-ant-"');
      return;
    }

    setApiKey(inputValue.trim());
    setIsEditing(false);
    toast.success('API key saved successfully');
  };

  const handleEdit = () => {
    setInputValue(apiKey || '');
    setIsEditing(true);
  };

  const handleClear = () => {
    clearApiKey();
    setInputValue('');
    setIsEditing(true);
    toast.success('API key cleared');
  };

  if (apiKey && !isEditing) {
    return (
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Check className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm">API Key Configured</p>
                <p className="text-xs text-muted-foreground">
                  {showKey ? apiKey : `${apiKey.substring(0, 12)}...${apiKey.substring(apiKey.length - 4)}`}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowKey(!showKey)}
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
              <Button variant="ghost" size="sm" onClick={handleEdit}>
                Edit
              </Button>
              <Button variant="ghost" size="sm" onClick={handleClear}>
                Clear
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-primary/30 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="w-5 h-5 text-primary" />
          Anthropic API Key Required
        </CardTitle>
        <CardDescription>
          Enter your Anthropic API key to enable Biblical content analysis.{' '}
          <a
            href="https://console.anthropic.com/settings/keys"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline inline-flex items-center gap-1"
          >
            Get your API key here
            <ExternalLink className="w-3 h-3" />
          </a>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="api-key">API Key</Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                id="api-key"
                type={showKey ? 'text' : 'password'}
                placeholder="sk-ant-..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                className="pr-10"
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                onClick={() => setShowKey(!showKey)}
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
            <Button onClick={handleSave} disabled={!inputValue.trim()}>
              Save
            </Button>
          </div>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 text-sm space-y-2">
          <p className="font-semibold text-xs uppercase tracking-wide text-muted-foreground">
            Security Note
          </p>
          <p className="text-muted-foreground">
            Your API key is stored locally in your browser and never sent to our servers. 
            It's only used to communicate directly with Anthropic's Claude API.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
