import { getStore } from "@netlify/blobs";

const MAX_LOG = 5;
const MAX_COMMENTS = 10;

function store() {
  // "strong" consistency so an update is reflected immediately on the next read.
  return getStore({ name: "upton-pyne-road", consistency: "strong" });
}

export default async (req) => {
  if (req.method === "GET") {
    const s = store();
    const status = (await s.get("status", { type: "json" })) || null;
    const log = (await s.get("log", { type: "json" })) || [];
    const comments = (await s.get("comments", { type: "json" })) || [];
    return new Response(JSON.stringify({ status, log, comments }), {
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    });
  }

  if (req.method === "POST") {
    let body;
    try {
      body = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400 });
    }

    const name = typeof body?.name === "string" ? body.name.trim().slice(0, 60) : "";
    if (!name) {
      return new Response(JSON.stringify({ error: "Name is required" }), { status: 400 });
    }

    const s = store();

    if (body?.type === "comment") {
      const text = typeof body?.comment === "string" ? body.comment.trim().slice(0, 300) : "";
      if (!text) {
        return new Response(JSON.stringify({ error: "Comment is empty" }), { status: 400 });
      }
      const entry = { name, comment: text, timestamp: new Date().toISOString() };
      const existing = (await s.get("comments", { type: "json" })) || [];
      const updated = [entry, ...existing].slice(0, MAX_COMMENTS);
      await s.setJSON("comments", updated);
      return new Response(JSON.stringify({ comments: updated }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    const newStatus = body?.status;
    if (!["open", "closed"].includes(newStatus)) {
      return new Response(JSON.stringify({ error: "Invalid status" }), { status: 400 });
    }
    const entry = { status: newStatus, name, timestamp: new Date().toISOString() };
    const existingLog = (await s.get("log", { type: "json" })) || [];
    const newLog = [entry, ...existingLog].slice(0, MAX_LOG);
    await s.setJSON("status", entry);
    await s.setJSON("log", newLog);
    return new Response(JSON.stringify({ status: entry, log: newLog }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config = { path: "/api/status" };
