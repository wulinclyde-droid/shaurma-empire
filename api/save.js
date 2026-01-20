// api/save.js
import { verifyInitData } from './verify.js';

const SUPABASE_URL = 'https://qzlwomtrbnmygujowcql.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6bHdvbXRyYm5teWd1am93Y3FsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4MDMyMzUsImV4cCI6MjA4NDM3OTIzNX0.YZistjhKTO-_VYqY-poVUzDAxN9tF6tSkdPB7BB5pwQ';
const BOT_TOKEN = '8541029796:AAHDRrnhEGHsgMNNfV6IIrpZTRM5DuKfza8'; 

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const body = req.body;
    const userId = body?.userId;
    const initData = body?.initData;

    if (!userId || !initData) {
      return res.status(400).json({ error: 'Missing userId or initData' });
    }

    if (!verifyInitData(initData, BOT_TOKEN)) {
      return res.status(403).json({ error: 'Invalid initData' });
    }

    const safeData = {
      shaurma: Number(body.shaurma) || 0,
      dps: Number(body.dps) || 0,
      tapPower: Number(body.tapPower) || 1,
      tapLevel: Number(body.tapLevel) || 0,
      helperLevel: Number(body.helperLevel) || 0,
      tapsCount: Number(body.tapsCount) || 0,
      tasksDone: Array.isArray(body.tasksDone) ? body.tasksDone : [false, false, false],
      version: String(body.version || '1.5')
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
         safeData
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Supabase error:', errorText);
      return res.status(500).json({ error: 'Supabase save failed' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Save error:', error);
    res.status(500).json({ error: 'Internal error' });
  }
}
