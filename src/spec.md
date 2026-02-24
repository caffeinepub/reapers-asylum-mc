# Specification

## Summary
**Goal:** Fix the bug preventing membership applications from appearing in the admin panel.

**Planned changes:**
- Investigate and fix data flow between backend getPendingApplications() and frontend usePendingApplications hook
- Verify backend returns applications in the correct format with all required fields (principal, name, bio, timestamp, status)
- Add error handling, loading states, and empty state messaging to the Membership Applications section in AdminManagementPage
- Ensure submitted applications display correctly with approve/reject functionality

**User-visible outcome:** Admin users can view all pending membership applications in the admin panel and interact with approve/reject buttons. Clear feedback is shown when no applications exist or when errors occur.
