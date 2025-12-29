import { useState } from "react";
import { File, Folder, ChevronRight, ChevronDown, Plus, Minus, FileText } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

interface FileNode {
  name: string;
  type: "file" | "folder";
  status?: "added" | "modified" | "deleted";
  children?: FileNode[];
  diff?: {
    added: number;
    removed: number;
  };
}

const mockFileTree: FileNode[] = [
  {
    name: "src",
    type: "folder",
    children: [
      {
        name: "auth",
        type: "folder",
        children: [
          {
            name: "AuthProvider.tsx",
            type: "file",
            status: "added",
            diff: { added: 87, removed: 0 },
          },
          {
            name: "useAuth.ts",
            type: "file",
            status: "added",
            diff: { added: 34, removed: 0 },
          },
          {
            name: "types.ts",
            type: "file",
            status: "added",
            diff: { added: 21, removed: 0 },
          },
        ],
      },
      {
        name: "components",
        type: "folder",
        children: [
          {
            name: "LoginForm.tsx",
            type: "file",
            status: "modified",
            diff: { added: 45, removed: 12 },
          },
          {
            name: "ProtectedRoute.tsx",
            type: "file",
            status: "added",
            diff: { added: 28, removed: 0 },
          },
        ],
      },
      {
        name: "api",
        type: "folder",
        children: [
          {
            name: "client.ts",
            type: "file",
            status: "modified",
            diff: { added: 18, removed: 5 },
          },
        ],
      },
    ],
  },
];

const mockDiff = `@@ -1,12 +1,45 @@
-import { useState } from 'react';
+import { useState, useContext } from 'react';
+import { AuthContext } from '../auth/AuthProvider';
+import { LoginCredentials } from '../auth/types';
 
 export function LoginForm() {
-  const [email, setEmail] = useState('');
-  const [password, setPassword] = useState('');
+  const { login, isLoading } = useContext(AuthContext);
+  const [credentials, setCredentials] = useState<LoginCredentials>({
+    email: '',
+    password: '',
+  });
+  const [error, setError] = useState<string | null>(null);
 
   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
-    // TODO: Implement authentication
+    setError(null);
+    
+    try {
+      await login(credentials);
+    } catch (err) {
+      setError(err instanceof Error ? err.message : 'Login failed');
+    }
   };
 
   return (
-    <form onSubmit={handleSubmit}>
-      {/* Form fields */}
+    <form onSubmit={handleSubmit} className="space-y-4">
+      {error && (
+        <div className="p-3 rounded bg-red-500/10 border border-red-500/30">
+          <p className="text-sm text-red-400">{error}</p>
+        </div>
+      )}
+      
+      <input
+        type="email"
+        value={credentials.email}
+        onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
+        placeholder="Email"
+        required
+      />
+      
+      <input
+        type="password"
+        value={credentials.password}
+        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
+        placeholder="Password"
+        required
+      />
+      
+      <button type="submit" disabled={isLoading}>
+        {isLoading ? 'Logging in...' : 'Login'}
+      </button>
     </form>
   );
 }`;

