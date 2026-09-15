# Interactive Live Quiz System

**A real-time classroom quiz platform with separate teacher and student interfaces — from live question delivery to automated prize payout.**

A full-stack web app built for live classroom use: the teacher controls question flow and pacing, students answer in real time, and winners are rewarded automatically after each game.

## Key features

- **Dual-interface real-time system** — a teacher view that pushes questions and controls progress, and a student view that displays questions and answer status in sync (real-time via WebSocket / Socket.io).  
- **Ready-to-use question bank** — imports existing exam questions into a structured format for live delivery during class.  
- **Automated prize payout** — at game end, the system extracts the top three on the leaderboard and issues rewards automatically via the **LINE Points API**, replacing manual tallying and distribution.

## Tech highlights

- Front-end interface, back-end logic, and third-party API integration built end to end.  
- Stack: Node.js, Express, Socket.io, React.  
- **CI/CD via GitHub → Railway** — every push deploys to production automatically.



&nbsp;
