import { useState } from "react";
import { ReviewHeader } from "./review/ReviewHeader";
import { DocumentContent } from "./review/DocumentContent";
import { CommentsSidebar } from "./review/CommentsSidebar";
import { ApprovalActions } from "./review/ApprovalActions";
import { mockDocuments, mockComments } from "./review/mockData";
import type { Comment } from "./review/types";

export function DocumentReview() {
  const [selectedDocId, setSelectedDocId] = useState("design-doc");
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [selectedCommentId, setSelectedCommentId] = useState<string | null>(null);

  const currentDoc = mockDocuments.find((doc) => doc.id === selectedDocId);

  const addComment = (comment: Comment) => {
    setComments([...comments, comment]);
  };

  const updateComment = (commentId: string, updates: Partial<Comment>) => {
    setComments(
      comments.map((c) => (c.id === commentId ? { ...c, ...updates } : c))
    );
  };

  return (
    <div className="h-screen flex flex-col bg-[#0a0a0f]">
      <ReviewHeader
        documents={mockDocuments}
        selectedDocId={selectedDocId}
        onSelectDoc={setSelectedDocId}
      />

      <div className="flex-1 flex overflow-hidden">
        <DocumentContent
          document={currentDoc}
          comments={comments}
          onAddComment={addComment}
          selectedCommentId={selectedCommentId}
          onSelectComment={setSelectedCommentId}
        />

        <CommentsSidebar
          comments={comments.filter((c) => c.documentId === selectedDocId)}
          selectedCommentId={selectedCommentId}
          onSelectComment={setSelectedCommentId}
          onUpdateComment={updateComment}
        />
      </div>

      <ApprovalActions />
    </div>
  );
}
