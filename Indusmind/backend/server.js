const express = require("express");
const path = require("path");
const cors = require("cors");
const { exec } = require("child_process");

require("./db"); // DB connection
const MachineData = require("./models/MachineData");

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ───────────────────────────────────────────────
const allowedOrigins = [
  "https://college-project-six-sage.vercel.app",
  "http://localhost:3000",
];
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked: ${origin}`));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
}));
app.use(express.json());

// ─── Python command detection (python3 on Linux, python on Windows) ──
let PYTHON_CMD = null;

function detectPython() {
    return new Promise((resolve) => {
        exec("python3 --version", (err) => {
            if (!err) {
                PYTHON_CMD = "python3";
                console.log("✔ Using python3");
                return resolve();
            }
            exec("python --version", (err2) => {
                if (!err2) {
                    PYTHON_CMD = "python";
                    console.log("✔ Using python");
                    return resolve();
                }
                console.error("✖ No Python interpreter found on this system.");
                PYTHON_CMD = "python"; // fallback, will fail at runtime with clear error
                resolve();
            });
        });
    });
}

// ─── ML script path (now lives INSIDE backend/) ─────────────
const ML_SCRIPT = path.join(__dirname, "ml-engine", "predict_api.py");

// ─── Health check ────────────────────────────────────────────
app.get("/", (_req, res) => {
    res.json({ status: "IndusMind Backend is Running" });
});

// ─── Store simulated machine data ────────────────────────────
app.post("/api/machine-data", async (req, res) => {
    try {
        const data = new MachineData(req.body);
        await data.save();
        console.log("Data saved to DB:", data);
        res.status(200).json({ message: "Data stored successfully", data });
    } catch (error) {
        console.error("DB Error:", error.message);
        res.status(500).json({ error: "Database error", details: error.message });
    }
});

// ─── Prediction endpoint ─────────────────────────────────────
app.post("/api/predict", (req, res) => {
    const inputData = req.body;

    // Validate input exists
    if (!inputData || Object.keys(inputData).length === 0) {
        return res.status(400).json({ error: "Request body is empty or missing" });
    }

    // Safely serialize JSON and escape for shell
    let jsonString;
    try {
        jsonString = JSON.stringify(inputData);
    } catch (e) {
        return res.status(400).json({ error: "Invalid JSON in request body" });
    }

    // Escape the JSON string for safe shell usage
    // Use base64 piping to avoid all shell-escaping issues
    const base64Input = Buffer.from(jsonString).toString("base64");

    // Build a command that decodes base64 → pipes into python script
    const cmd = `${PYTHON_CMD} -c "import sys,base64;sys.stdout.buffer.write(base64.b64decode('${base64Input}'))" | ${PYTHON_CMD} "${ML_SCRIPT}"`;

    exec(cmd, { timeout: 30000, maxBuffer: 1024 * 1024 }, (error, stdout, stderr) => {
        // Log stderr for debugging (Python warnings, etc.)
        if (stderr) {
            console.warn("Python stderr:", stderr);
        }

        if (error) {
            console.error(`Python execution failed (code ${error.code}):`, error.message);
            return res.status(500).json({
                error: "ML execution failed",
                details: stderr || error.message,
            });
        }

        // Parse Python output
        const trimmed = stdout.trim();
        if (!trimmed) {
            return res.status(500).json({ error: "ML script returned no output" });
        }

        try {
            const result = JSON.parse(trimmed);
            return res.json(result);
        } catch (parseError) {
            console.error("JSON parse error. Raw output:", trimmed);
            return res.status(500).json({
                error: "Failed to parse ML response",
                raw: trimmed,
            });
        }
    });
});

// ─── Start server ────────────────────────────────────────────
detectPython().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`📂 ML script: ${ML_SCRIPT}`);
    });
});
