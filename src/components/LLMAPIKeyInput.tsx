"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { showSuccess, showError } from "@/utils/toast";

// Define possible LLM providers
type LLMProvider = "openai" | "anthropic" | "google" | "local" | "openai-compatible";

interface LLMAPIKeyInputProps {
  onKeyChange: (key: string | null, provider: LLMProvider | null) => void;
}

const LLMAPIKeyInput: React.FC<LLMAPIKeyInputProps> = ({ onKeyChange }) => {
  const [apiKey, setApiKey] = useState<string>("");
  const [selectedProvider, setSelectedProvider] = useState<LLMProvider | null>(null);
  const [savedKey, setSavedKey] = useState<string | null>(null);
  const [savedProvider, setSavedProvider] = useState<LLMProvider | null>(null);

  useEffect(() => {
    const storedKey = localStorage.getItem("llm_api_key");
    const storedProvider = localStorage.getItem("llm_provider") as LLMProvider | null;

    if (storedKey && storedProvider) {
      setSavedKey(storedKey);
      setSavedProvider(storedProvider);
      setApiKey(storedKey); // Pre-fill input with saved key
      setSelectedProvider(storedProvider); // Set selected provider in dropdown
      onKeyChange(storedKey, storedProvider);
    } else if (storedProvider) {
      // If only provider is saved, set it
      setSelectedProvider(storedProvider);
      onKeyChange(null, storedProvider);
    } else {
      // Default to OpenAI if nothing is saved
      setSelectedProvider("openai");
      onKeyChange(null, "openai");
    }
  }, [onKeyChange]);

  const handleSaveKey = () => {
    if (!selectedProvider) {
      showError("Please select an LLM provider.");
      return;
    }

    if (apiKey.trim()) {
      localStorage.setItem("llm_api_key", apiKey.trim());
      localStorage.setItem("llm_provider", selectedProvider);
      setSavedKey(apiKey.trim());
      setSavedProvider(selectedProvider);
      onKeyChange(apiKey.trim(), selectedProvider);
      showSuccess("LLM API Key and Provider saved successfully!");
    } else {
      showError("API Key cannot be empty.");
    }
  };

  const handleRemoveKey = () => {
    localStorage.removeItem("llm_api_key");
    localStorage.removeItem("llm_provider");
    setSavedKey(null);
    setSavedProvider(null);
    setApiKey("");
    setSelectedProvider("openai"); // Reset to default
    onKeyChange(null, "openai");
    showSuccess("LLM API Key and Provider removed.");
  };

  const handleProviderChange = (value: string) => {
    const provider = value as LLMProvider;
    setSelectedProvider(provider);
    // If a key is already saved for this provider, pre-fill it (optional, for now we clear)
    // For simplicity, we'll just update the parent with the new provider selection
    onKeyChange(apiKey.trim() || null, provider);
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">LLM API Key Configuration</CardTitle>
        <CardDescription>
          Select your LLM provider and provide the corresponding API key for SOW analysis.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="llm-provider">LLM Provider</Label>
          <Select value={selectedProvider || "openai"} onValueChange={handleProviderChange}>
            <SelectTrigger id="llm-provider">
              <SelectValue placeholder="Select an LLM provider" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="openai">OpenAI</SelectItem>
              <SelectItem value="openai-compatible">OpenAI Compatible LLM</SelectItem>
              <SelectItem value="anthropic">Anthropic</SelectItem>
              <SelectItem value="google">Google Gemini</SelectItem>
              <SelectItem value="local">Local Model (e.g., Ollama, private endpoint)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="llm-api-key">
            {selectedProvider === "local" ? "Local Model Endpoint/Key (if applicable)" : "Your LLM API Key"}
          </Label>
          <Input
            id="llm-api-key"
            type="password"
            placeholder={
              selectedProvider === "openai" || selectedProvider === "openai-compatible" ? "sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxx" :
              selectedProvider === "anthropic" ? "sk-ant-xxxxxxxxxxxxxxxxxxxxxxxxxxxx" :
              selectedProvider === "google" ? "AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxxxxx" :
              "Enter API Key or Endpoint URL"
            }
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSaveKey} className="flex-1">
            {savedKey && savedProvider === selectedProvider ? "Update Key" : "Save Key"}
          </Button>
          {savedKey && savedProvider === selectedProvider && (
            <Button variant="outline" onClick={handleRemoveKey} className="flex-1">
              Remove Key
            </Button>
          )}
        </div>
        {savedKey && savedProvider === selectedProvider && (
          <p className="text-sm text-muted-foreground mt-1">
            API Key for <span className="font-medium text-primary capitalize">{savedProvider}</span> is currently{" "}
            <span className="font-medium text-green-600 dark:text-green-400">set</span>.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default LLMAPIKeyInput;