"use client";

import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AVAILABLE_MODELS, DEFAULT_MODEL } from "@/lib/constants";

interface ModelSelectorProps {
  onModelChange: (modelId: string) => void;
  disabled?: boolean;
  className?: string;
}

const STORAGE_KEY = "chatdgt-selected-model";

export const ModelSelector = ({
  onModelChange,
  disabled = false,
  className = "",
}: ModelSelectorProps) => {
  // State
  const [selectedModel, setSelectedModel] = useState<string>(DEFAULT_MODEL);
  const [isClient, setIsClient] = useState(false);

  // Effects
  useEffect(function initializeClient() {
    setIsClient(true);
  }, []);

  useEffect(
    function loadSelectedModelFromStorage() {
      if (!isClient) return;

      try {
        const storedModel = localStorage.getItem(STORAGE_KEY);
        if (
          storedModel &&
          AVAILABLE_MODELS.some((model) => model.id === storedModel)
        ) {
          setSelectedModel(storedModel);
          onModelChange(storedModel);
        } else {
          // Set default model if none stored or invalid
          setSelectedModel(DEFAULT_MODEL);
          onModelChange(DEFAULT_MODEL);
        }
      } catch (error) {
        console.error("Error loading model from localStorage:", error);
        setSelectedModel(DEFAULT_MODEL);
        onModelChange(DEFAULT_MODEL);
      }
    },
    [isClient, onModelChange]
  );

  // Helpers / Functions
  const handleModelChange = (modelId: string) => {
    if (!isClient) return;

    try {
      setSelectedModel(modelId);
      localStorage.setItem(STORAGE_KEY, modelId);
      onModelChange(modelId);
    } catch (error) {
      console.error("Error saving model to localStorage:", error);
    }
  };

  // Constants
  const currentModel =
    AVAILABLE_MODELS.find((model) => model.id === selectedModel) ||
    AVAILABLE_MODELS[0];

  // Prevent hydration mismatch by not rendering until client-side
  if (!isClient) {
    return (
      <Button
        variant="ghost"
        className={`px-3 text-xs font-medium hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md text-muted-foreground ${className}`}
        disabled={true}
      >
        <span className="mr-1">{DEFAULT_MODEL}</span>
        <ChevronDown className="h-3 w-3" />
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={`px-3 text-xs font-medium hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md text-muted-foreground ${className}`}
          disabled={disabled}
        >
          <span className="mr-1">{currentModel.name}</span>
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        {AVAILABLE_MODELS.map((model) => (
          <DropdownMenuItem
            key={model.id}
            onClick={() => handleModelChange(model.id)}
            className={model.id === selectedModel ? "bg-muted font-medium" : ""}
          >
            {model.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
