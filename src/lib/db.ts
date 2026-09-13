import { promises as fs } from "fs";
import path from "path";

/**
 * Very small JSON-file "database".
 *
 * This is intentionally simple so the project runs with zero external
 * services out of the box. It's fine for an intimate celebration's
 * scale (dozens of guests, a few hundred photos).
 *
 * If you deploy to a serverless platform (Vercel, Netlify, etc.) the
 * filesystem is NOT persistent between deploys/instances — see the
 * "Production storage" section of README.md before you go live.
 */

const DATA_DIR = path.join(process.cwd(), "data");

// Serialize writes per-file so two simultaneous RSVPs/uploads can't
// clobber each other.
const writeQueues = new Map<string, Promise<unknown>>();

function queueWrite<T>(file: string, task: () => Promise<T>): Promise<T> {
  const prev = writeQueues.get(file) ?? Promise.resolve();
  const next = prev.then(task, task);
  writeQueues.set(
    file,
    next.catch(() => undefined)
  );
  return next;
}

async function ensureFile(file: string, fallback: unknown) {
  const full = path.join(DATA_DIR, file);
  try {
    await fs.access(full);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(full, JSON.stringify(fallback, null, 2), "utf-8");
  }
}

export async function readJson<T>(file: string, fallback: T): Promise<T> {
  await ensureFile(file, fallback);
  const full = path.join(DATA_DIR, file);
  const raw = await fs.readFile(full, "utf-8");
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function writeJson<T>(file: string, data: T): Promise<void> {
  return queueWrite(file, async () => {
    await ensureFile(file, data);
    const full = path.join(DATA_DIR, file);
    const tmp = `${full}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(data, null, 2), "utf-8");
    await fs.rename(tmp, full);
  });
}

/** Read-modify-write helper that goes through the same write queue. */
export async function updateJson<T>(
  file: string,
  fallback: T,
  mutate: (current: T) => T | Promise<T>
): Promise<T> {
  return queueWrite(file, async () => {
    await ensureFile(file, fallback);
    const full = path.join(DATA_DIR, file);
    const raw = await fs.readFile(full, "utf-8");
    let current: T;
    try {
      current = JSON.parse(raw) as T;
    } catch {
      current = fallback;
    }
    const updated = await mutate(current);
    const tmp = `${full}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(updated, null, 2), "utf-8");
    await fs.rename(tmp, full);
    return updated;
  });
}
