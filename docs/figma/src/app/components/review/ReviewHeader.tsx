import { FileText, Rocket } from "lucide-react";
import { Badge } from "../ui/badge";
import type { Document } from "./types";

interface ReviewHeaderProps {
  documents: Document[];
  selectedDocId: string;
  onSelectDoc: (id: string) => void;
}

export function ReviewHeader({
  documents,
  selectedDocId,
  onSelectDoc,
}: ReviewHeaderProps) {
  return (
    <div className="border-b border-gray-800 bg-[#0d0d14] px-6 py-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/30">
            <Rocket className="size-5 text-blue-400" />
          </div>
          <div>
            <h1 className="text-gray-100">Mission Review</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              NBLA-247 • Dark Mode Implementation
            </p>
          </div>
        </div>
        <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/20">
          Pending Review
        </Badge>
      </div>

      <div className="flex gap-2">
        {documents.map((doc) => (
          <button
            key={doc.id}
            onClick={() => onSelectDoc(doc.id)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg transition-all
              ${
                selectedDocId === doc.id
                  ? "bg-gray-800 text-gray-100 border border-gray-700"
                  : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"
              }
            `}
          >
            <FileText className="size-4" />
            <span className="text-sm">{doc.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
