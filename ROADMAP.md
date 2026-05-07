# AidTrack OSS — Roadmap

This roadmap outlines the planned development of AidTrack OSS. Items are intentionally scoped to be achievable as independent pull requests.

---

## MVP (current)

The initial release covers the core humanitarian tracking workflow:

- [x] Email/password authentication with roles (Admin, Field Officer, Volunteer)
- [x] Beneficiary registration, editing, and archiving
- [x] Distribution event creation and management
- [x] Assign beneficiaries to distributions
- [x] Attendance verification (mark received with timestamp)
- [x] Basic reporting dashboard
- [x] CSV export of distribution records

---

## Version 1

Improvements to make the system more usable in the field:

- [ ] Search and filter beneficiaries by name, location, or vulnerability category
- [ ] Pagination for beneficiary and distribution lists
- [ ] Mobile-optimized attendance view (large tap targets, offline-friendly)
- [ ] User management page (admin can view and update user roles)
- [ ] Distribution summary page (per-distribution stats and progress)
- [ ] Beneficiary import via CSV upload
- [ ] Print-friendly attendance sheet

---

## Future Improvements

Longer-term ideas — open for community discussion:

- [ ] Multi-language support (i18n)
- [ ] Household-level view (group beneficiaries by household)
- [ ] Audit log (track who changed what and when)
- [ ] Duplicate detection for beneficiary registration
- [ ] Map view of distribution locations
- [ ] Email notifications for distribution events
- [ ] Dark mode
- [ ] Offline support / PWA

---

## Contributing to the Roadmap

Have an idea? Open a [GitHub Discussion](../../discussions) or create a [feature request issue](../../issues/new?template=feature_request.md).

Items on this roadmap are great candidates for contribution. If you'd like to work on something, comment on the relevant issue to claim it.
