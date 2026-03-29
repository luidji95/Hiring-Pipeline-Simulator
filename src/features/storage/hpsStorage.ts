import type {
  WorkspaceInstance,
  WorkspaceIndexItem,
  WorkspaceTemplate,
  Candidate,
  CandidateEvent,
  StageId,
} from "../workspace/workspace.types";
import { WORKSPACE_TEMPLATES } from "../workspace/workspaceTemplates";

export type UpdateCandidateInput = {
  firstName: string;
  lastName: string;
  title: string;
  company?: string;
  location?: string;
  email?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  tags?: string[];
};

const INDEX_KEY = "hps_instances_index";
const instanceKey = (id: string) => `hps_instance_${id}`;

const DEMO_MAP_KEY = "hps_demo_by_template";
type DemoMap = Record<string, string>;

const nowIso = () => new Date().toISOString();

const uuid = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `id_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
};

const safeJsonParse = <T>(raw: string | null, fallback: T): T => {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

/* -
   Index (My Workspaces list)
 */
export const getInstancesIndex = (): WorkspaceIndexItem[] => {
  return safeJsonParse<WorkspaceIndexItem[]>(localStorage.getItem(INDEX_KEY), []);
};

export const saveInstancesIndex = (items: WorkspaceIndexItem[]) => {
  localStorage.setItem(INDEX_KEY, JSON.stringify(items));
};

export const upsertIndexItem = (item: WorkspaceIndexItem) => {
  const index = getInstancesIndex();
  const exists = index.some((x) => x.id === item.id);
  const next = exists ? index.map((x) => (x.id === item.id ? item : x)) : [item, ...index];
  saveInstancesIndex(next);
};

export const removeIndexItem = (id: string) => {
  const index = getInstancesIndex().filter((x) => x.id !== id);
  saveInstancesIndex(index);
};

/* 
   Instance read/write
 */
export const getInstance = (id: string): WorkspaceInstance | null => {
  const raw = localStorage.getItem(instanceKey(id));
  return safeJsonParse<WorkspaceInstance | null>(raw, null);
};

export const saveInstance = (instance: WorkspaceInstance) => {
  localStorage.setItem(instanceKey(instance.id), JSON.stringify(instance));
};

export const deleteInstance = (id: string) => {
  localStorage.removeItem(instanceKey(id));
  removeIndexItem(id);
};

/*
  Demo index persistence
*/

const getDemoMap = (): DemoMap => {
  return safeJsonParse<DemoMap>(localStorage.getItem(DEMO_MAP_KEY), {});
};

const saveDemoMap = (map: DemoMap) => {
  localStorage.setItem(DEMO_MAP_KEY, JSON.stringify(map));
};

/*
   Helpers / creation
 */
const emptyCandidateIdsByStage = (): Record<StageId, string[]> => ({
  new: [],
  screening: [],
  hr_interview: [],
  technical_interview: [],
  final_interview: [],
  offer: [],
  hired: [],
  rejected: [],
});

const createCreatedEvent = (message?: string): CandidateEvent => ({
  id: uuid(),
  type: "created",
  createdAt: nowIso(),
  payload: { message },
});

const createStageMovedEvent = (fromStageId: StageId, toStageId: StageId, reason: string): CandidateEvent => ({
  id: uuid(),
  type: "stage_moved",
  createdAt: nowIso(),
  payload: { fromStageId, toStageId, reason },
});

const createNoteEvent = (content: string): CandidateEvent => ({
  id: uuid(),
  type: "note",
  createdAt: nowIso(),
  payload: { content },
});

const buildInstanceBase = (name: string, sourceTemplateId?: string | null): WorkspaceInstance => {
  return {
    id: uuid(),
    name,
    createdAt: nowIso(),
    sourceTemplateId: sourceTemplateId ?? null,

    stages: [],

    candidatesById: {},
    candidateIdsByStage: emptyCandidateIdsByStage(),
    eventsByCandidateId: {},
  };
};

const findTemplate = (templateId: string): WorkspaceTemplate => {
  const tpl = WORKSPACE_TEMPLATES.find((t) => t.id === templateId);
  if (!tpl) throw new Error(`Template not found: ${templateId}`);
  return tpl;
};

/**
 * DEMO instance by default (does NOT go to "My Workspaces" index).
 * If you pass { addToIndex: true }, then it will appear in My Workspaces.
 */
export const createInstanceFromTemplate = (
  templateId: string,
  opts?: { addToIndex?: boolean }
): string => {
  const tpl = findTemplate(templateId);

  // Persistent demo per template (per device)
  const demoMap = getDemoMap();
  const existingId = demoMap[templateId];

  if (existingId) {
    const existing = getInstance(existingId);
    if (existing && existing.sourceTemplateId === templateId) {
      return existingId;
    }
  }

  const instance = buildInstanceBase(tpl.name, tpl.id);
  instance.stages = tpl.stages;

  for (const seed of tpl.seedCandidates) {
    const id = uuid();
    const createdAt = nowIso();

    const candidate: Candidate = {
      id,
      createdAt,
      ...seed,
    };

    instance.candidatesById[id] = candidate;
    instance.candidateIdsByStage[candidate.stageId].push(id);

    instance.eventsByCandidateId[id] = [createCreatedEvent(`Candidate created in "${tpl.name}"`)];
  }

  saveInstance(instance);
  

  const addToIndex = opts?.addToIndex ?? false;

  if (!addToIndex) {
    demoMap[templateId] = instance.id;
    saveDemoMap(demoMap);
  }

  if (addToIndex) {
    upsertIndexItem({
    id: instance.id,
    name: instance.name,
    createdAt: instance.createdAt,
    sourceTemplateId: instance.sourceTemplateId ?? null,
  });
  }

  return instance.id;
};

export const createCustomInstance = (name: string): string => {
  const cleaned = name.trim();
  if (!cleaned) throw new Error("Workspace name is required.");

  const instance = buildInstanceBase(cleaned, null);

  // Use same stages as templates (avoid duplication)
  instance.stages = WORKSPACE_TEMPLATES[0]?.stages ?? [];

  saveInstance(instance);

  // Custom instances ALWAYS go into index ("My Workspaces")
  upsertIndexItem({
    id: instance.id,
    name: instance.name,
    createdAt: instance.createdAt,
    sourceTemplateId: null,
  });

  return instance.id;
};

/* 
   Candidate actions (with timeline)
 */
export type AddCandidateInput = Omit<Candidate, "id" | "createdAt" | "stageId"> & {
  stageId?: StageId;
};

export const addCandidate = (
  instanceId: string,
  input: AddCandidateInput
): { instance: WorkspaceInstance; candidateId: string } => {
  const instance = getInstance(instanceId);
  if (!instance) throw new Error("Workspace instance not found.");

  const candidateId = uuid();
  const createdAt = nowIso();
  const stageId: StageId = input.stageId ?? "new";

  const candidate: Candidate = {
    id: candidateId,
    createdAt,
    stageId,

    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    title: input.title.trim(),
    company: input.company?.trim(),

    location: input.location?.trim() || undefined,
    email: input.email?.trim() || undefined,
    linkedinUrl: input.linkedinUrl?.trim() || undefined,
    githubUrl: input.githubUrl?.trim() || undefined,
    portfolioUrl: input.portfolioUrl?.trim() || undefined,
    tags: input.tags?.filter(Boolean).map((t) => t.trim()) || undefined,
  };

  instance.candidatesById[candidateId] = candidate;
  instance.candidateIdsByStage[stageId] = [
    candidateId,
    ...(instance.candidateIdsByStage[stageId] ?? []),
  ];

  instance.eventsByCandidateId[candidateId] = [createCreatedEvent("Candidate created")];

  saveInstance(instance);
  return { instance, candidateId };
};

const removeIdFromStage = (ids: string[], id: string) => ids.filter((x) => x !== id);

export const moveCandidate = (
  instanceId: string,
  candidateId: string,
  toStageId: StageId,
  reason: string
): WorkspaceInstance => {
  const instance = getInstance(instanceId);
  if (!instance) throw new Error("Workspace instance not found.");

  const candidate = instance.candidatesById[candidateId];
  if (!candidate) throw new Error("Candidate not found.");

  const trimmedReason = reason.trim();
  if (!trimmedReason) throw new Error("Reason is required to move a candidate.");

  const fromStageId = candidate.stageId;
  if (fromStageId === toStageId) return instance;

  instance.candidateIdsByStage[fromStageId] = removeIdFromStage(
    instance.candidateIdsByStage[fromStageId] ?? [],
    candidateId
  );

  instance.candidateIdsByStage[toStageId] = [
    candidateId,
    ...(instance.candidateIdsByStage[toStageId] ?? []),
  ];

  candidate.stageId = toStageId;
  instance.candidatesById[candidateId] = candidate;

  instance.eventsByCandidateId[candidateId] = [
    ...(instance.eventsByCandidateId[candidateId] ?? []),
    createStageMovedEvent(fromStageId, toStageId, trimmedReason),
  ];

  saveInstance(instance);
  return instance;
};

export const addCandidateNote = (
  instanceId: string,
  candidateId: string,
  content: string
): WorkspaceInstance => {
  const instance = getInstance(instanceId);
  if (!instance) throw new Error("Workspace instance not found.");

  if (!instance.candidatesById[candidateId]) throw new Error("Candidate not found.");

  const trimmed = content.trim();
  if (!trimmed) throw new Error("Note content cannot be empty.");

  instance.eventsByCandidateId[candidateId] = [
    ...(instance.eventsByCandidateId[candidateId] ?? []),
    createNoteEvent(trimmed),
  ];

  saveInstance(instance);
  return instance;
};

export const getCandidateTimeline = (instanceId: string, candidateId: string): CandidateEvent[] => {
  const instance = getInstance(instanceId);
  if (!instance) return [];
  const events = instance.eventsByCandidateId[candidateId] ?? [];
  return [...events].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
};

/* 
   Cleanup helpers (DEV buttons)
 */
export const clearDemoInstances = () => {
  // delete only instances created from templates (sourceTemplateId != null)
  const keysToDelete: string[] = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key) continue;
    if (!key.startsWith("hps_instance_")) continue;

    const raw = localStorage.getItem(key);
    const inst = safeJsonParse<WorkspaceInstance | null>(raw, null);
    if (inst?.sourceTemplateId) keysToDelete.push(key);
  }

  keysToDelete.forEach((k) => localStorage.removeItem(k));
  localStorage.removeItem(DEMO_MAP_KEY);
};

export const clearAllHpsData = () => {
  localStorage.removeItem(INDEX_KEY);

  const keysToDelete: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key) continue;
    if (key.startsWith("hps_instance_")) keysToDelete.push(key);
  }
  keysToDelete.forEach((k) => localStorage.removeItem(k));
  localStorage.removeItem(DEMO_MAP_KEY);
};

export const toggleStar = (
  instanceId: string,
  candidateId: string
): WorkspaceInstance => {
  const instance = getInstance(instanceId);
  if (!instance) throw new Error("Workspace instance not found.");

  const candidate = instance.candidatesById[candidateId];
  if (!candidate) throw new Error("Candidate not found.");

  candidate.isStarred = !candidate.isStarred;

  const event: CandidateEvent = {
    id: uuid(),
    type: candidate.isStarred ? "starred" : "unstarred",
    createdAt: nowIso(),
    payload: {},
  };

  instance.candidatesById[candidateId] = candidate;

  instance.eventsByCandidateId[candidateId] = [
    ...(instance.eventsByCandidateId[candidateId] ?? []),
    event,
  ];

  saveInstance(instance);

  return instance;
};

export const updateCandidate = (
  instanceId: string,
  candidateId: string,
  input: UpdateCandidateInput
): WorkspaceInstance => {
  const instance = getInstance(instanceId);
  if (!instance) throw new Error("Workspace instance not found.");

  const candidate = instance.candidatesById[candidateId];
  if (!candidate) throw new Error("Candidate not found.");

  const updatedCandidate: Candidate = {
    ...candidate,
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    title: input.title.trim(),
    company: input.company?.trim() || undefined,
    location: input.location?.trim() || undefined,
    email: input.email?.trim() || undefined,
    linkedinUrl: input.linkedinUrl?.trim() || undefined,
    githubUrl: input.githubUrl?.trim() || undefined,
    portfolioUrl: input.portfolioUrl?.trim() || undefined,
    tags: input.tags?.filter(Boolean).map((t) => t.trim()) || candidate.tags,
  };

  instance.candidatesById[candidateId] = updatedCandidate;

  const event: CandidateEvent = {
    id: uuid(),
    type: "updated",
    createdAt: nowIso(),
    payload: {},
  };

  instance.eventsByCandidateId[candidateId] = [
    ...(instance.eventsByCandidateId[candidateId] ?? []),
    event,
  ];

  saveInstance(instance);
  return instance;
};