function FileTreeNode({ node, level = 0 }: { node: FileNode; level?: number }) {
  const [isOpen, setIsOpen] = useState(level < 2);

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "added":
        return "text-green-400";
      case "modified":
        return "text-blue-400";
      case "deleted":
        return "text-red-400";
      default:
        return "text-gray-500";
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "added":
        return <Badge className="bg-green-500/10 text-green-400 border-green-500/30 text-xs">A</Badge>;
      case "modified":
        return <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/30 text-xs">M</Badge>;
      case "deleted":
        return <Badge className="bg-red-500/10 text-red-400 border-red-500/30 text-xs">D</Badge>;
      default:
        return null;
    }
  };

  if (node.type === "folder") {
    return (
      <div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-gray-900 text-left group"
          style={{ paddingLeft: `${level * 12 + 12}px` }}
        >
          {isOpen ? (
            <ChevronDown className="size-3 text-gray-600" />
          ) : (
            <ChevronRight className="size-3 text-gray-600" />
          )}
          <Folder className="size-4 text-gray-500" />
          <span className="text-sm text-gray-400 group-hover:text-gray-300">
            {node.name}
          </span>
        </button>
        {isOpen && node.children && (
          <div>
            {node.children.map((child, i) => (
              <FileTreeNode key={i} node={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <button
      className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-gray-900 text-left group"
      style={{ paddingLeft: `${level * 12 + 12}px` }}
    >
      <div className="w-3"></div>
      <File className={`size-4 ${getStatusColor(node.status)}`} />
      <span className="text-sm text-gray-400 group-hover:text-gray-300 flex-1">
        {node.name}
      </span>
      {getStatusBadge(node.status)}
      {node.diff && (
        <div className="flex items-center gap-1 text-xs">
          <span className="text-green-400">+{node.diff.added}</span>
          {node.diff.removed > 0 && (
            <span className="text-red-400">-{node.diff.removed}</span>
          )}
        </div>
      )}
    </button>
  );
}

export function FileChanges() {
  return (
    <div className="flex-1 flex flex-col">
      <Tabs defaultValue="diff" className="flex-1 flex flex-col">
        <div className="border-b border-gray-900 px-4 py-3 bg-black">
          <TabsList className="bg-gray-900 border border-gray-800">
            <TabsTrigger value="tree" className="data-[state=active]:bg-black">
              File Tree
            </TabsTrigger>
            <TabsTrigger value="diff" className="data-[state=active]:bg-black">
              Current Diff
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="tree" className="flex-1 m-0">
          <ScrollArea className="h-full">
            <div className="py-2">
              {mockFileTree.map((node, i) => (
                <FileTreeNode key={i} node={node} />
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="diff" className="flex-1 m-0">
          <div className="flex flex-col h-full">
            {/* File header */}
            <div className="border-b border-gray-900 px-4 py-3 bg-black">
              <div className="flex items-center gap-3">
                <FileText className="size-4 text-blue-400" />
                <span className="text-sm text-gray-300 font-mono">
                  src/components/LoginForm.tsx
                </span>
                <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/30 text-xs">
                  Modified
                </Badge>
                <div className="ml-auto flex items-center gap-2 text-xs">
                  <span className="text-green-400 flex items-center gap-1">
                    <Plus className="size-3" />
                    45
                  </span>
                  <span className="text-red-400 flex items-center gap-1">
                    <Minus className="size-3" />
                    12
                  </span>
                </div>
              </div>
            </div>

            {/* Diff view */}
            <ScrollArea className="flex-1">
              <div className="font-mono text-xs">
                {mockDiff.split("\n").map((line, i) => {
                  let bgClass = "bg-black";
                  let textClass = "text-gray-500";
                  let marker = " ";

                  if (line.startsWith("@@")) {
                    bgClass = "bg-purple-500/5";
                    textClass = "text-purple-400";
                  } else if (line.startsWith("+")) {
                    bgClass = "bg-green-500/10";
                    textClass = "text-green-300";
                    marker = "+";
                  } else if (line.startsWith("-")) {
                    bgClass = "bg-red-500/10";
                    textClass = "text-red-300";
                    marker = "-";
                  }

                  return (
                    <div
                      key={i}
                      className={`flex ${bgClass} border-l-2 ${
                        line.startsWith("+")
                          ? "border-green-500"
                          : line.startsWith("-")
                          ? "border-red-500"
                          : "border-transparent"
                      }`}
                    >
                      <div className="w-12 text-right pr-4 text-gray-700 select-none flex-shrink-0">
                        {!line.startsWith("@@") && i}
                      </div>
                      <div className="w-4 text-center flex-shrink-0 text-gray-600">
                        {marker}
                      </div>
                      <div className={`flex-1 pr-4 ${textClass}`}>
                        {line.replace(/^[+\-]/, "")}
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
