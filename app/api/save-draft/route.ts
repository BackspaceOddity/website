import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// Edit-mode thread & visual-edit store. Persisted to disk so Claude sessions
// and the next dev-server boot can read back all the user's accumulated
// edit intents. Kept as a flat JSON file — consuming it from the terminal
// (or piping to Claude as context) is trivial.
const FILE_PATH = path.join(process.cwd(), '_edit-threads.json');

export async function GET() {
  try {
    const data = await fs.readFile(FILE_PATH, 'utf-8');
    return NextResponse.json(JSON.parse(data));
  } catch {
    return NextResponse.json({ threads: {}, visualEdits: [] });
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const payload = { savedAt: new Date().toISOString(), ...body };
  await fs.writeFile(FILE_PATH, JSON.stringify(payload, null, 2), 'utf-8');
  return NextResponse.json({ ok: true });
}
