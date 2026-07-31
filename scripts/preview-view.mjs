import { spawnSync, spawn } from 'node:child_process';
import net from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PORT = 4175;
const PREVIEW_URL = `http://localhost:${PORT}/examples/preview.html`;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

function isPortOpen(port) {
  return new Promise((resolve) => {
    const socket = net.connect({ port, host: '127.0.0.1' }, () => {
      socket.destroy();
      resolve(true);
    });

    socket.on('error', () => {
      resolve(false);
    });
  });
}

function runRender() {
  const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  const result = spawnSync(npmCmd, ['run', 'preview:render'], {
    cwd: rootDir,
    stdio: 'inherit',
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function openPreview() {
  spawn('open', [PREVIEW_URL], {
    cwd: rootDir,
    stdio: 'ignore',
    detached: true,
  }).unref();
}

runRender();

const inUse = await isPortOpen(PORT);
if (inUse) {
  console.log(`Preview server already running at ${PREVIEW_URL}`);
  openPreview();
  process.exit(0);
}

console.log(`Starting preview server on ${PREVIEW_URL}`);
openPreview();

const server = spawn('python3', ['-m', 'http.server', String(PORT)], {
  cwd: rootDir,
  stdio: 'inherit',
});

server.on('exit', (code) => {
  process.exit(code ?? 0);
});
