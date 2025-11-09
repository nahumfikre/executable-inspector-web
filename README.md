# Executable Inspector – Full Setup & Run Instructions

This project provides a web interface for a C++ executable inspector. The backend (Node/Express) runs the compiled C++ tool, and the frontend (React/Vite) lets users upload a binary and view the inspector’s output in the browser.

---

## Full Setup (C++, Backend, Frontend)

# 1. Clone and build the C++ inspector
cd ~/Desktop/Python\ Projects
git clone https://github.com/nahumfikre/exe-inspector
cd exe-inspector
make
./bin/exe_inspector /bin/ls    # Optional test to confirm it works

# 2. Clone the web project (if not already)
cd ~/Desktop/Python\ Projects
git clone https://github.com/nahumfikre/executable-inspector-web
cd executable-inspector-web

# 3. Create tools folder and copy compiled C++ binary into it
mkdir -p tools
cp ../exe-inspector/bin/exe_inspector tools/exe_inspector
chmod +x tools/exe_inspector

# 4. Start the backend server (Express)
cd server
npm install
node server.js   # Terminal will show: server listening on http://localhost:3001
# Leave this terminal open and running.

# 5. Open a second terminal for the frontend
cd ~/Desktop/Python\ Projects/executable-inspector-web/web
npm install
npm run dev      # Terminal will show a local URL, usually http://localhost:5173

# 6. Open the browser and go to the frontend URL (e.g. http://localhost:5173)
# Upload a binary such as /bin/ls or /usr/bin/clang to see its header information.

---

## Optional: Build production frontend and serve it from Express

cd ~/Desktop/Python\ Projects/executable-inspector-web/web
npm run build    # Creates web/dist

cd ../server
node server.js   # Visit http://localhost:3001 – frontend is served from dist/

---

## Notes

- tools/exe_inspector is intentionally not committed to Git.
- server/uploads/ stores temporary files and is gitignored.
- web/node_modules, server/node_modules, dist/, and macOS system files (.DS_Store) are all ignored via .gitignore.
- Tested on macOS (Apple Silicon). The C++ inspector supports Mach-O and FAT binaries; PE parsing works with Windows binaries.

