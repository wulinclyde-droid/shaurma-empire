const SUPABASE_URL = 'https://qzlwomtrbnmygujowcql.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6bHdvbXRyYm5teWd1am93Y3FsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4MDMyMzUsImV4cCI6MjA4NDM3OTIzNX0.YZistjhKTO-_VYqY-poVUzDAxN9tF6tSkdPB7BB5pwQ';

export default async function handler(req, res) {
  try {
    const { userId } = req.query;
    const response = await fetch(`${SUPABASE_URL}/rest/v1/shaurma?user_id=eq.${userId}&select=*`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
