import type { AyudaProject, DependencyItem } from "../types";

export const PROJECTS_STORAGE_KEY = "ayuda-admin-projects";
export const SHARED_PROJECTS_COOKIE_KEY = "ayuda-published-projects";
const MAX_SHARED_COOKIE_LENGTH = 3800;

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const defaultDependencyLabels = ["Funds Ready", "Venue Ready", "Staff Ready"];

export function createId(prefix: string): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function createDependency(label: string, ready = false): DependencyItem {
  return {
    id: createId("dep"),
    label,
    ready,
  };
}

export function createEmptyProject(): AyudaProject {
  const now = new Date().toISOString();

  return {
    id: createId("ayuda"),
    name: "",
    requirements: [],
    eligibility: [],
    location: {
      address: "",
      mapsUrl: "",
    },
    schedule: "",
    beneficiaryTarget: 0,
    dependencies: defaultDependencyLabels.map((label) => createDependency(label)),
    publishState: "draft",
    status: "upcoming",
    statusNote: "",
    createdAt: now,
    updatedAt: now,
  };
}

export function sanitizeLineList(value: string): string[] {
  return value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function validateProjectForPublish(project: AyudaProject): ValidationResult {
  const errors: string[] = [];

  if (!project.name.trim()) {
    errors.push("Project name is required.");
  }

  if (!project.location.address.trim()) {
    errors.push("Venue address is required.");
  }

  if (!project.schedule) {
    errors.push("Date and time are required.");
  }

  if (!Number.isFinite(project.beneficiaryTarget) || project.beneficiaryTarget <= 0) {
    errors.push("Beneficiary target must be greater than zero.");
  }

  if (project.requirements.filter(Boolean).length === 0) {
    errors.push("Add at least one requirement.");
  }

  if (project.eligibility.filter(Boolean).length === 0) {
    errors.push("Add at least one eligibility rule.");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function isProjectReady(project: AyudaProject): boolean {
  return project.dependencies.length > 0 && project.dependencies.every((item) => item.ready);
}

function canUseCookies(): boolean {
  return typeof document !== "undefined" && typeof document.cookie === "string";
}

function readCookie(name: string): string | null {
  if (!canUseCookies()) {
    return null;
  }

  const cookie = document.cookie
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${name}=`));

  return cookie ? cookie.slice(name.length + 1) : null;
}

function writeCookie(name: string, value: string): void {
  if (!canUseCookies()) {
    return;
  }

  document.cookie = `${name}=${value}; Max-Age=31536000; Path=/; SameSite=Lax`;
}

function clearCookie(name: string): void {
  if (!canUseCookies()) {
    return;
  }

  document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax`;
}

function loadSharedProjectsFromCookie(): AyudaProject[] {
  const raw = readCookie(SHARED_PROJECTS_COOKIE_KEY);

  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(decodeURIComponent(raw));
    return Array.isArray(parsed) ? (parsed as AyudaProject[]) : [];
  } catch {
    return [];
  }
}

function saveSharedProjectsToCookie(projects: AyudaProject[]): void {
  const publishedProjects = projects.filter((project) => project.publishState === "published");
  const encoded = encodeURIComponent(JSON.stringify(publishedProjects));

  if (encoded.length > MAX_SHARED_COOKIE_LENGTH) {
    clearCookie(SHARED_PROJECTS_COOKIE_KEY);
    return;
  }

  writeCookie(SHARED_PROJECTS_COOKIE_KEY, encoded);
}

function mergeProjects(projectGroups: AyudaProject[][]): AyudaProject[] {
  const merged = new Map<string, AyudaProject>();

  for (const projects of projectGroups) {
    for (const project of projects) {
      merged.set(project.id, project);
    }
  }

  return Array.from(merged.values()).sort((left, right) => {
    if (!left.schedule || !right.schedule) {
      return left.name.localeCompare(right.name);
    }

    return new Date(left.schedule).getTime() - new Date(right.schedule).getTime();
  });
}

export function loadProjects(storage: StorageLike = window.localStorage): AyudaProject[] {
  try {
    const raw = storage.getItem(PROJECTS_STORAGE_KEY);

    if (!raw) {
      return loadSharedProjectsFromCookie();
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as AyudaProject[]) : [];
  } catch {
    return [];
  }
}

export function saveProjects(projects: AyudaProject[], storage: StorageLike = window.localStorage): void {
  storage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
  saveSharedProjectsToCookie(projects);
}

export function loadPublishedProjects(storage: StorageLike = window.localStorage): AyudaProject[] {
  const localProjects = loadProjects(storage).filter((project) => project.publishState === "published");
  const sharedProjects = loadSharedProjectsFromCookie().filter((project) => project.publishState === "published");

  return mergeProjects([sharedProjects, localProjects]);
}

export function upsertProject(projects: AyudaProject[], project: AyudaProject): AyudaProject[] {
  const updatedProject = {
    ...project,
    updatedAt: new Date().toISOString(),
  };
  const existingIndex = projects.findIndex((item) => item.id === project.id);

  if (existingIndex === -1) {
    return [updatedProject, ...projects];
  }

  return projects.map((item) => (item.id === project.id ? updatedProject : item));
}
