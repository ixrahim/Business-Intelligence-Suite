# 24-Hour Hackathon Timeline with Team Roles
**Project:** Privacy-Preserving Business Intelligence Platform (Midnight Blockchain)  
**Tech:** Midnight Network (ZKPs), Web app frontend, lightweight backend  

---

## Hour 0–1: Kickoff & Setup
- **Product Team**: Align on MVP scope, create pitch/demo plan, design basic UI wireframes.  
- **Contract Team**: Explore Midnight docs, scaffold smart contract project.  
- **Backend Team**: Set up API skeleton (Node/Express or FastAPI).  
- **Frontend Team**: Set up React/Tailwind project, create repo structure.  

---

## Hour 1–3: Core Data Model & Smart Contract Stubs
- **Contract Team**:  
  - Define schema for commitments (encrypted business data).  
  - Write initial smart contract stubs (upload + commit).  
- **Backend Team**:  
  - Define API endpoints for upload, query, comparison.  
- **Frontend Team**:  
  - Build upload form component + placeholder dashboard layout.  
- **Product Team**:  
  - Document user journey: Upload → Compare → Filter → Chat → Benchmark result.  

---

## Hour 3–6: Encryption & Data Upload Flow
- **Contract Team**:  
  - Implement on-chain commit logic.  
- **Backend Team**:  
  - Add client-side encryption support, connect upload API to contract.  
- **Frontend Team**:  
  - Wire upload form to API, show transaction/commit status.  
- **Product Team**:  
  - Collect example datasets, prepare dummy data for testing.  

---

## Hour 6–9: Metric Functions (Comparison/Ranking)
- **Contract Team**:  
  - Build simple ZK proof logic for ranking/comparison validation.  
- **Backend Team**:  
  - Implement metric calculation service (off-chain) + proof verification link.  
- **Frontend Team**:  
  - Create results table/section for rankings.  
- **Product Team**:  
  - Write usage story for how companies will “benchmark privately.”  

---

## Hour 9–12: Filter & Search Mechanism
- **Contract Team**:  
  - Ensure ZK proofs scale to multiple metrics.  
- **Backend Team**:  
  - Add filter/search endpoints to query results.  
- **Frontend Team**:  
  - Add filter/search UI components.  
- **Product Team**:  
  - Midpoint demo prep (storyline + slides).  

---

## Hour 12–15: Chat Integration
- **Backend Team**:  
  - Spin up WebSocket/SignalR server for chat.  
- **Frontend Team**:  
  - Build chat UI tab, integrate pseudonymous IDs from blockchain addresses.  
- **Contract Team**:  
  - Optional: Explore tying pseudonymous chat identity to on-chain proof of company.  
- **Product Team**:  
  - Define demo script for “two companies chatting about results.”  

---

## Hour 15–18: Frontend UI/UX Polish
- **Frontend Team**:  
  - Refine dashboard: upload area, results display, filters, chat.  
- **Backend Team**:  
  - Harden APIs (validation, error handling).  
- **Contract Team**:  
  - Test ZK flow end-to-end with backend.  
- **Product Team**:  
  - Draft README + submission notes.  

---

## Hour 18–21: End-to-End Integration
- **All Teams**: Connect frontend → backend → contracts → proofs.  
- **Product Team**: Dry run full flow with dummy data.  
- **Contract + Backend Teams**: Fix bugs in proof verification.  
- **Frontend Team**: Add basic loading/error states.  

---

## Hour 21–23: Polish & Demo Prep
- **Frontend Team**: Polish UI, add basic charts if time.  
- **Backend Team**: Optimize responses for smooth demo.  
- **Contract Team**: Final contract checks, deploy to testnet.  
- **Product Team**: Write final pitch script, record backup demo video.  

---

## Hour 23–24: Final Testing & Submission
- **All Teams**: Run live demo multiple times.  
- **Product Team**: Package submission (repo, docs, video, slides).  

---

# Stretch Goals
- Visualization (charts for rankings).  
- Multi-metric aggregation proofs.  
- Export benchmark reports (PDF/CSV).  
