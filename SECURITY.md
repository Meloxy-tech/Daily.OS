# Security Policy

## Supported versions

| Version | Supported |
| ------- | --------- |
| latest `main` | Yes |

## Reporting a vulnerability

If you discover a security issue, please **do not** open a public GitHub issue.

Email details to the repository maintainer with:

- A description of the issue
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

We aim to acknowledge reports within 72 hours and will coordinate a fix and disclosure timeline with you.

## Scope

In scope: authentication flows, API routes (`/api/*`), Supabase session handling, and data exposure via the sync endpoints.

Out of scope: third-party services (Supabase, OpenAI, Vercel) unless caused by misconfiguration documented in this repo.
