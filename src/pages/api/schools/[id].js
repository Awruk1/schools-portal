import { env } from "cloudflare:workers";

export async function GET({ params }) {
  const { id } = params; // Pobieramy ID z adresu URL
  const db = env.DB;
  
  if (!db) {
    console.warn("Brak bazy D1, zwracam testowe dane dla pojedynczej szkoły.");
    const mockSchools = [
      { id: 1, name: 'I Liceum Ogólnokształcące im. Marszałka Józefa Piłsudskiego w Garwolinie', type: 'liceum', latitude: 51.895544, longitude: 21.609995, address: 'ul. Długa 35, 08-400 Garwolin', website: 'https://lo1garwolin.edu.pl', students_count: 850 },
      { id: 2, name: 'Zespół Szkół nr 1 im. Bohaterów Westerplatte w Garwolinie', type: 'liceum, technikum', latitude: 51.904266, longitude: 21.607755, address: 'ul. Kościuszki 53, 08-400 Garwolin', website: 'https://zsgarwolin.pl', students_count: 1200 },
      { id: 3, name: 'Katolickie Liceum Ogólnokształcące im. Cypriana Kamila Norwida w Garwolinie', type: 'liceum', latitude: 51.898091, longitude: 21.616864, address: 'ul. Staszica 11, 08-400 Garwolin', website: 'http://klogarwo.pl', students_count: 300 },
      { id: 4, name: 'Zespół Szkół nr 2 im. Tadeusza Kościuszki w Garwolinie', type: 'technikum, zawodowa', latitude: 51.896764, longitude: 21.595117, address: 'ul. Żołnierzy II Armii Wojska Polskiego 20, 08-400 Garwolin', website: 'https://zsp2garwolin.pl', students_count: 950 }
    ]
    // Szukamy szkoły o podanym ID
    const school = mockSchools.find(s => s.id === parseInt(id));
    if (!school) return new Response('Nie znaleziono szkoły', { status: 404 });
    
    return new Response(JSON.stringify(school), { headers: { 'Content-Type': 'application/json' } });
  }

  // Właściwe zapytanie do bazy D1 w chmurze
  const { results } = await db.prepare('SELECT * FROM schools WHERE id = ?').bind(id).all();
  
  if (results.length === 0) {
    return new Response('Nie znaleziono szkoły', { status: 404 });
  }
  
  return new Response(JSON.stringify(results[0]), {
    headers: { 'Content-Type': 'application/json' }
  });
}