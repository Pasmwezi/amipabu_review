"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface SOWUploaderProps {
  onFileUpload: (file: File) => void;
  isLoading: boolean;
}

const SOWUploader: React.FC<SOWUploaderProps> = ({ onFileUpload, isLoading }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  const handleSubmit = () => {
    if (selectedFile) {
      onFileUpload(selectedFile);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Upload Statement of Work</CardTitle>
        <CardDescription>
          Upload your SOW document (PDF, DOCX, TXT) for AI analysis.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="sow-file">SOW Document</Label>
          <Input
            id="sow-file"
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            onChange={handleFileChange}
            disabled={isLoading}
          />
          {selectedFile && (
            <p className="text-sm text-muted-foreground mt-1">
              Selected file: <span className="font-medium">{selectedFile.name}</span>
            </p>
          )}
        </div>
        <Button
          type="submit"
          className="w-full"
          onClick={handleSubmit}
          disabled={!selectedFile || isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            "Analyze SOW"
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default SOWUploader;