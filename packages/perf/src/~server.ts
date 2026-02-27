import fs from "node:fs/promises";
import http from "node:http";
import path from "node:path";

async function serverFn(req: http.IncomingMessage, res: http.ServerResponse) {
  const url = new URL(req.url || "", `http://${req.headers.host}`);

  try {
    // 1. GET /tests - Scan directories
    if (url.pathname === "/tests" && req.method === "GET") {
      const entries = await fs.readdir("./results", { withFileTypes: true });
      const folders = entries.filter((e) => e.isDirectory()).map((e) => e.name);

      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify(folders));
    }

    // 2. GET /data/:testName - Fetch specific JSON
    if (url.pathname.startsWith("/data/") && req.method === "GET") {
      const testName = url.pathname.split("/")[2];
      const filePath = path.join("./results", testName, "data.json");
      const data = await fs.readFile(filePath);

      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(data);
    }

    // 3. Static File Server (Serve index.html for everything else)
    const publicPath = path.join(process.cwd(), url.pathname === "/" ? "index.html" : url.pathname);
    const fileContent = await fs.readFile(publicPath);

    // Simple content-type detection
    const ext = path.extname(publicPath);
    const contentType = ext === ".html" ? "text/html" : "text/plain";

    res.writeHead(200, { "Content-Type": contentType });
    res.end(fileContent);
  } catch (err) {
    res.writeHead(err.code === "ENOENT" ? 404 : 500);
    res.end(JSON.stringify({ error: err.message }));
  }
}

const PORT = 3000;

http.createServer(serverFn).listen(PORT, () => {
  console.log(`Node Server running: http://localhost:${PORT}`);
});
