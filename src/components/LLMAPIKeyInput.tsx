"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { showSuccess, showError } from "@/utils/toast";

interface LLMAPIKeyInputProps {
  onKeyChange: (key: string | null) => void;
}

const LLMAPIKeyInput: React.FC<LLMAPIKeyInputProps> = ({ onKeyChange }) => {
  const [apiKey, setApiKey] = useState<string>("");
  const [savedKey, setSavedKey] = useState<string | null>(null);

  useEffect(() => {
    const storedKey = localStorage.getItem("llm_api_key");
    if (storedKey) {
      setSavedKey(storedKey);
      onKeyChange(storedKey);
    }
  }, [onKeyChange]);

  const handleSaveKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem("llm_api_key", apiKey.trim());
      setSavedKey(apiKey.trim());
      onKeyChange(apiKey.trim());
      showSuccess("LLM API Key saved successfully!");
    } else {
      showError("API Key cannot be empty.");
    }
  };

  const handleRemoveKey = () => {
    localStorage.removeItem("llm_api_key");
    setSavedKey(null);
    setApiKey("");
    onKeyChange(null);
    showSuccess("LLM API Key removed.");
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">LLM API Key</CardTitle>
        <CardDescription>
          Provide your API key for the AI model to perform SOW analysis.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="llm-api-key">Your LLM API Key</Label>
          <Input
            id="llm-api-key"
            type="password"
            placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSaveKey} className="flex-1">
            {savedKey ? "Update Key" : "Save Key"}
          </Button>
          {savedKey && (
            <Button variant="outline" onClick={handleRemoveKey} className="flex-1">
              Remove Key
            </Button>
          )}
        </div>
        {savedKey && (
          <p className="text-sm text-muted-foreground mt-1">
            API Key is currently <span className="font-medium text-green-600 dark:text-green-400">set</span>.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default LLMAPIKeyInput;