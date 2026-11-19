# DSA Quest – Master the Data Structures

> "Don't just learn data structures. Play with them, visualize them, and master them!"

**DSA Quest** is a modern, gamified, animation-rich educational web application built with **React**, **TypeScript**, and **Tailwind CSS**. It combines the addictive progression of **Duolingo**, the live algorithm simulation of **Visualgo**, and the hands-on coding challenges of **LeetCode**.

---

## 🌟 Supported Modules

1. **HashMap Explorer**
   - 10-bucket associative array visualization.
   - Separate Chaining (linked chains) and Open Addressing (Linear Probing).
   - Configurable hash functions: Sum of ASCII, Polynomial Rolling Hash, First Char ASCII.
   - Insert, Search, and Delete with step-by-step ASCII hash math calculation.

2. **HashSet Adventure**
   - Mathematical set uniqueness guarantees.
   - Visual duplicate element detection & rejection animation with red alerts.
   - Add, Contains, and Remove operations with O(1) average time complexity.
   - Interactive streaming duplicate number identifier challenge.

3. **Min Heap Master**
   - Simultaneous, synchronized **Complete Binary Tree (SVG)** and **1D Array** visualizations.
   - Insert operation with parent comparison and bubble-up (swim) swaps.
   - Extract-Min operation with root removal and bubble-down (sink) swaps with the smaller child.
   - Bottom-up O(N) linear-time Heapify construction from arbitrary arrays.

4. **Index Heap Challenge (Indexed Min Heap)**
   - The ultimate priority queue data structure.
   - Three parallel, color-coded arrays:
     - `pq[]`: heap position → item ID.
     - `qp[]`: item ID → heap position (inverse pointer array).
     - `keys[]`: item ID → priority value.
   - Live continuous validation indicator for the invariant: **`qp[pq[i]] == i`**.
   - O(1) position lookup and O(log N) `changeKey` (swim/sink) and arbitrary `delete`.

---

## 🎮 Gamification & Game Modes

- **Progression & XP**: Streaks, levels, ranks (from Novice Coder to Grandmaster), coins, and confetti celebrations.
- **7-Level Learning Path**:
  - Level 1: Understand Concept (Comprehensive guide, time complexity table, production use cases).
  - Level 2: Visual Simulation (Step-by-step recorded animation timeline).
  - Level 3: Manual Operations (Hands-on parameter experiments).
  - Level 4: Underlying Code (Line-by-line synchronized execution in Java, Python, and C++).
  - Level 5: Interactive Challenges (LeetCode-style problems with live test runner).
  - Level 6: Real-World Mini-Projects.
  - Level 7: Final Certification Mastery Test.
- **3 Special Game Modes**:
  1. *Mode 1: Predict the Next Step*: Test your foresight on internal array transitions.
  2. *Mode 2: Fix the Broken Structure*: Identify and repair broken invariants.
  3. *Mode 3: Speed Challenge Blitz*: 45-second rapid-fire algorithmic quiz.
- **10 Collectible Achievement Badges**: Hash Hunter, Duplicate Detective, Heap Hero, Index Master, DSA Legend, and more.
- **Weekly Tournament Leaderboard**: Global ranks and streak rewards.
- **Web Audio Sound Effects**: Retro/modern audio feedback synthesized via Web Audio API.

---

## 🛠️ Real-World Mini-Projects

- **HashMap**: *Student Marks & Frequency Tracker* — O(1) ID lookup and grade frequency distribution.
- **HashSet**: *Live Unique Username Validator* — Real-time availability checks with suggested alternatives.
- **Min Heap**: *OS CPU Priority Task Scheduler* — Kernel process dispatcher selecting highest-urgency tasks.
- **Index Heap**: *Hospital Emergency Room (ER) Triage* — Dynamically elevates deteriorating patients from urgency 4 to 1 in O(log N).

---

## 🚀 Getting Started

The project is already initialized, built, and running in this directory!

```bash
# Run development server
npm run dev

# Build for production
npm run build
```

Open your browser at:
`http://localhost:5173/`

