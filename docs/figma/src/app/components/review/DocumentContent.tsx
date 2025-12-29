import { useState, useEffect, useRef } from "react";
import { MessageSquarePlus } from "lucide-react";
import { Button } from "../ui/button";
import type { Document, Comment } from "./types";

interface DocumentContentProps {
  document?: Document;
  comments: Comment[];
  onAddComment: (comment: Comment) => void;
  selectedCommentId: string | null;
  onSelectComment: (id: string | null) => void;
}

export function DocumentContent({
  document,
  comments,
  onAddComment,
  selectedCommentId,
  onSelectComment,
}: DocumentContentProps) {
  const [selectedLineRange, setSelectedLineRange] = useState<{
    start: number;
    end: number;
  } | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  if (!document) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Select a document to review
      </div>
    );
  }

  const lines = document.content.split("\n");

  const handleLineClick = (lineNum: number, e: React.MouseEvent) => {
    if (e.shiftKey && selectedLineRange) {
      // Extend selection
      const newEnd = Math.max(lineNum, selectedLineRange.start);
      const newStart = Math.min(lineNum, selectedLineRange.start);
      setSelectedLineRange({ start: newStart, end: newEnd });
    } else {
      // Start new selection
      setSelectedLineRange({ start: lineNum, end: lineNum });
    }
  };

  const handleAddComment = () => {
    if (!selectedLineRange) return;

    const newComment: Comment = {
      id: `c${Date.now()}`,
      documentId: document.id,
      author: "You",
      authorType: "human",
      content: "",
      timestamp: new Date().toISOString(),
      lineStart: selectedLineRange.start,
      lineEnd: selectedLineRange.end,
      resolved: false,
    };

    onAddComment(newComment);
    onSelectComment(newComment.id);
    setSelectedLineRange(null);
  };

  const getLineComments = (lineNum: number) => {
    return comments.filter(
      (c) =>
        c.lineStart !== undefined &&
        c.lineEnd !== undefined &&
        lineNum >= c.lineStart &&
        lineNum <= c.lineEnd
    );
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#0a0a0f]">
      <div className="border-b border-gray-800 px-6 py-3 flex items-center justify-between bg-[#0d0d14]">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400">
            {lines.length} lines • {comments.length} comments
          </span>
          {selectedLineRange && (
            <span className="text-sm text-blue-400">
              Lines {selectedLineRange.start}–{selectedLineRange.end} selected
            </span>
          )}
        </div>
        {selectedLineRange && (
          <Button
            onClick={handleAddComment}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <MessageSquarePlus className="size-4 mr-2" />
            Add Comment
          </Button>
        )}
      </div>

      <div
        ref={contentRef}
        className="flex-1 overflow-y-auto px-6 py-4 font-mono text-sm"
      >
        {lines.map((line, idx) => {
          const lineNum = idx + 1;
          const lineComments = getLineComments(lineNum);
          const isSelected =
            selectedLineRange &&
            lineNum >= selectedLineRange.start &&
            lineNum <= selectedLineRange.end;
          const hasSelectedComment = lineComments.some(
            (c) => c.id === selectedCommentId
          );

          return (
            <div
              key={idx}
              className={`
                group flex relative
                ${isSelected ? "bg-blue-500/10" : ""}
                ${hasSelectedComment ? "bg-yellow-500/10" : ""}
                hover:bg-gray-800/30
              `}
            >
              <div
                className={`
                  w-12 flex-shrink-0 text-right pr-4 select-none cursor-pointer
                  ${isSelected ? "text-blue-400" : "text-gray-600"}
                  group-hover:text-gray-400
                `}
                onClick={(e) => handleLineClick(lineNum, e)}
              >
                {lineNum}
              </div>
              <div className="flex-1 pr-4">
                <code className="text-gray-300">{line || " "}</code>
              </div>
              {lineComments.length > 0 && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                  {lineComments.map((comment) => (
                    <button
                      key={comment.id}
                      onClick={() => onSelectComment(comment.id)}
                      className={`
                        px-2 py-1 rounded text-xs
                        ${
                          comment.id === selectedCommentId
                            ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/40"
                            : comment.authorType === "ai"
                            ? "bg-purple-500/10 text-purple-400 border border-purple-500/30"
                            : "bg-blue-500/10 text-blue-400 border border-blue-500/30"
                        }
                        hover:scale-105 transition-transform
                      `}
                    >
                      {comment.author}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
