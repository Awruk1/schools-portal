import { env } from "cloudflare:workers";

export async function GET({ request }) {
  const db = env.DB;
  
  // Pobieramy parametr "type" z adresu URL (np. ?type=liceum)
  const url = new URL(request.url);
  const typeFilter = url.searchParams.get('type');
  
  if (!db) {
    let mockData = [
      { id: 1, name: 'I Liceum Ogólnokształcące im. Marszałka Józefa Piłsudskiego w Garwolinie', type: 'liceum', latitude: 51.895544, longitude: 21.609995, address: 'ul. Długa 35, 08-400 Garwolin', website: 'https://lo1garwolin.edu.pl', students_count: 850 },
      { id: 2, name: 'Zespół Szkół nr 1 im. Bohaterów Westerplatte w Garwolinie', type: 'liceum, technikum', latitude: 51.904266, longitude: 21.607755, address: 'ul. Kościuszki 53, 08-400 Garwolin', website: 'https://zsgarwolin.pl', students_count: 1200 },
      { id: 3, name: 'Katolickie Liceum Ogólnokształcące im. Cypriana Kamila Norwida w Garwolinie', type: 'liceum', latitude: 51.898091, longitude: 21.616864, address: 'ul. Staszica 11, 08-400 Garwolin', website: 'http://klogarwo.pl', students_count: 300 },
      { id: 4, name: 'Zespół Szkół nr 2 im. Tadeusza Kościuszki w Garwolinie', type: 'technikum, zawodowa', latitude: 51.896764, longitude: 21.595117, address: 'ul. Żołnierzy II Armii Wojska Polskiego 20, 08-400 Garwolin', website: 'https://zsp2garwolin.pl', students_count: 950 }
    ];
    
    // Zabezpieczenie: proste filtrowanie i sortowanie dla środowiska lokalnego
    if (typeFilter) {
      mockData = mockData.filter(school => school.type.includes(typeFilter));
    }
    mockData.sort((a, b) => a.name.localeCompare(b.name));
    
    return new Response(JSON.stringify(mockData), { headers: { 'Content-Type': 'application/json' } });
  }

  // Właściwy kod produkcyjny do bazy D1
  let query = 'SELECT * FROM schools';
  const params = [];
  
  if (typeFilter) {
    query += ' WHERE type LIKE ?';
    params.push(`%${typeFilter}%`);
  }
  
  query += ' ORDER BY name ASC';
  
  const { results } = await db.prepare(query).bind(...params).all();
  
  return new Response(JSON.stringify(results), {
    headers: { 'Content-Type': 'application/json' }
  });
}