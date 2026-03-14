/**
 * VM2 Task Status API
 * Lightweight Node.js server to track AI task status
 * and serve completed images back to VM1.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const OUTPUTS_DIR = '/outputs';

// In-memory task tracking
const tasks = new Map();

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://localhost:${PORT}`);

  // Health check
  if (url.pathname === '/health') {
    res.writeHead(200);
    res.end(JSON.stringify({ status: 'healthy', service: 'vm2-task-api' }));
    return;
  }

  // Register a new task
  if (req.method === 'POST' && url.pathname === '/api/task/register') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const taskId = data.task_id;
        tasks.set(taskId, {
          id: taskId,
          status: 'queued',
          created_at: new Date().toISOString(),
          output_image_url: null,
          metadata: {},
          processing_time_ms: null,
        });
        res.writeHead(200);
        res.end(JSON.stringify({ success: true, task_id: taskId }));
      } catch (e) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
    return;
  }

  // Update task status (called by SD after processing)
  if (req.method === 'POST' && url.pathname.startsWith('/api/task/update/')) {
    const taskId = url.pathname.split('/').pop();
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const task = tasks.get(taskId);
        if (task) {
          Object.assign(task, data, { updated_at: new Date().toISOString() });
          tasks.set(taskId, task);
        }
        res.writeHead(200);
        res.end(JSON.stringify({ success: true }));
      } catch (e) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
    return;
  }

  // Get task status
  if (req.method === 'GET' && url.pathname.startsWith('/api/task-status/')) {
    const taskId = url.pathname.split('/').pop();
    const task = tasks.get(taskId);
    if (task) {
      res.writeHead(200);
      res.end(JSON.stringify(task));
    } else {
      res.writeHead(404);
      res.end(JSON.stringify({ error: 'Task not found' }));
    }
    return;
  }

  // List recent tasks
  if (req.method === 'GET' && url.pathname === '/api/tasks') {
    const recent = Array.from(tasks.values())
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 50);
    res.writeHead(200);
    res.end(JSON.stringify(recent));
    return;
  }

  // Serve output image
  if (req.method === 'GET' && url.pathname.startsWith('/outputs/')) {
    const filePath = path.join(OUTPUTS_DIR, url.pathname.replace('/outputs/', ''));
    if (fs.existsSync(filePath)) {
      const ext = path.extname(filePath).toLowerCase();
      const mimeTypes = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp' };
      res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
      fs.createReadStream(filePath).pipe(res);
    } else {
      res.writeHead(404);
      res.end(JSON.stringify({ error: 'File not found' }));
    }
    return;
  }

  // 404
  res.writeHead(404);
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[VM2 Task API] Running on port ${PORT}`);
  console.log(`[VM2 Task API] Outputs dir: ${OUTPUTS_DIR}`);
});
