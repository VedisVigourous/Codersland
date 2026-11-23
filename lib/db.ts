import fs from "fs";
import path from "path";
import { Redis } from "@upstash/redis";

export interface TeamMember {
  name: string;
  email: string;
  phone?: string;
  isLeader: boolean;
  domain: "Web Development" | "Cybersecurity" | "Cloud" | "Networking";
}

export interface TeamRegistration {
  id: string; // e.g. CL-2026-A7F2
  passcode: string; // e.g. BORDER-9K2M
  clubName: string;
  teamName: string;
  members: TeamMember[];
  registeredAt: string;
  status: "CONFIRMED" | "VISA_GRANTED";
  visaDays: number;
  ipAddress?: string;
  domainMap: {
    webDev: string;
    cybersecurity: string;
    cloud: string;
    networking: string;
  };
}

// Support both Upstash Redis and Vercel KV environment variable standards
const redisUrl = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

export const isCloudDb = Boolean(redisUrl && redisToken);

const redis = isCloudDb
  ? new Redis({
      url: redisUrl!,
      token: redisToken!,
    })
  : null;

const DATA_DIR = path.join(process.cwd(), "data");
const REGISTRATIONS_FILE = path.join(DATA_DIR, "registrations.json");
const AUDIT_LOG_FILE = path.join(DATA_DIR, "audit_log.jsonl");
const QUIZ_SYNC_FILE = path.join(DATA_DIR, "quiz_event_teams.json");

// Safely ensure data directory exists for local development
try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
} catch {
  // Ignored in read-only serverless environments
}

// In-memory Mutex Queue to guarantee serial atomic execution for high concurrency
class AsyncMutex {
  private queue: Promise<void> = Promise.resolve();

  dispatch<T>(action: () => Promise<T> | T): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue = this.queue.then(async () => {
        try {
          const result = await action();
          resolve(result);
        } catch (err) {
          reject(err);
        }
      });
    });
  }
}

const dbMutex = new AsyncMutex();

// Local file reading fallback
function readRegistrationsFromDisk(): TeamRegistration[] {
  try {
    if (!fs.existsSync(REGISTRATIONS_FILE)) {
      return [];
    }
    const data = fs.readFileSync(REGISTRATIONS_FILE, "utf8");
    if (!data.trim()) return [];
    return JSON.parse(data);
  } catch (err) {
    console.error("Local disk read fallback:", err);
    return [];
  }
}

// Unified reader (Redis cloud DB with local disk fallback)
async function readRegistrationsUnified(): Promise<TeamRegistration[]> {
  if (redis) {
    try {
      const data = await redis.get<TeamRegistration[] | string>("coderlands:registrations");
      if (!data) return [];
      if (Array.isArray(data)) return data;
      if (typeof data === "string") return JSON.parse(data);
      return [];
    } catch (err) {
      console.error("Upstash Redis read error, trying local fallback:", err);
      return readRegistrationsFromDisk();
    }
  }
  return readRegistrationsFromDisk();
}

// Local file atomic writing
function writeRegistrationsToDisk(registrations: TeamRegistration[]): void {
  try {
    const tempPath = path.join(DATA_DIR, `temp_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.json`);
    const content = JSON.stringify(registrations, null, 2);
    fs.writeFileSync(tempPath, content, "utf8");
    fs.renameSync(tempPath, REGISTRATIONS_FILE);

    // Sync quiz event teams schema
    const quizTeamMap = registrations.map((t) => ({
      teamId: t.id,
      passcode: t.passcode,
      teamName: t.teamName,
      clubName: t.clubName,
      domains: {
        "Web Development": t.domainMap.webDev,
        "Cybersecurity": t.domainMap.cybersecurity,
        "Cloud": t.domainMap.cloud,
        "Networking": t.domainMap.networking,
      },
      members: t.members,
    }));
    fs.writeFileSync(QUIZ_SYNC_FILE, JSON.stringify(quizTeamMap, null, 2), "utf8");
  } catch (err) {
    console.error("Local disk write error (expected on serverless):", err);
  }
}

// Unified writer (Redis cloud DB with local disk fallback)
async function writeRegistrationsUnified(registrations: TeamRegistration[]): Promise<void> {
  if (redis) {
    try {
      await redis.set("coderlands:registrations", registrations);
      return;
    } catch (err) {
      console.error("Upstash Redis write error:", err);
      throw new Error("Cloud database write failed: " + (err instanceof Error ? err.message : String(err)));
    }
  }
  writeRegistrationsToDisk(registrations);
}

