import { describe, expect, it } from "vitest";
import {
  PROJECTS_STORAGE_KEY,
  createEmptyProject,
  loadProjects,
  saveProjects,
  sanitizeLineList,
  validateProjectForPublish,
} from "./projects";

class MemoryStorage {
  private values = new Map<string, string>();

  getItem(key: string): string | null {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.values.set(key, value);
  }
}

describe("project helpers", () => {
  it("validates required fields before publishing", () => {
    const project = createEmptyProject();
    const result = validateProjectForPublish(project);

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Project name is required.");

    const valid = {
      ...project,
      name: "Senior Citizen Cash Assistance",
      requirements: ["Valid ID"],
      eligibility: ["Resident of the barangay"],
      location: { address: "Municipal Hall" },
      schedule: "2026-05-01T09:00",
      beneficiaryTarget: 100,
    };

    expect(validateProjectForPublish(valid).isValid).toBe(true);
  });

  it("sanitizes multiline requirement and eligibility input", () => {
    expect(sanitizeLineList("Valid ID\n\n Proof of residency \r\n")).toEqual([
      "Valid ID",
      "Proof of residency",
    ]);
  });

  it("saves, loads, and tolerates corrupted local data", () => {
    const storage = new MemoryStorage();
    const project = createEmptyProject();

    saveProjects([project], storage);
    expect(loadProjects(storage)).toHaveLength(1);

    storage.setItem(PROJECTS_STORAGE_KEY, "{bad json");
    expect(loadProjects(storage)).toEqual([]);
  });
});
