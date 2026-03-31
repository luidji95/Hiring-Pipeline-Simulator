#  Hiring Pipeline Simulator

A modern, local-first recruitment workflow simulator built with **React + TypeScript**, designed to model real-world hiring pipelines with advanced state management, timeline tracking, and interactive UI.

---

##  Overview

Hiring Pipeline Simulator is a Kanban-based application that allows you to:

- Track candidates across multiple hiring stages
- Maintain a full audit trail of candidate actions
- Simulate real recruitment workflows
- Analyze pipeline behavior with structured data

This project focuses on **clean architecture, normalized state, and realistic product behavior**, rather than just UI.

---

##  Core Concepts

###  Pipeline Workflow

Candidates move through stages:

New → Screening → HR → Technical → Final → Offer → Hired / Rejected

---

###  Candidate Timeline (Audit Trail)

Each candidate has a full history:

- Created
- Stage changes (with reason)
- Notes
- Starred / Unstarred
- Updates

 This ensures **traceability and realistic hiring flow simulation**

---

###  Normalized Data Structure

Instead of storing everything in arrays:

- `candidatesById`
- `candidateIdsByStage`
- `eventsByCandidateId`

This prevents:
- data duplication
- sync issues
- complex mutations

---

##  Features

###  Core Features

- Multi-stage Kanban board
- Candidate creation & editing
- Move candidates between stages (with reason)
- Delete candidates
- Clear entire pipeline
- Star / prioritize candidates
- Candidate detail page with timeline

---

###  Search & Filtering

- Global search (name, location, etc.)
- Filter by:
  - location
  - tags
  - starred candidates
- Sorting:
  - newest / oldest
  - name A–Z / Z–A

---

###  Board Controls

Dedicated control panel for:

- filtering
- sorting
- clearing filters

---

###  UI/UX

- Modal-based interactions (create, edit, move, delete)
- Consistent dialog system
- Clean separation of concerns
- Responsive layout

---

###  Local Persistence

- Uses `localStorage`
- Multiple isolated workspaces
- No backend required

---

##  Tech Stack

- React
- TypeScript
- React Router
- Zod (validation)
- LocalStorage (persistence)
- Custom UI Components

---

##  Notes

- This is a simulation tool, not a production ATS
- All data is stored locally
- Designed for demonstration and portfolio purposes

---
