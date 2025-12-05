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
  onKeyChange: (
    key: string | null,
    provider: LLMProvider | null,
    baseUrl?: string | null,
    modelName?: string | null
  ) => void;
}

const LLMAPIKeyInput: React.FC<LLMAPIKeyInputProps> = ({ onKeyChange }) => {
  const [apiKey, setApiKey] = useState<string>("");
  const [baseUrl, setBaseUrl] = useState<string>("");
  const [modelName, setModelName] = useState<string>("");
  const [selectedProvider, setSelectedProvider] = useState<LLMProvider | null>(null);
  const [savedKey, setSavedKey] = useState<string | null>(null);
  const [savedProvider, setSavedProvider] = useState<LLMProvider | null>(null);
  const [savedBaseUrl, setSavedBaseUrl] = useState<string | null>(null);
  const [savedModelName, setSavedModelName] = useState<string | null>(null);

  useEffect(() => {
    const storedKey = localStorage.getItem("llm_api_key");
    const storedProvider = localStorage.getItem("llm_provider") as LLMProvider | null;
    const storedBaseUrl = localStorage.getItem("llm_base_url");
    const storedModelName = localStorage.getItem("llm_model_name");

    setSavedKey(storedKey);
    setSavedProvider(storedProvider);
    setSavedBaseUrl(storedBaseUrl);
    setSavedModelName(storedModelName);

    if (storedProvider) {
      setSelectedProvider(storedProvider);
      if (storedKey) setApiKey(storedKey);
      if (storedProvider === "openai-compatible" || storedProvider === "local") {
        if (storedBaseUrl) setBaseUrl(storedBaseUrl);
        if (storedModelName) setModelName(storedModelName);
      }
      onKeyChange(storedKey, storedProvider, storedBaseUrl, storedModelName);
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

    const requiresBaseUrlAndModel = selectedProvider === "openai-compatible" || selectedProvider === "local";

    if (requiresBaseUrlAndModel) {
      if (!baseUrl.trim() || !modelName.trim()) {
        showError("Base URL and Model Name cannot be empty for this LLM provider.");
        return;
      }
      localStorage.setItem("llm_base_url", baseUrl.trim());
      localStorage.setItem("llm_model_name", modelName.trim());
      setSavedBaseUrl(baseUrl.trim());
      setSavedModelName(modelName.trim());
    } else {
      localStorage.removeItem("llm_base_url");
      localStorage.removeItem("llm_model_name");
      setSavedBaseUrl(null);
      setSavedModelName(null);
    }

    if (apiKey.trim()) {
      localStorage.setItem("llm_api_key", apiKey.trim());
      setSavedKey(apiKey.trim());
    } else {
      // API Key is optional for 'local' if it's just an endpoint
      if (selectedProvider !== "local") {
        showError("API Key cannot be empty for this LLM provider.");
        return;
      }
      localStorage.removeItem("llm_api_key");
      setSavedKey(null);
    }

    localStorage.setItem("llm_provider", selectedProvider);
    setSavedProvider(selectedProvider);

    onKeyChange(apiKey.trim() || null, selectedProvider, baseUrl.trim() || null, modelName.trim() || null);
    showSuccess("LLM Configuration saved successfully!");
  };

  const handleRemoveKey = () => {
    localStorage.removeItem("llm_api_key");
    localStorage.removeItem("llm_provider");
    localStorage.removeItem("llm_base_url");
    localStorage.removeItem("llm_model_name");

    setSavedKey(null);
    setSavedProvider(null);
    setSavedBaseUrl(null);
    setSavedModelName(null);

    setApiKey("");
    setBaseUrl("");
    setModelName("");
    setSelectedProvider("openai"); // Reset to default
    onKeyChange(null, "openai");
    showSuccess("LLM Configuration removed.");
  };

  const handleProviderChange = (value: string) => {
    const provider = value as LLMProvider;
    setSelectedProvider(provider);

    // Clear all fields first to prevent data leakage between providers
    setApiKey("");
    setBaseUrl("");
    setModelName("");

    // Attempt to load saved values for the newly selected provider
    const storedKey = localStorage.getItem("llm_api_key");
    const storedProvider = localStorage.getItem("llm_provider") as LLMProvider | null;
    const storedBaseUrl = localStorage.getItem("llm_base_url");
    const storedModelName = localStorage.getItem("llm_model_name");

    if (storedProvider === provider) {
      if (storedKey) setApiKey(storedKey);
      if (provider === "openai-compatible" || provider === "local") {
        if (storedBaseUrl) setBaseUrl(storedBaseUrl);
        if (storedModelName) setModelName(storedModelName);
      }
    }
    
    onKeyChange(apiKey || null, provider, baseUrl || null, modelName || null);
  };

  const isConfigSaved = savedKey === apiKey && savedProvider === selectedProvider &&
    ((selectedProvider !== "openai-compatible" && selectedProvider !== "local") || (savedBaseUrl === baseUrl && savedModelName === modelName));

  const requiresBaseUrlAndModel = selectedProvider === "openai-compatible" || selectedProvider === "local";

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">LLM API Key Configuration</CardTitle>
        <CardDescription>
          Select your LLM provider and provide the corresponding API key and configuration for SOW analysis.
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

        {requiresBaseUrlAndModel && (
          <>
            <div className="grid gap-2">
              <Label htmlFor="llm-base-url">Base URL</Label>
              <Input
                id="llm-base-url"
                type="text"
                placeholder="e.g., https://api.example.com/v1 or http://localhost:11434/v1"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="llm-model-name">Model Name</Label>
              <Input
                id="llm-model-name"
                type="text"
                placeholder="e.g., gpt-3.5-turbo or llama2"
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
              />
            </div>
          </>
        )}

        <div className="grid gap-2">
          <Label htmlFor="llm-api-key">
            {selectedProvider === "local" ? "API Key (if applicable, leave blank if none)" : "Your LLM API Key"}
          </Label>
          <Input
            id="llm-api-key"
            type="password"
            placeholder={
              selectedProvider === "openai" || selectedProvider === "openai-compatible" ? "sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxx" :
              selectedProvider === "anthropic" ? "sk-ant-xxxxxxxxxxxxxxxxxxxxxxxxxxxx" :
              selectedProvider === "google" ? "AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxxxxx" :
              "Enter API Key (optional)"
            }
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSaveKey} className="flex-1">
            {isConfigSaved ? "Update Configuration" : "Save Configuration"}
          </Button>
          {isConfigSaved && (
            <Button variant="outline" onClick={handleRemoveKey} className="flex-1">
              Remove Configuration
            </Button>
          )}
        </div>
        {savedProvider && (
          <p className="text-sm text-muted-foreground mt-1">
            LLM Configuration for <span className="font-medium text-primary capitalize">{savedProvider}</span> is currently{" "}
            <span className="font-medium text-green-600 dark:text-green-400">set</span>.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default LLMAPIKeyInput;