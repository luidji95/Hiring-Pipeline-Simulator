import type { WorkspaceTemplate, Stage, StageId } from "./workspace.types";

export const HR_STAGES: Stage[] = [
  { id: "new", label: "New Applicants" },
  { id: "screening", label: "Screening" },
  { id: "hr_interview", label: "HR Interview" },
  { id: "technical_interview", label: "Technical Interview" },
  { id: "final_interview", label: "Final Interview" },
  { id: "offer", label: "Offer Extended" },
  { id: "hired", label: "Hired" },
  { id: "rejected", label: "Rejected" },
];

const makeCandidateSeed = (c: {
  firstName: string;
  lastName: string;
  title: string;
  company: string;
  stageId: StageId;
  location?: string;
  email?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  tags?: string[];
}) => c;

export const WORKSPACE_TEMPLATES: WorkspaceTemplate[] = [
  {
    id: "tpl_frontend",
    name: "Frontend Hiring Pipeline",
    stages: HR_STAGES,
    seedCandidates: [
      makeCandidateSeed({
        firstName: "Mina",
        lastName: "Jovanović",
        title: "Frontend Developer",
        company: "BluePeak",
        stageId: "new",
        location: "Belgrade, RS",
        linkedinUrl: "https://linkedin.com/in/mina-jovanovic",
        githubUrl: "https://github.com/minaj",
        tags: ["React", "TypeScript", "UI polish"],
      }),
      makeCandidateSeed({
        firstName: "Luka",
        lastName: "Stojanović",
        title: "Frontend Developer",
        company: "Nebula Labs",
        stageId: "screening",
        location: "Novi Sad, RS",
        linkedinUrl: "https://linkedin.com/in/luka-stojanovic",
        githubUrl: "https://github.com/lukast",
        tags: ["JS fundamentals", "Testing"],
      }),
      makeCandidateSeed({
        firstName: "Sara",
        lastName: "Petrović",
        title: "Frontend Developer",
        company: "Orbit Commerce",
        stageId: "hr_interview",
        location: "Niš, RS",
        linkedinUrl: "https://linkedin.com/in/sara-petrovic",
        portfolioUrl: "https://sarap.dev",
        tags: ["Communication", "Design sense"],
      }),
      makeCandidateSeed({
        firstName: "Nikola",
        lastName: "Ilić",
        title: "Frontend Developer",
        company: "Atlas Soft",
        stageId: "technical_interview",
        location: "Kragujevac, RS",
        githubUrl: "https://github.com/nikolai",
        tags: ["Performance", "React hooks"],
      }),
      makeCandidateSeed({
        firstName: "Teodora",
        lastName: "Marković",
        title: "Frontend Developer",
        company: "SignalWorks",
        stageId: "final_interview",
        location: "Belgrade, RS",
        linkedinUrl: "https://linkedin.com/in/teodora-markovic",
        tags: ["Leadership", "Ownership"],
      }),
    ],
  },
  {
    id: "tpl_product",
    name: "Product & Ops Pipeline",
    stages: HR_STAGES,
    seedCandidates: [
      makeCandidateSeed({
        firstName: "Ana",
        lastName: "Kovačević",
        title: "Product Manager",
        company: "Northwind",
        stageId: "new",
        location: "Belgrade, RS",
        linkedinUrl: "https://linkedin.com/in/ana-kovacevic",
        tags: ["Discovery", "Stakeholders"],
      }),
      makeCandidateSeed({
        firstName: "Marko",
        lastName: "Pavlović",
        title: "Product Manager",
        company: "Pulse Systems",
        stageId: "screening",
        location: "Novi Sad, RS",
        linkedinUrl: "https://linkedin.com/in/marko-pavlovic",
        tags: ["Metrics", "Roadmaps"],
      }),
      makeCandidateSeed({
        firstName: "Ivana",
        lastName: "Ristić",
        title: "Operations Lead",
        company: "Harbor Logistics",
        stageId: "hr_interview",
        location: "Pančevo, RS",
        tags: ["Process", "Execution"],
      }),
      makeCandidateSeed({
        firstName: "Stefan",
        lastName: "Đorđević",
        title: "Product Ops",
        company: "Aurora Studio",
        stageId: "technical_interview",
        location: "Belgrade, RS",
        tags: ["Systems thinking", "Automation"],
      }),
    ],
  },
];
