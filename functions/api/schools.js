export async function onRequest(context) {
  const db = context.env.DB;
  const { request } = context;
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS"
  };

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers });
  }

  // Dane logowania (można też nadpisać w Cloudflare Environment Variables jako ADMIN_USER i ADMIN_PASSWORD)
  const ADMIN_USER = context.env.ADMIN_USER || "admin";
  const ADMIN_PASS = context.env.ADMIN_PASSWORD || "admin123";

  function isAuthorized(req) {
    const authHeader = req.headers.get("Authorization") || "";
    if (!authHeader.startsWith("Bearer ")) return false;
    const token = authHeader.replace("Bearer ", "").trim();
    try {
      const decoded = atob(token);
      return decoded === `${ADMIN_USER}:${ADMIN_PASS}`;
    } catch {
      return false;
    }
  }

  const url = new URL(request.url);

  // Endpoint weryfikujący dane logowania z formularza w Panelu Admina
  if (url.searchParams.get("auth_check") === "1") {
    if (isAuthorized(request)) {
      return new Response(JSON.stringify({ authenticated: true }), { status: 200, headers });
    }
    return new Response(JSON.stringify({ error: "Nieprawidłowy login lub hasło" }), { status: 401, headers });
  }

  if (!db) {
    return new Response(
      JSON.stringify({ error: "Brak połączenia z bazą D1" }),
      { status: 500, headers }
    );
  }

  try {
    // PUBLICZNE POBIERANIE SZKÓŁ Z BAZY D1
    if (request.method === "GET") {
      const id = url.searchParams.get("id");

      if (id) {
        const school = await db.prepare("SELECT * FROM schools WHERE id = ?").bind(id).first();
        if (!school) {
          return new Response(JSON.stringify({ error: "Nie znaleziono szkoły" }), { status: 404, headers });
        }
        school.specializations = typeof school.specializations === "string"
          ? JSON.parse(school.specializations)
          : (school.specializations || []);
        return new Response(JSON.stringify(school), { status: 200, headers });
      }

      const { results } = await db.prepare("SELECT * FROM schools ORDER BY name ASC").all();
      const parsed = results.map(s => ({
        ...s,
        specializations: typeof s.specializations === "string"
          ? JSON.parse(s.specializations)
          : (s.specializations || [])
      }));
      return new Response(JSON.stringify(parsed), { status: 200, headers });
    }

    // BLOKADA AUTORYZACYJNA DLA OPERACJI ZAPISU I USUWANIA (POST / DELETE)
    if (!isAuthorized(request)) {
      return new Response(
        JSON.stringify({ error: "Brak autoryzacji. Zaloguj się do Panelu Admina." }),
        { status: 401, headers }
      );
    }

    // DODAWANIE SZKOŁY DO BAZY D1 (tylko dla zalogowanego admina)
    if (request.method === "POST") {
      const body = await request.json();
      const specs = Array.isArray(body.specializations) ? JSON.stringify(body.specializations) : "[]";

      await db.prepare(
        `INSERT INTO schools (name, type, latitude, longitude, address, website, phone, students_count, specializations)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
      ).bind(
        body.name,
        body.type,
        Number(body.latitude),
        Number(body.longitude),
        body.address || "",
        body.website || "",
        body.phone || "",
        Number(body.students_count) || 0,
        specs
      ).run();

      return new Response(JSON.stringify({ success: true }), { status: 201, headers });
    }

    // USUWANIE SZKOŁY Z BAZY D1 (tylko dla zalogowanego admina)
    if (request.method === "DELETE") {
      const id = url.searchParams.get("id");
      if (!id) {
        return new Response(JSON.stringify({ error: "Brak parametru id" }), { status: 400, headers });
      }
      await db.prepare("DELETE FROM schools WHERE id = ?").bind(id).run();
      return new Response(JSON.stringify({ success: true }), { status: 200, headers });
    }

    return new Response(JSON.stringify({ error: "Metoda niedozwolona" }), { status: 405, headers });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers });
  }
}