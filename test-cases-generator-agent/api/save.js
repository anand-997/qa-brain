// Vercel serverless function: POST /api/save — disabled (serverless FS is read-only/ephemeral).
// Use the client-side Download .md / .csv / .txt buttons instead.
export default function handler(_req, res) {
  res.status(501).json({ error: 'Saving to server is disabled on serverless. Use the Download buttons.' });
}
