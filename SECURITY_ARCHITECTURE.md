# ArveX Hosting Security Architecture

## Goals

- Preserve the existing website UX and admin/customer behavior.
- Make authentication server-authoritative.
- Make browser refresh transparent to authenticated users.
- Keep administrator authentication and customer authentication logically separate.
- Keep maintenance mode separate from authentication.
- Prevent client-side role changes from granting privileges.
- Make logout and session revocation explicit server-side operations.

## Authentication model

### Customer

1. Email/password credentials are checked server-side.
2. Email verification / login OTP is required where configured.
3. A cryptographically random, opaque session ID is issued in an HttpOnly, Secure, SameSite cookie.
4. The session record is stored server-side and survives process restarts.
5. `/api/auth/me` is the only source used to re-hydrate the authenticated identity after a page refresh.

### Administrator

1. Admin credentials are checked server-side.
2. Admin OTP is mandatory.
3. A separate admin session is issued in an HttpOnly, Secure, SameSite cookie.
4. Existing signed admin tokens remain supported during the migration for compatibility with protected CMS calls.
5. Admin authorization is enforced server-side on every protected endpoint.

## Session rules

- Session IDs are generated with `crypto.randomBytes`.
- Only a hash of a session ID is persisted.
- Sessions have an absolute expiry and an idle timeout.
- Explicit logout revokes the server session and expires the cookie.
- Password reset revokes existing customer sessions.
- Admin re-authentication can revoke prior admin sessions.
- A refresh never creates a new identity and never clears a valid identity.

## Authorization

The browser may display or hide UI based on the role, but UI state is never a security boundary. Every privileged API route must authenticate the request and then authorize the requested action server-side.

## Maintenance mode

Maintenance is evaluated only after authentication has been resolved. It must never clear or mutate a session.

- Guest + maintenance ON -> maintenance page.
- Customer + maintenance ON -> maintenance page.
- Admin + maintenance ON -> normal site/admin access.

## Security controls

- Same-origin allowlist for state-changing authentication requests.
- Rate limits for login and OTP verification.
- OTP expiry and maximum attempt count.
- Password hashing with scrypt/Argon2id-compatible parameters.
- HttpOnly/Secure/SameSite cookies.
- Security response headers.
- No plaintext passwords or OTPs persisted.
- No authentication secrets written to logs.
- Audit trail for privileged actions as the next phase.

## Rollout

1. Implement the server-side persistent session layer on the `security-v2` branch.
2. Add authentication regression tests.
3. Validate build, type-check and server syntax.
4. Deploy to a staging/backup path first.
5. Test customer login -> refresh, admin login -> refresh, logout, OTP expiry, invalid role escalation and maintenance behavior.
6. Only then merge to `main`.

## Non-goals of this migration

- Do not redesign the website UI.
- Do not change hosting plans, pricing, CMS content or page routing.
- Do not use localStorage as an authority for authentication or authorization.
- Do not mix maintenance mode with session lifecycle.
