export async function GET({ request, locals }) {
  const db = locals.env?.DB;
  
  if (!db) {
    return new Response(JSON.stringify({ error: "Brak połączenia z bazą D1" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }

  const { results } = await db.prepare("SELECT * FROM schools").all();
  
  return new Response(JSON.stringify(results), {
    headers: { 
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    }
  });
}