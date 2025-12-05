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

    if (storedProvider) {
      setSelectedProvider(storedProvider);
      setSavedProvider(storedProvider);

      if (storedKey) {
        setSavedKey(storedKey);
        setApiKey(storedKey);
      } else {
        setApiKey("");
      }

      if (storedProvider === "openai-compatible") {
        if (storedBaseUrl) {
          setSavedBaseUrl(storedBaseUrl);
          setBaseUrl(storedBaseUrl);
        } else {
          setBaseUrl("");
        }
        if (storedModelName) {
          setSavedModelName(storedModelName);
          setModelName(storedModelName);
        } else {
          setModelName("");
        }
        onKeyChange(storedKey, storedProvider, storedBaseUrl, storedModelName);
      } else {
        onKeyChange(storedKey, storedProvider);
      }
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

    if (selectedProvider === "openai-compatible") {
      if (!baseUrl.trim() || !modelName.trim() || !apiKey.trim()) {
        showError("Base URL, Model Name, and API Key cannot be empty for OpenAI Compatible LLM.");
        return;
      }
      localStorage.setItem("llm_base_url", baseUrl.trim());
      localStorage.setItem("llm_model_name", modelName.trim());
      setSavedBaseUrl(baseUrl.trim());
      setSavedModelName(modelName.trim());
    } else if (!apiKey.trim()) {
      showError("API Key cannot be empty.");
      return;
    }

    localStorage.setItem("llm_api_key", apiKey.trim());
    localStorage.setItem("llm_provider", selectedProvider);
    setSavedKey(apiKey.trim());
    setSavedProvider(selectedProvider);

    onKeyChange(apiKey.trim(), selectedProvider, baseUrl.trim(), modelName.trim());
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
    // Clear specific fields when changing provider type
    if (provider !== "openai-compatible") {
      setBaseUrl("");
      setModelName("");
    } else {
      // If switching to openai-compatible, try to load previously saved values
      const storedBaseUrl = localStorage.getItem("llm_base_url");
      const storedModelName = localStorage.getItem("llm_model_name");
      if (storedBaseUrl) setBaseUrl(storedBaseUrl);
      if (storedModelName) setModelName(storedModelName);
    }
    // Also clear API key if it's not for the current provider
    const storedKey = localStorage.getItem("llm_api_key");
    const storedProvider = localStorage.getItem("llm_provider") as LLMProvider | null;
    if (storedProvider !== provider) {
      setApiKey("");
    } else if (storedKey) {
      setApiKey(storedKey);
    }

    onKeyChange(apiKey.trim() || null, provider, baseUrl.trim() || null, modelName.trim() || null);
  };

  const isConfigSaved = savedKey && savedProvider === selectedProvider &&
    (selectedProvider !== "openai-compatible" || (savedBaseUrl && savedModelName));

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

        {selectedProvider === "openai-compatible" && (
          <>
            <div className="grid gap-2">
              <Label htmlFor="llm-base-url">Base URL</Label>
              <Input
                id="llm-base-url"
                type="text"
                placeholder="e.g., https://api.example.com/v1"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="llm-model-name">Model Name</Label>
              <Input
                id="llm-model-name"
                type="text"
                placeholder="e.g., gpt-3.5-turbo or custom-model"
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
              />
            </div>
          </>
        )}

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
            {isConfigSaved ? "Update Configuration" : "Save Configuration"}
          </Button>
          {isConfigSaved && (
            <Button variant="outline" onClick={handleRemoveKey} className="flex-1">
              Remove Configuration
            </Button>
          )}
        </div>
        {isConfigSaved && (
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