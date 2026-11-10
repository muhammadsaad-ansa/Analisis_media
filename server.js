import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Health check endpoint for Cloud Run and monitoring
app.get('/healthz', (req, res) => {
  res.status(200).send('OK');
});

// Serve compiled static files from dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// SPA fallback for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server listening on 0.0.0.0:${port}`);
});
