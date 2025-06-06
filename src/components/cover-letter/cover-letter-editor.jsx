"use client";

import { useCoverLetter } from "./cover-letter-context";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

export function CoverLetterEditor() {
  const { coverLetter, updateCoverLetter } = useCoverLetter();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(coverLetter.content);

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/cover-letters/${coverLetter.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: editedContent }),
      });

      if (!response.ok) {
        throw new Error("Failed to save cover letter");
      }

      updateCoverLetter({ content: editedContent });
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving cover letter:", error);
    }
  };

  return (
    <div className="p-6">
      {isEditing ? (
        <div className="space-y-4">
          <Textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="min-h-[500px] font-serif text-lg"
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="prose max-w-none">
            <div className="mb-4">
              <h2 className="text-xl font-bold">{coverLetter.userName}</h2>
              {coverLetter.userEmail && (
                <p className="text-gray-600">{coverLetter.userEmail}</p>
              )}
            </div>

            <div className="mb-4">
              <p className="font-bold">
                {coverLetter.companyName && `${coverLetter.companyName}`}
              </p>
            </div>

            <div className="mb-6">
              <p className="font-bold">Re: {coverLetter.jobTitle}</p>
            </div>

            <div
              className="whitespace-pre-wrap leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: coverLetter.content.replace(/\n/g, "<br>"),
              }}
            />
          </div>
          <div className="flex justify-end">
            <Button onClick={() => setIsEditing(true)}>
              Edit Cover Letter
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
