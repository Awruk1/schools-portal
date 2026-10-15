export async function onRequest(context) {
  const db = context.env.DB;
  const { request } = context;
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*"
  };

  if (!db) {
    return new Response(JSON.stringify({ error: "Brak połączenia z D1" }), { status: 500, headers });
  }

  try {
    // Automatyczne utworzenie tabeli analitycznej w bazie D1, jeśli jeszcze nie istnieje
    await db.prepare(`
      CREATE TABLE IF NOT EXISTS analytics (
        metric_key TEXT PRIMARY KEY,
        views INTEGER DEFAULT 0,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `).run();

    // POBIERANIE STATYSTYK (widoki mapy + ranking popularnych szkół)
    if (request.method === "GET") {
      const { results } = await db.prepare("SELECT metric_key, views, updated_at FROM analytics").all();
      return new Response(JSON.stringify(results || []), { status: 200, headers });
    }

    // REJESTROWANIE ZDARZENIA (np. map_view lub school_1)
    if (request.method === "POST") {
      const body = await request.json();
      const key = body.key;

      if (!key) {
        return new Response(JSON.stringify({ error: "Brak klucza zdarzenia" }), { status: 400, headers });
      }

      await db.prepare(`
        INSERT INTO analytics (metric_key, views, updated_at)
        VALUES (?, 1, CURRENT_TIMESTAMP)
        ON CONFLICT(metric_key) DO UPDATE SET
          views = views + 1,
          updated_at = CURRENT_TIMESTAMP
      `).bind(key).run();

      return new Response(JSON.stringify({ success: true, key }), { status: 200, headers });
    }

    return new Response(JSON.stringify({ error: "Metoda niedozwolona" }), { status: 405, headers });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers });
  }
}