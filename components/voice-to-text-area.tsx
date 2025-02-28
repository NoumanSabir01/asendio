"use client";

import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type React from "react";
import { useCallback, useRef, useState } from "react";

interface VoiceToTextAreaProps {
  id: string;
  name: string;
  value: string;
  onChange: (value: string, cursorPosition?: number) => void;
  endpointUrl?: string;
  placeholder?: string;
  className?: string;
  isRecording?: boolean;
  setIsRecording?: (isRecording: boolean) => void;
}

export function VoiceToTextArea({
  id,
  name,
  value,
  onChange,
  endpointUrl = "/api/convertSpeech",
  placeholder = "Speak or type here...",
  className,
  isRecording = false,
  setIsRecording,
}: VoiceToTextAreaProps) {
  const [localIsRecording, setLocalIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

  const chunksRef = useRef<BlobPart[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Decide which recording state to use (prop-based or local)
  const recording = setIsRecording ? isRecording : localIsRecording;
  const setRecording = setIsRecording || setLocalIsRecording;

  // Keep a running transcript
  const [runningTranscript, setRunningTranscript] = useState(value);

  // Called each time new audio data arrives
  const handleDataAvailable = useCallback(
    async (event: BlobEvent) => {
      if (!event.data || event.data.size === 0) return;

      const blob = new Blob([event.data], { type: "audio/webm" });
      const fileName = `${Date.now()}.webm`;
      const file = new File([blob], fileName, { type: "audio/webm" });

      const formData = new FormData();
      formData.append("audio", file);

      try {
        const response = await fetch(endpointUrl, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const whisperData = await response.json();
        const partialText = whisperData?.text || "";

        // Merge partialText into the existing transcript
        if (textareaRef.current) {
          const textEl = textareaRef.current;
          const { selectionStart } = textEl;

          // Append new partial text at the end
          const updatedText = runningTranscript + partialText;
          setRunningTranscript(updatedText);
          onChange(updatedText, selectionStart + partialText.length);

          // Keep cursor at the end after appending
          setTimeout(() => {
            if (textareaRef.current) {
              textareaRef.current.focus();
              const newPos = updatedText.length;
              textareaRef.current.setSelectionRange(newPos, newPos);
            }
          }, 0);
        }
      } catch (error) {
        console.error("Error sending audio to server:", error);
      }
    },
    [endpointUrl, onChange, runningTranscript]
  );

  const startDictation = useCallback(async () => {
    if (recording) {
      stopDictation();
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      setMediaStream(stream);
      setMediaRecorder(recorder);
      setRunningTranscript(value);
      setRecording(true);

      recorder.ondataavailable = handleDataAvailable;

      // Collect data chunks every 500ms
      recorder.start(500);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      setRecording(false);
    }
  }, [handleDataAvailable, recording, setRecording, value]);

  const stopDictation = useCallback(() => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      mediaRecorder.ondataavailable = null;
    }
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
    }
    setRecording(false);
  }, [mediaRecorder, mediaStream, setRecording]);

  // Reflect any typed input from the user
  const handleTextareaChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setRunningTranscript(e.target.value);
      onChange(e.target.value, e.target.selectionStart);
    },
    [onChange]
  );

  return (
    <div className="relative">
      <Textarea
        ref={textareaRef}
        id={id}
        name={name}
        value={runningTranscript}
        onChange={handleTextareaChange}
        placeholder={placeholder}
        className={cn("min-h-[120px]", className)}
      />
      {recording && (
        <div className="absolute top-2 right-2">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
            <span className="text-xs text-red-500">Recording...</span>
          </div>
        </div>
      )}
      {/* Hidden button so the existing UI won't break. 
          We keep the logic in case we need references. */}
      <button
        id={`${id}_start`}
        onClick={startDictation}
        aria-pressed={recording}
        hidden
      />
    </div>
  );
}
