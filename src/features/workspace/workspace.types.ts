export type StageId =
  | "new"
  | "screening"
  | "hr_interview"
  | "technical_interview"
  | "final_interview"
  | "offer"
  | "hired"
  | "rejected";

export type Stage = {
  id: StageId;
  label: string;
};

export type Candidate = {
  id: string;
  firstName: string;
  lastName: string;
  title: string; // role
  company?: string;
  location?: string;
  email?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  tags?: string[];
  stageId: StageId;
  createdAt: string; // ISO
};

// export type CandidateEventType = "created" | "stage_moved" | "note";

export type CandidateEvent =
  | {
      id: string;
      type: "created";
      createdAt: string; // ISO
      payload: {
        message?: string;
      };
    }
  | {
      id: string;
      type: "stage_moved";
      createdAt: string; // ISO
      payload: {
        fromStageId: StageId;
        toStageId: StageId;
        reason: string; // REQUIRED
      };
    }
  | {
      id: string;
      type: "note";
      createdAt: string; // ISO
      payload: {
        content: string;
      };
    };

export type WorkspaceInstance = {
  id: string;
  name: string;
  createdAt: string; // ISO
  sourceTemplateId?: string | null;

  stages: Stage[];

  //  normalized storage:
  candidatesById: Record<string, Candidate>;
  candidateIdsByStage: Record<StageId, string[]>;
  eventsByCandidateId: Record<string, CandidateEvent[]>;
};

export type WorkspaceIndexItem = {
  id: string;
  name: string;
  createdAt: string; // ISO
  sourceTemplateId?: string | null;
};

export type WorkspaceTemplate = {
  id: string; // "tpl_frontend"
  name: string; // label on landing template card
  stages: Stage[];
  seedCandidates: Omit<Candidate, "id" | "createdAt">[]; // id+createdAt generated on instance create
};
