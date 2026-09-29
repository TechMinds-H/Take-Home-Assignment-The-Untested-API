# Notes
- If I had more time, I'd test concurrent updates and edge cases like page=0 or negative numbers.
- What surprised me: `completeTask` silently overwrites priority — easy to miss without a specific test for it.
- Before shipping: I'd ask whether `assignee` should be validated against a real list of existing users, and whether reassigning an already-assigned task should require confirmation.