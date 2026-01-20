// api/load.js
import { verifyInitData } from './verify.js';

const SUPABASE_URL = 'https://qzlwomtrbnmygujowcql.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6bHdvbXRyYm5teWd1am93Y3FsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4MDMyMzUsImV4cCI6MjA4NDM3OTIzNX0.YZistjhKTO-_VYqY-poVUzDAxN9tF6tSkdPB7BB5pwQ';
const BOT_TOKEN = '8541029796:AAHDRrnhEGHsgMNNfV6IIrpZTRM5DuKfza8'; // ← ЗАМЕНИ ЭТО!

export default async function handler(req, res) {
  try {
    const { userId, initData } = req.query;

    if (!verifyInitData(initData, BOT_TOKEN)) {
      return res.status(403).json([]);
    }

    const response = await fetch(`${SUPABASE_URL}/rest/v1/shaurma?user_id=eq.${encodeURIComponent(userId)}&select=*`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Load error:', error);
    res.status(500).json([]);
  }
}
