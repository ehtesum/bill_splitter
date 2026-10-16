# Memory & Performance Specification (MEMORY) — BillSplitter

## 1. Browser Memory Footprint
- **Target Heap Usage**: Under 15 MB JS heap memory under standard browser devtools profiling.
- **Garbage Collection Optimization**: Settlement graph solver instantiates fixed-size balance arrays rather than recursive object graphs to minimize transient GC allocations.

---

## 2. Rendering & State Bounds
- **List Virtualization**: Expense lists exceeding 50 items utilize `@tanstack/react-virtual` to keep active DOM nodes capped under 40 elements, preserving 60 FPS scrolling on mobile web browsers.
- **Memoized Graph Computation**: Debt simplification results are wrapped in `useMemo()` keyed to `[expenses, participants]` so re-renders of unrelated UI controls (e.g. toggling currency dropdown or theme modal) incur 0 ms re-computation time.
