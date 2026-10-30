# C for cFS — Interactive Documentation & Learning Site

A comprehensive, self-contained documentation site and interactive course designed specifically to teach **C for NASA's core Flight System (cFS)**.

---

## 🚀 Quick Start

You can view the documentation site in any web browser either directly via file URL or by running the local server.

### Option 1: Local HTTP Server (Recommended)
Run the included launcher script:
```bash
./run_doc_server.sh
```
Or with a custom port:
```bash
./run_doc_server.sh 8080
```
Then open [http://localhost:8080](http://localhost:8080) in your browser.

### Option 2: Direct File Access
Open the file directly in your browser:
```
file:///home/obin7/C/docs/index.html
```
*(On Windows via WSL: `\\wsl.localhost\Ubuntu\home\obin7\C\docs\index.html` or through your browser's file picker)*

---

## 📚 Curriculum Structure

The site covers **5 core phases** and **18 in-depth topics**, strictly focused on the embedded C subset and patterns required for NASA flight software:

### **Phase 1 · Low-Level Foundations**
- **Topic 1.1: Exact-Width Types & Endianness** (`p1t1`)
  - `<stdint.h>`, fixed widths, endianness differences (Big vs Little), byte-swapping with POSIX and bit shifts.
- **Topic 1.2: Pointers in Depth** (`p1t2`)
  - Address-of, dereferencing, struct pointer traversal (`->`), `void*` casting for raw buffers, function pointers and jump tables.
- **Topic 1.3: Structs, Unions & Memory Layout** (`p1t3`)
  - Memory alignment, padding, compiler packing (`#pragma pack`), bitfields, unions, and memory manipulation (`memcpy`, `memset`).

### **Phase 2 · Safety-Critical C & Robustness**
- **Topic 2.1: Deterministic Memory Management** (`p2t1`)
  - Why `malloc`/`free` are banned in flight loops, static allocation patterns, arena/pool allocators.
- **Topic 2.2: Defensive Programming & Error Handling** (`p2t2`)
  - NASA Power of 10 rules, MISRA C principles, input validation, integer overflow protection, cFE status return codes (`CFE_Status_t`).
- **Topic 2.3: Hardware Modifiers (`volatile`, `const`, `static`)** (`p2t3`)
  - Hardware register access with `volatile`, const correctness, file-scoped encapsulation with `static`.

### **Phase 3 · Systems & RTOS Patterns**
- **Topic 3.1: Concurrency & Thread Safety** (`p3t1`)
  - Multi-tasking, race conditions, mutexes (`pthread_mutex_t`), semaphores, priority inversion and priority ceiling protocols.
- **Topic 3.2: Inter-Task Communication (IPC)** (`p3t2`)
  - Message queues, producer-consumer patterns, non-blocking pipe polling.
- **Topic 3.3: Timers & Clocks** (`p3t3`)
  - POSIX `clock_gettime`, monotonic clocks, periodic timer intervals for spacecraft telemetry loops.

### **Phase 4 · cFS Architecture & Core APIs**
- **Topic 4.1: cFE Core Services Overview** (`p4t1`)
  - Executive Services (`CFE_ES`), Event Services (`CFE_EVS`), Software Bus (`CFE_SB`), Table Services (`CFE_TBL`), Time Services (`CFE_TIME`).
- **Topic 4.2: Software Bus (`CFE_SB`)** (`p4t2`)
  - Message ID definitions, pipe creation (`CFE_SB_CreatePipe`), message subscriptions, and pub/sub message loops.
- **Topic 4.3: App Structure & Lifecycle** (`p4t3`)
  - Anatomy of a cFS app: `App_Main`, `App_Init`, `CFE_ES_RunLoop`, housekeeping loops, and clean shutdown with `CFE_ES_Exit`.
- **Topic 4.4: Command Dispatch Tables** (`p4t4`)
  - Command execution counters, function pointer dispatch tables, opcode routing.
- **Topic 4.5: Table & Event Services** (`p4t5`)
  - Event types (`CFE_EVS_EventType_INFORMATION`, `ERROR`), binary event filters, and flight table management.
- **Topic 4.6: CCSDS Packets in C** (`p4t6`)
  - Space Packet Protocol: primary header bit layout (Stream ID, Sequence Count, Packet Length), secondary headers, telemetry & telecommand payloads.

### **Phase 5 · Tooling & Verification**
- **Topic 5.1: CMake for cFS** (`p5t1`)
  - Application registration, modular include paths, and toolchain integration.
- **Topic 5.2: Static & Dynamic Analysis** (`p5t2`)
  - Compiler warning flags (`-Wall -Wextra`), static analysis tools (PC-lint, Clang-Tidy), and runtime sanitizers (ASan, UBSan).
- **Topic 5.3: Unit Testing with UT-Assert** (`p5t3`)
  - The cFS `UT-Assert` framework, replacing standard `assert()`, and test runner structures.

---

## 🛠 Features of the Documentation Site

- **Dual Color Themes**: Choose between **Black Metal** (pure dark mission-control aesthetic) and **Gruvbox Dark Hard**.
- **Interactive Quizzes**: Multiple-choice knowledge checks at the end of each topic with immediate feedback and explanations.
- **Hands-on Practice Editors**: In-browser code editors with starter templates and reset capabilities.
- **Compiler Explorer (Godbolt) Integration**: One-click **▶ Godbolt** button on every code snippet to inspect generated assembly or test compilation in GCC with `-O0 -std=c99 -Wall -Wextra`.
- **One-Click Code Copy**: Quick copy buttons on all code blocks.
- **Live Search**: Instant topic filtering in the sidebar.
- **Progress Tracking**: Tracks your completed topics in browser `localStorage`.
- **Keyboard Navigation**: Use **Left Arrow** (`←`) and **Right Arrow** (`→`) to flip between sections.
