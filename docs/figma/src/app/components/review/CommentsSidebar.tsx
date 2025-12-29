import { useState } from "react";
import { Bot, User, CheckCircle2, MessageSquare, Sparkles } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import type { Comment } from "./types";

interface CommentsSidebarProps {
  comments: Comment[];
  selectedCommentId: string | null;
  onSelectComment: (id: string | null) => void;
  onUpdateComment: (commentId: string, updates: Partial<Comment>) => void;
}

export function CommentsSidebar({
  comments,
  selectedCommentId,
  onSelectComment,
  onUpdateComment,
}: CommentsSidebarProps) {
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  const unresolvedComments = comments.filter((c) => !c.resolved);
  const resolvedComments = comments.filter((c) => c.resolved);

  const handleStartEdit = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditContent(comment.content);
  };

  const handleSaveEdit = (commentId: string) => {
    onUpdateComment(commentId, { content: editContent });
    setEditingCommentId(null);
    setEditContent("");
  };

  const handleResolve = (commentId: string) => {
    onUpdateComment(commentId, { resolved: true });
  };

  const handleAskAI = (comment: Comment) => {
    // Simulate AI response
    const aiReply = {
      id: `r${Date.now()}`,
      author: "Nebula AI",
      authorType: "ai" as const,
      content:
        "I understand your concern. Let me clarify this section with more detail...",
      timestamp: new Date().toISOString(),
    };

    onUpdateComment(comment.id, {
      replies: [...(comment.replies || []), aiReply],
    });
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const renderComment = (comment: Comment) => {
    const isSelected = comment.id === selectedCommentId;
    const isEditing = editingCommentId === comment.id;

    return (
      <div
        key={comment.id}
        className={`
          p-4 rounded-lg border transition-all cursor-pointer
          ${
            isSelected
              ? "bg-gray-800 border-gray-600"
              : "bg-gray-900/50 border-gray-800 hover:border-gray-700"
          }
        `}
        onClick={() => onSelectComment(comment.id)}
      >
        <div className="flex items-start gap-3">
          <div
            className={`
            p-2 rounded-lg flex-shrink-0
            ${
              comment.authorType === "ai"
                ? "bg-purple-500/10 border border-purple-500/30"
                : "bg-blue-500/10 border border-blue-500/30"
            }
          `}
          >
            {comment.authorType === "ai" ? (
              <Bot className="size-4 text-purple-400" />
            ) : (
              <User className="size-4 text-blue-400" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm text-gray-200">{comment.author}</span>
              <span className="text-xs text-gray-500">
                {formatTime(comment.timestamp)}
              </span>
              {comment.lineStart !== undefined && (
                <Badge
                  variant="outline"
                  className="text-xs border-gray-700 text-gray-400"
                >
                  L{comment.lineStart}
                  {comment.lineEnd !== comment.lineStart &&
                    `–${comment.lineEnd}`}
                </Badge>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-2">
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-gray-200 min-h-[80px]"
                  placeholder="Write your comment..."
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSaveEdit(comment.id);
                    }}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingCommentId(null);
                    }}
                    className="text-gray-400 hover:text-gray-200"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                {comment.content ? (
                  <p className="text-sm text-gray-300 mb-3">
                    {comment.content}
                  </p>
                ) : (
                  <div
                    className="mb-3"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartEdit(comment);
                    }}
                  >
                    <Textarea
                      className="bg-gray-800 border-gray-700 text-gray-200 min-h-[80px]"
                      placeholder="Write your comment..."
                    />
                  </div>
                )}

                {comment.content && !comment.resolved && (
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleResolve(comment.id);
                      }}
                      className="text-green-400 hover:text-green-300 hover:bg-green-500/10 h-7 text-xs"
                    >
                      <CheckCircle2 className="size-3 mr-1" />
                      Resolve
                    </Button>
                    {comment.authorType === "human" && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAskAI(comment);
                        }}
                        className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 h-7 text-xs"
                      >
                        <Sparkles className="size-3 mr-1" />
                        Ask AI
                      </Button>
                    )}
                  </div>
                )}

                {comment.replies && comment.replies.length > 0 && (
                  <div className="mt-3 space-y-2 pl-3 border-l-2 border-gray-700">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="space-y-1">
                        <div className="flex items-center gap-2">
                          {reply.authorType === "ai" ? (
                            <Bot className="size-3 text-purple-400" />
                          ) : (
                            <User className="size-3 text-blue-400" />
                          )}
                          <span className="text-xs text-gray-400">
                            {reply.author}
                          </span>
                          <span className="text-xs text-gray-600">
                            {formatTime(reply.timestamp)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-300 pl-5">
                          {reply.content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-96 border-l border-gray-800 bg-[#0d0d14] flex flex-col">
      <div className="border-b border-gray-800 px-4 py-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="size-5 text-gray-400" />
          <h2 className="text-gray-200">Comments</h2>
          <Badge className="ml-auto bg-blue-500/10 text-blue-400 border-blue-500/30">
            {unresolvedComments.length} Open
          </Badge>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {unresolvedComments.length === 0 && resolvedComments.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="size-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No comments yet</p>
              <p className="text-xs mt-1">
                Select lines and click "Add Comment"
              </p>
            </div>
          )}

          {unresolvedComments.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs uppercase text-gray-500 tracking-wide">
                Open
              </h3>
              {unresolvedComments.map(renderComment)}
            </div>
          )}

          {resolvedComments.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs uppercase text-gray-500 tracking-wide">
                Resolved
              </h3>
              {resolvedComments.map(renderComment)}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
