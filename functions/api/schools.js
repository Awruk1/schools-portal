const enc = new TextEncoder();

function base64UrlEncode(str) {
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(str) {
  let b64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (b64.length % 4) b64 += "=";
  return atob(b64);
}

async function sha256Hex(text) {
  const hashBuffer = await crypto.subtle.digest("SHA-256", enc.encode(text));
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function signJwt(payload, secret) {
  const header = { alg: "HS256", typ: "JWT" };
  const data = `${base64UrlEncode(JSON.stringify(header))}.${base64UrlEncode(JSON.stringify(payload))}`;
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sigBuffer = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  const sigStr = String.fromCharCode(...new Uint8Array(sigBuffer));
  return `${data}.${base64UrlEncode(sigStr)}`;
}

async function verifyJwt(token, secret) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const [headerB64, payloadB64, sigB64] = parts;
    const data = `${headerB64}.${payloadB64}`;

    const key = await crypto.subtle.importKey(
      "raw",
      enc.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );
    const sigBytes = Uint8Array.from(base64UrlDecode(sigB64), (c) => c.charCodeAt(0));
    const isValid = await crypto.subtle.verify("HMAC", key, sigBytes, enc.encode(data));
    if (!isValid) return null;

    const payload = JSON.parse(base64UrlDecode(payloadB64));
    if (payload.exp && Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function onRequest(context) {
  const db = context.env.DB;
  const { request } = context;
  const JWT_SECRET = context.env.JWT_SECRET || "cloudflare-d1-schools-garwolin-secret-key-2026";

  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS"
  };

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers });
  }

  if (!db) {
    return new Response(JSON.stringify({ error: "Brak połączenia z bazą D1" }), { status: 500, headers });
  }

  async function getAuthenticatedAdmin(req) {
    const authHeader = req.headers.get("Authorization") || "";
    if (authHeader.startsWith("Bearer ")) {
      const token = authHeader.replace("Bearer ", "").trim();
      const payload = await verifyJwt(token, JWT_SECRET);
      if (payload && payload.email) {
        return { email: payload.email, method: "Cloudflare WebCrypto JWT (HS256)" };
      }
    }
    return null;
  }

  const url = new URL(request.url);
  const action = url.searchParams.get("action");

  try {
    // 1. SPRAWDZENIE STATUSU SESJI JWT
    if (url.searchParams.get("auth_check") === "1") {
      const admin = await getAuthenticatedAdmin(request);
      if (admin) {
        return new Response(JSON.stringify({ authenticated: true, email: admin.email, method: admin.method }), {
          status: 200,
          headers
        });
      }
      return new Response(JSON.stringify({ authenticated: false }), { status: 401, headers });
    }

    // 2. GENEROWANIE I WYSYŁKA 6-CYFROWEGO TOKENU OTP NA DOWOLNY E-MAIL
    if (request.method === "POST" && action === "request_otp") {
      const { email } = await request.json();
      if (!email || !email.includes("@")) {
        return new Response(JSON.stringify({ error: "Podaj poprawny adres e-mail." }), { status: 400, headers });
      }

      const normalizedEmail = email.trim().toLowerCase();

      await db.prepare(`
        CREATE TABLE IF NOT EXISTS auth_tokens (
          email TEXT PRIMARY KEY,
          token_hash TEXT NOT NULL,
          expires_at INTEGER NOT NULL
        )
      `).run();

      const randomArray = new Uint32Array(1);
      crypto.getRandomValues(randomArray);
      const otpCode = String(100000 + (randomArray[0] % 900000));

      const tokenHash = await sha256Hex(`${normalizedEmail}:${otpCode}:${JWT_SECRET}`);
      const expiresAt = Date.now() + 10 * 60 * 1000;

      await db.prepare(`
        INSERT INTO auth_tokens (email, token_hash, expires_at)
        VALUES (?, ?, ?)
        ON CONFLICT(email) DO UPDATE SET
          token_hash = excluded.token_hash,
          expires_at = excluded.expires_at
      `).bind(normalizedEmail, tokenHash, expiresAt).run();

      const emailSubject = `Twój kod logowania (Token OTP): ${otpCode}`;
      const emailHtml = `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
          <h2 style="color: #1e293b; margin-top: 0;">🏫 Panel Administracyjny - Szkoły Garwolin</h2>
          <p style="color: #475569;">Twój jednorazowy token autoryzacyjny (ważny przez 10 minut):</p>
          <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 16px; text-align: center; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #2563eb;">${otpCode}</span>
          </div>
          <p style="color: #64748b; font-size: 12px;">Token został zakodowany algorytmem SHA-256 w bazie Cloudflare D1.</p>
        </div>
      `;

      let emailSent = false;

      // Wysyłka na dowolny adres e-mail przez mostek Google Apps Script (MAIL_WEBHOOK_URL)
      if (context.env.MAIL_WEBHOOK_URL) {
        try {
          const webhookRes = await fetch(context.env.MAIL_WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify({
              to: normalizedEmail,
              subject: emailSubject,
              html: emailHtml
            }),
            redirect: "follow"
          });
          if (webhookRes.ok || webhookRes.status === 302) {
            emailSent = true;
          }
        } catch {}
      }

      // Zapasowa wysyłka przez Resend (jeśli skonfigurowano i jeszcze nie wysłano)
      if (!emailSent && context.env.RESEND_API_KEY) {
        try {
          const mailRes = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${context.env.RESEND_API_KEY}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              from: "Szkoły Garwolin <onboarding@resend.dev>",
              to: [normalizedEmail],
              subject: emailSubject,
              html: emailHtml
            })
          });
          emailSent = mailRes.ok;
        } catch {}
      }

      if (!emailSent) {
        return new Response(
          JSON.stringify({
            error: "Nie udało się wysłać wiadomości e-mail. Sprawdź zmienną MAIL_WEBHOOK_URL w ustawieniach Cloudflare."
          }),
          { status: 500, headers }
        );
      }

      // Zwracamy wyłącznie potwierdzenie wysłania – kod NIGDY nie trafia do przeglądarki
      return new Response(
        JSON.stringify({
          success: true,
          email: normalizedEmail
        }),
        { status: 200, headers }
      );
    }

    // 3. WERYFIKACJA 6-CYFROWEGO KODU Z MAILA I WYDANIE PODPISANEGO TOKENU JWT
    if (request.method === "POST" && action === "verify_otp") {
      const { email, otp } = await request.json();
      const normalizedEmail = (email || "").trim().toLowerCase();
      const cleanOtp = (otp || "").trim();

      const record = await db
        .prepare("SELECT token_hash, expires_at FROM auth_tokens WHERE email = ?")
        .bind(normalizedEmail)
        .first();

      if (!record || Date.now() > Number(record.expires_at)) {
        return new Response(JSON.stringify({ error: "Token wygasł lub nie istnieje. Wyślij nowy kod." }), {
          status: 401,
          headers
        });
      }

      const expectedHash = await sha256Hex(`${normalizedEmail}:${cleanOtp}:${JWT_SECRET}`);
      if (expectedHash !== record.token_hash) {
        return new Response(JSON.stringify({ error: "Nieprawidłowy kod tokenu!" }), { status: 401, headers });
      }

      await db.prepare("DELETE FROM auth_tokens WHERE email = ?").bind(normalizedEmail).run();

      const jwtToken = await signJwt(
        {
          email: normalizedEmail,
          role: "admin",
          iat: Date.now(),
          exp: Date.now() + 8 * 60 * 60 * 1000
        },
        JWT_SECRET
      );

      return new Response(
        JSON.stringify({
          authenticated: true,
          token: jwtToken,
          email: normalizedEmail,
          method: "Cloudflare WebCrypto JWT (HS256)"
        }),
        { status: 200, headers }
      );
    }

    // 4. PUBLICZNE POBIERANIE SZKÓŁ Z BAZY D1 (GET)
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
      const parsed = results.map((s) => ({
        ...s,
        specializations: typeof s.specializations === "string"
          ? JSON.parse(s.specializations)
          : (s.specializations || [])
      }));
      return new Response(JSON.stringify(parsed), { status: 200, headers });
    }

    // BLOKADA AUTORYZACYJNA JWT DLA ZAPISU I USUWANIA
    const admin = await getAuthenticatedAdmin(request);
    if (!admin) {
      return new Response(
        JSON.stringify({ error: "Brak ważnego tokenu JWT. Zaloguj się przez e-mail." }),
        { status: 401, headers }
      );
    }

    // 5. DODAWANIE SZKOŁY DO BAZY D1
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

    // 6. USUWANIE SZKOŁY Z BAZY D1
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