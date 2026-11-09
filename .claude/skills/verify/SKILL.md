---
name: verify
description: Run lint, typecheck and production build to verify changes in this Next.js project. Use after finishing a change or before committing.
---

This project has no test framework, so verify changes with these steps in order, stopping to fix failures before continuing:

1. `npm run lint`
2. `npx tsc --noEmit`
3. `npm run build`

Report each step as pass/fail with the relevant error output. Do not claim success if any step failed or was skipped.
