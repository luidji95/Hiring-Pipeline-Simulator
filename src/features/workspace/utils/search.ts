import type { Candidate } from "../workspace.types";

const normalize = (value?: string) => value?.trim().toLowerCase() ?? "";

export const candidateMatchesSearch = (
  candidate: Candidate,
  searchTerm: string
) => {
  const query = normalize(searchTerm);

  if (!query) return true;

  const searchableValues = [
    candidate.firstName,
    candidate.lastName,
    `${candidate.firstName} ${candidate.lastName}`,
    candidate.title,
    candidate.company,
    candidate.location,
    candidate.email,
    ...(candidate.tags ?? []),
  ];

  return searchableValues.some((value) => normalize(value).includes(query));
};