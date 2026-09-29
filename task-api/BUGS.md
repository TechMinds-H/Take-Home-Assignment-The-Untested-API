# Bug Report

## Bug 1: Pagination returns wrong page

**Where:** `src/services/taskService.js`, `getPaginated` function

**Expected behavior:** `GET /tasks?page=1&limit=10` should return the first 10 tasks.

**Actual behavior:** It returned an empty array, even when tasks existed.

**How I found it:** Wrote a unit test creating 2 tasks and calling `getPaginated(1, 10)`. Expected 2 results, got 0.

**Why it happens:** The code calculated `offset = page * limit`. For page 1, that's `1 * 10 = 10`, which skips the first 10 tasks entirely. Page numbering should start counting from 0 internally, so page 1 needs an offset of 0.

**Fix:** Changed the offset formula to `(page - 1) * limit`. Verified with a passing test (`pagination page 1 should return items`).

## Bug 2: Completing a task resets its priority (NOT FIXED)

**Where:** `src/services/taskService.js`, `completeTask` function

**Expected behavior:** Marking a task complete should only change `status` and `completedAt`.

**Actual behavior:** It also silently resets `priority` to `"medium"`, even if the task was originally `"high"` priority.

**How I found it:** Created a task with `priority: "high"`, called complete on it, and saw the priority change in the response.

**Fix (not applied):** Remove the line `priority: 'medium',` inside the `completeTask` function, so the original priority stays untouched.