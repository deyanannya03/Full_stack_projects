import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { FileData, Message } from "@/components/workspaceClient";
import { db } from "@/lib/prisma";
import { Select } from "@base-ui/react";
export async function POST(request: NextRequest) {
    const { userId : clerkId} = await auth();
    if(!clerkId){
        return  Response.json({ message: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json();
      const { workspaceId, userId, messages, fileData } = body as {
    workspaceId: string | null;
    userId: string;
    messages: Message[];
    fileData: FileData | null;
  };

  if (!messages?.length) {
    return Response.json({ message: "No messages provided" }, { status: 400 });
  }
// ── Arcjet: rate limit, prompt injection, sensitive info ──────────────────
const user=await db.orm.public.User.whereUnique({ id: userId })
      .first();
}