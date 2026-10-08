DROP TABLE IF EXISTS schools;

CREATE TABLE schools (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL, 
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  address TEXT,
  website TEXT,
  phone TEXT,
  students_count INTEGER,
  specializations TEXT, 
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO schools (id, name, type, latitude, longitude, address, website, phone, students_count, specializations) 
VALUES 
(
  1,
  'I Liceum Ogólnokształcące im. Marszałka Józefa Piłsudskiego w Garwolinie',
  'liceum',
  51.895544,
  21.609995,
  'ul. Długa 35, 08-400 Garwolin',
  'https://lo1garwolin.edu.pl',
  '+48 25 682 22 28',
  850,
  '["Profil politechniczny (matematyka, fizyka)", "Profil medyczny (biologia, chemia)", "Profil humanistyczno-społeczny (język polski, historia, WOS)", "Profil ekonomiczno-geograficzny (matematyka, geografia)"]'
),
(
  2,
  'Zespół Szkół nr 1 im. Bohaterów Westerplatte w Garwolinie',
  'liceum, technikum',
  51.904266,
  21.607755,
  'ul. Kościuszki 53, 08-400 Garwolin',
  'https://zsgarwolin.pl',
  '+48 25 682 30 88',
  1200,
  '["II LO: Klasy mundurowe (policyjne) i prawno-językowe", "Technik ekonomista", "Technik rachunkowości", "Technik hotelarstwa", "Technik żywienia i usług gastronomicznych", "Technik spedytor", "Technik organizacji turystyki", "Branżowa: Kucharz, Cukiernik, Sprzedawca, Magazynier-logistyk"]'
),
(
  3,
  'Katolickie Liceum Ogólnokształcące im. Cypriana Kamila Norwida w Garwolinie',
  'liceum',
  51.898091,
  21.616864,
  'ul. Staszica 11, 08-400 Garwolin',
  'http://klogarwo.pl',
  '+48 25 682 41 84',
  300,
  '["Profil medyczno-przyrodniczy (biologia, chemia)", "Profil politechniczno-ekonomiczny (matematyka, fizyka lub geografia)", "Profil humanistyczno-prawny (język polski, historia lub WOS)"]'
),
(
  4,
  'Zespół Szkół nr 2 im. Tadeusza Kościuszki w Garwolinie',
  'technikum, branżowa',
  51.896764,
  21.595117,
  'ul. Żołnierzy II Armii Wojska Polskiego 20, 08-400 Garwolin',
  'https://zsp2garwolin.pl',
  '+48 25 682 25 15',
  950,
  '["Technik informatyk", "Technik programista", "Technik pojazdów samochodowych", "Technik budownictwa", "Technik elektryk", "Technik usług fryzjerskich", "Branżowa: Mechanik pojazdów samochodowych, Fryzjer, Elektryk, Monter zabudowy i robót wykończeniowych"]'
),
(
  5,
  'Zespół Szkół im. Stanisława Staszica w Miętnem',
  'technikum, branżowa',
  51.919516,
  21.579565,
  'ul. Główna 49, 08-400 Miętne',
  'http://mietne.edu.pl',
  '+48 25 682 30 88',
  580,
  '["Technik mechanizacji rolnictwa i agrotroniki", "Technik pojazdów samochodowych", "Technik weterynarii", "Technik logistyk", "Technik grafiki i poligrafii cyfrowej", "Technik architektury krajobrazu", "Technik żywienia i usług gastronomicznych", "Branżowa: Mechanik-operator maszyn rolniczych, Mechanik pojazdów samochodowych, Kierowca mechanik"]'
),
(
  6,
  'Liceum Ogólnokształcące im. Joachima Lelewela w Żelechowie',
  'liceum',
  51.811931,
  21.901688,
  'ul. Szkolna 3, 08-430 Żelechów',
  'http://lelewelzelechow.edu.pl',
  '+48 25 754 10 34',
  280,
  '["Profil biologiczno-chemiczny (medyczny)", "Profil matematyczno-fizyczny (politechniczny)", "Profil humanistyczny (język polski, historia)", "Profil menedżersko-językowy (matematyka, geografia, język angielski)"]'
),
(
  7,
  'Zespół Szkół Ponadpodstawowych im. Ignacego Wyssogoty Zakrzewskiego w Żelechowie',
  'technikum, branżowa',
  51.812166,
  21.898324,
  'ul. Marszałka Józefa Piłsudskiego 45, 08-430 Żelechów',
  'http://zspzelechow.pl',
  '+48 25 754 11 69',
  350,
  '["Technik informatyk", "Technik ekonomista", "Technik handlowiec", "Technik pojazdów samochodowych", "Technik żywienia i usług gastronomicznych", "Branżowa: Klasa wielozawodowa (mechanik, stolarz, kucharz, fryzjer, ślusarz)"]'
),
(
  8,
  'Zespół Szkół Ponadpodstawowych im. Tadeusza Kościuszki w Sobolewie',
  'liceum, branżowa',
  51.739529,
  21.671495,
  'ul. Kościuszki 19, 08-460 Sobolew',
  'https://losobolew.pl',
  '+48 25 682 50 49',
  180,
  '["Liceum: profil ogólny (rozszerzenia: j. angielski, geografia, biologia, WOS)", "Branżowa: Oddział wielozawodowy (przygotowanie zawodowe u pracodawców)"]'
),
(
  9,
  'Liceum Ogólnokształcące w Zespole Szkół nr 1 im. Szarych Szeregów w Łaskarzewie',
  'liceum',
  51.793187,
  21.584551,
  'ul. Alejowa 23, 08-450 Łaskarzew',
  'http://laskarzew1.pl',
  '+48 25 684 50 21',
  35,
  '["Profil ogólny (bloki rozszerzeń: język angielski, geografia, wiedza o społeczeństwie)"]'
);