// Append-only Write Ahead Log (WAL)
async function appendAuditLog(event: string, payload: any): Promise<void> {
  if (redis) {
    try {
      await redis.lpush(
        "coderlands:audit_log",
        JSON.stringify({
          timestamp: new Date().toISOString(),
          event,
          payload,
        })
      );
      return;
    } catch (err) {
      console.error("Redis audit log error:", err);
    }
  }
  try {
    const entry = JSON.stringify({
      timestamp: new Date().toISOString(),
      event,
      payload,
    }) + "\n";
    fs.appendFileSync(AUDIT_LOG_FILE, entry, "utf8");
  } catch {
    // Silent fail in read-only environments
  }
}

// Generate unique Team ID and Passcode
function generateTeamId(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let random = "";
  for (let i = 0; i < 4; i++) {
    random += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `CL-2026-${random}`;
}

function generatePasscode(): string {
  const chars = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
  let random = "";
  for (let i = 0; i < 4; i++) {
    random += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `BORDER-${random}`;
}

// Public API Functions wrapped in Mutex
export async function getRegistrations(): Promise<TeamRegistration[]> {
  return dbMutex.dispatch(async () => {
    return readRegistrationsUnified();
  });
}

export async function findTeamById(id: string): Promise<TeamRegistration | null> {
  const teams = await getRegistrations();
  return teams.find((t) => t.id.toLowerCase() === id.toLowerCase()) || null;
}

export interface RegisterInput {
  clubName: string;
  teamName: string;
  members: TeamMember[];
  ipAddress?: string;
}

export async function registerTeam(input: RegisterInput): Promise<{
  success: boolean;
  team?: TeamRegistration;
  error?: string;
}> {
  return dbMutex.dispatch(async () => {
    // 1. Basic validation
    const club = input.clubName?.trim();
    const team = input.teamName?.trim();

    if (!club) return { success: false, error: "Club Name is mandatory." };
    if (!team) return { success: false, error: "Team Name is mandatory." };
    if (!Array.isArray(input.members) || input.members.length !== 4) {
      return { success: false, error: "A team must have exactly 4 members." };
    }

    // 2. Member validation
    for (let i = 0; i < 4; i++) {
      const m = input.members[i];
      if (!m.name || !m.name.trim()) {
        return { success: false, error: `Member #${i + 1} name is missing.` };
      }
    }

    // 3. Exactly 1 team leader
    const leaders = input.members.filter((m) => m.isLeader);
    if (leaders.length !== 1) {
      return { success: false, error: "Please designate exactly one member as Team Lead." };
    }

    // 4. Domains validation
    const requiredDomains: Array<TeamMember["domain"]> = [
      "Web Development",
      "Cybersecurity",
      "Cloud",
      "Networking",
    ];

    const selectedDomains = input.members.map((m) => m.domain);
    for (const req of requiredDomains) {
      if (!selectedDomains.includes(req)) {
        return { success: false, error: `The domain '${req}' must be assigned to one member.` };
      }
    }

    // 5. Check duplicate team names
    const existing = await readRegistrationsUnified();
    const duplicate = existing.find(
      (t) => t.teamName.toLowerCase().trim() === team.toLowerCase()
    );
    if (duplicate) {
      return {
        success: false,
        error: `Team name "${team}" is already registered. Please choose a different name.`,
      };
    }

    // 6. Build Registration Record
    const id = generateTeamId();
    const passcode = generatePasscode();

    const webDevMember = input.members.find((m) => m.domain === "Web Development")?.name || "";
    const cyberMember = input.members.find((m) => m.domain === "Cybersecurity")?.name || "";
    const cloudMember = input.members.find((m) => m.domain === "Cloud")?.name || "";
    const netMember = input.members.find((m) => m.domain === "Networking")?.name || "";

    const newRegistration: TeamRegistration = {
      id,
      passcode,
      clubName: club,
      teamName: team,
      members: input.members.map((m) => ({
        name: m.name.trim(),
        email: m.email?.trim() || "",
        phone: m.phone?.trim() || "",
        isLeader: Boolean(m.isLeader),
        domain: m.domain,
      })),
      registeredAt: new Date().toISOString(),
      status: "VISA_GRANTED",
      visaDays: 14,
      ipAddress: input.ipAddress || "anonymous",
      domainMap: {
        webDev: webDevMember,
        cybersecurity: cyberMember,
        cloud: cloudMember,
        networking: netMember,
      },
    };

    // 7. Unified Write & WAL Append
    existing.push(newRegistration);
    await writeRegistrationsUnified(existing);
    await appendAuditLog("TEAM_REGISTERED", {
      teamId: id,
      teamName: team,
      clubName: club,
    });

    return {
      success: true,
      team: newRegistration,
    };
  });
}
