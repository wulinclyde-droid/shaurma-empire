// api/save.js
import { verifyInitData } from './verify.js';

const SUPABASE_URL = 'https://qzlwomtrbnmygujowcql.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6bHdvbXRyYm5teWd1am93Y3FsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4MDMyMzUsImV4cCI6MjA4NDM3OTIzNX0.YZistjhKTO-_VYqY-poVUzDAxN9tF6tSkdPB7BB5pwQ';
const BOT_TOKEN = '8541029796:AAHDRrnhEGHsgMNNfV6IIrpZTRM5DuKfza8'; 

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const { userId, initData, ...gameData } = req.body;

    if (!verifyInitData(initData, BOT_TOKEN)) {
      return res.status(403).json({ error: 'Invalid initData' });
    }

    const safeData = {
      shaurma: Number(gameData.shaurma) || 0,
      dps: Number(gameData.dps) || 0,
      tapPower: Number(gameData.tapPower) || 1,
      tapLevel: Number(gameData.tapLevel) || 0,
      helperLevel: Number(gameData.helperLevel) || 0,
      tapsCount: Number(gameData.tapsCount) || 0,
      tasksDone: Array.isArray(gameData.tasksDone) ? gameData.tasksDone : [false, false, false],
      version: String(gameData.version || '1.5')
    };

    const response = await fetch(`${SUPABASE_URL}/rest/v1/shaurma`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify({
        user_id: String(userId),
         safeData   // ← КЛЮЧЕВОЙ МОМЕНТ!
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Supabase error:', errorText);
      return res.status(500).json({ error: 'Supabase save failed', details: errorText });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Save error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
