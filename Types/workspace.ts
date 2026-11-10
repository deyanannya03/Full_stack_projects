export type MessageRole =  'user' | 'assistant';

export interface Message {
    role : MessageRole
    content : string;
    imageUrl? : string;
}
// files + dependencies always travel together, so we can use a single type to represent the workspace state
// this is what to get in prisma as a single json column
export interface FileData {
  files: Record<string, { code: string }>;
  dependencies: Record<string, string>;
  title?: string;
}

export interface StatusStep {
  label: string;
  status: "running" | "done";
}

export interface WorkspaceData {
  id: string;
  title: string | null;
  messages: unknown;
  fileData: unknown;
}

export interface WorkspaceUser {
  id: string;
  credits: number;
  plan: string;
}