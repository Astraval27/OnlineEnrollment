# E-ENROLL | K-12 Basic Education Enrollment System

A complete React + TypeScript web application for K-12 Basic Education enrollment and learner management (Kindergarten, Elementary, Junior High, and Senior High School), built with Vite and Tailwind CSS.

---

## 🚀 Quick Start Guide (VS Code)

### 1. Prerequisites

Before running this project on your local machine, make sure you have **Node.js** installed:

- **Node.js**: Version `18.x`, `20.x`, or `22.x` (LTS recommended).
- **npm**: Comes bundled automatically with Node.js.

To verify if Node.js is already installed, open your terminal or command prompt and run:
```bash
node -v
npm -v
```
> If not installed, download the installer from: **[https://nodejs.org/](https://nodejs.org/)** (Choose the **LTS** version).

---

### 2. Open Project in VS Code

1. Launch **Visual Studio Code**.
2. Click **File** > **Open Folder...** (or press `Ctrl+K Ctrl+O` on Windows / `Cmd+O` on macOS).
3. Select this project root folder (the folder containing `package.json`).

---

### 3. Open the Integrated Terminal in VS Code

- Press **`Ctrl + \``** (Backtick) on Windows/Linux, or **`Cmd + \``** on macOS.
- Or navigate to the top menu: **Terminal** > **New Terminal**.

---

### 4. Install Dependencies

In the VS Code terminal, run:

```bash
npm install
```

This installs all dependencies listed in `package.json` into a local `node_modules` folder (takes ~30-60 seconds).

---

### 5. Launch the Development Server

Start the local server with:

```bash
npm run dev
```

You will see output in the terminal like this:

```
  VITE v8.3.0  ready in 240 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: http://<your-ip>:3000/
  ➜  press h + enter to show help
```

---

### 6. Open in Your Browser

- Hold `Ctrl` (or `Cmd` on macOS) and click the link in your terminal: **`http://localhost:3000/`**
- Or manually open your browser (Chrome, Edge, Firefox, Safari) and navigate to:
  ```
  http://localhost:3000
  ```

---

## 🛠️ Available Scripts

In your VS Code terminal, you can run:

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the local development server with hot-reload at `http://localhost:3000` |
| `npm run build` | Compiles and builds optimized static assets into the `dist/` directory |
| `npm run preview` | Locally previews the production build from `dist/` |
| `npm run lint` | Runs the TypeScript compiler check (`tsc --noEmit`) to verify types |

---

## 💡 Troubleshooting & FAQ

### 1. "Scripts are disabled on this system" (Windows PowerShell error)
If Windows blocks running `npm` or `vite` with a script policy error, open PowerShell as Administrator and run:
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```
Or switch your VS Code terminal dropdown from **PowerShell** to **Command Prompt (cmd)** or **Git Bash**.

### 2. Port 3000 is already in use
If another application is using port 3000, you can run:
```bash
npx vite --port 3001
```
Or edit `package.json` to change `--port=3000` to `--port=3001`.

### 3. Are external databases or APIs required to run?
**No.** All backend mock endpoints (LRN queries, student admissions, requirements upload status, etc.) are embedded directly inside `vite.config.ts`. The application runs 100% self-contained locally right after `npm install` and `npm run dev`!

---

## 📂 Project Structure

```
├── public/                 # Static assets & public images
├── src/
│   ├── assets/             # Brand logos and iconography
│   ├── components/         # Reusable UI components & screen layouts
│   │   ├── homepage/       # Public admission guide & landing sections
│   │   ├── modals/         # DepEd forms & student detail modals
│   │   ├── screens/        # Student Directory, Roadmap, Applications, Billing, etc.
│   │   ├── Sidebar.tsx     # Navigation sidebar
│   │   └── TopHeader.tsx   # Header controls, role switcher, notifications
│   ├── data/               # Mock data (learners, courses, transactions, requirements)
│   ├── types.ts            # TypeScript interfaces & system types
│   ├── App.tsx             # Root application orchestrator
│   └── main.tsx            # React DOM entry point
├── index.html              # HTML entry point
├── package.json            # Project dependencies and npm scripts
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite build configuration + local mock API middleware
```

Enjoy developing locally!
