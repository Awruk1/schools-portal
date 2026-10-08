export async function onRequest(context) {
  const db = context.env.DB;
  
  if (!db) {
    return new Response(JSON.stringify({ error: "Brak połączenia z D1" }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }

  const { results } = await db.prepare("SELECT * FROM schools ORDER BY name ASC").all();

  return new Response(JSON.stringify(results), {
    headers: { 
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    }
  });
}