# User Management Documentation

## Overview
UrutiBiz backend implements robust user management with a strong focus on KYC (Know Your Customer) verification, multi-step document flows, and admin/user verification processes. Sensitive business logic is protected by KYC enforcement, and the system is designed for extensibility and compliance.

---

## User Verification & KYC

### Supported Verification Types
- National ID
- Passport
- Driving License
- Address
- Selfie (with liveness check)

### KYC Status Levels
- `unverified`: No KYC submitted
- `basic`: Some KYC submitted, not all required
- `pending_review`: All required KYC submitted, awaiting admin review
- `verified`: All required KYC approved
- `rejected`, `suspended`, `expired`: Other states for compliance

### Multi-Document Flow
- Users can submit multiple verification types.
- Address and selfie/liveness are supported as part of the flow.
- OCR and liveness checks are integrated (currently stubbed, ready for real APIs).

### Verification Data Model
- See `src/types/userVerification.types.ts` for type definitions.
- Each verification record includes type, status, document info, OCR data, and liveness score.

---

## KYC Enforcement in Business Logic
- **Bookings**: Only fully KYC-verified users can create bookings.
- **Product Creation**: Only fully KYC-verified users can create products.
- (Guidance provided for enforcing KYC in payouts, messaging, reviews, etc. as those modules are added.)

---

## Admin Verification Management
- Admin endpoints for listing, viewing, and reviewing verifications:
  - `GET /admin/verifications` — List all verifications
  - `GET /admin/verifications/:id` — Get verification details
  - `POST /admin/verifications/:id/review` — Approve/reject verifications
- All new routes are registered in the main router.

---

## Notifications
- Notification logic is triggered on KYC status changes (stubbed for email/SMS/in-app, ready for integration).

---

## User Profile API
- Exposes KYC progress and verification history in user profile responses.

---

## Extensibility & Next Steps
- KYC enforcement can be extended to new sensitive flows as they are added.
- Real OCR/liveness APIs and notification services can be integrated.
- Admin UI for verification management can be built using the provided endpoints.

---

## Key Files
- `src/types/userVerification.types.ts` — Type definitions
- `src/services/userVerification.service.ts` — Verification logic
- `src/controllers/userVerification.controller.ts` — User verification endpoints
- `src/controllers/adminVerification.controller.ts` — Admin verification endpoints
- `src/routes/userVerification.routes.ts`, `src/routes/adminVerification.routes.ts` — Route registration
- `src/utils/kycAutomation.ts` — OCR/liveness stubs
- `src/services/notification.service.ts` — Notification logic

---

## Summary
The user management system is production-ready for multi-step KYC, admin review, and enforcement in sensitive business logic. It is designed for easy extension and compliance with regulatory requirements.
