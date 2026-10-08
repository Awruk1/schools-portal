export const schools = [
  { 
    id: 1, 
    name: 'I Liceum Ogólnokształcące im. Marszałka Józefa Piłsudskiego w Garwolinie', 
    type: 'liceum', 
    latitude: 51.895544, 
    longitude: 21.609995, 
    address: 'ul. Długa 35, 08-400 Garwolin', 
    website: 'https://lo1garwolin.edu.pl', 
    phone: '+48 25 682 22 28',
    students_count: 850,
    specializations: [
      'Profil politechniczny (matematyka, fizyka)',
      'Profil medyczny (biologia, chemia)',
      'Profil humanistyczno-społeczny (język polski, historia, WOS)',
      'Profil ekonomiczno-geograficzny (matematyka, geografia)'
    ]
  },
  { 
    id: 2, 
    name: 'Zespół Szkół nr 1 im. Bohaterów Westerplatte w Garwolinie', 
    type: 'liceum, technikum', 
    latitude: 51.904266, 
    longitude: 21.607755, 
    address: 'ul. Kościuszki 53, 08-400 Garwolin', 
    website: 'https://zsgarwolin.pl', 
    phone: '+48 25 682 30 88',
    students_count: 1200,
    specializations: [
      'II LO: Klasy mundurowe (policyjne) i prawno-językowe',
      'Technik ekonomista',
      'Technik rachunkowości',
      'Technik hotelarstwa',
      'Technik żywienia i usług gastronomicznych',
      'Technik spedytor',
      'Technik organizacji turystyki',
      'Branżowa: Kucharz, Cukiernik, Sprzedawca, Magazynier-logistyk'
    ]
  },
  { 
    id: 3, 
    name: 'Katolickie Liceum Ogólnokształcące im. Cypriana Kamila Norwida w Garwolinie', 
    type: 'liceum', 
    latitude: 51.898091, 
    longitude: 21.616864, 
    address: 'ul. Staszica 11, 08-400 Garwolin', 
    website: 'http://klogarwo.pl', 
    phone: '+48 25 682 41 84',
    students_count: 300,
    specializations: [
      'Profil medyczno-przyrodniczy (biologia, chemia)',
      'Profil politechniczno-ekonomiczny (matematyka, fizyka lub geografia)',
      'Profil humanistyczno-prawny (język polski, historia lub WOS)'
    ]
  },
  { 
    id: 4, 
    name: 'Zespół Szkół nr 2 im. Tadeusza Kościuszki w Garwolinie', 
    type: 'technikum, branżowa', 
    latitude: 51.896764, 
    longitude: 21.595117, 
    address: 'ul. Żołnierzy II Armii Wojska Polskiego 20, 08-400 Garwolin', 
    website: 'https://zsp2garwolin.pl', 
    phone: '+48 25 682 25 15',
    students_count: 950,
    specializations: [
      'Technik informatyk',
      'Technik programista',
      'Technik pojazdów samochodowych',
      'Technik budownictwa',
      'Technik elektryk',
      'Technik usług fryzjerskich',
      'Branżowa: Mechanik pojazdów samochodowych, Fryzjer, Elektryk, Monter zabudowy i robót wykończeniowych'
    ]
  },
  {
    id: 5,
    name: 'Zespół Szkół im. Stanisława Staszica w Miętnem',
    type: 'technikum, branżowa',
    latitude: 51.919516,
    longitude: 21.579565,
    address: 'ul. Główna 49, 08-400 Miętne',
    website: 'http://mietne.edu.pl',
    phone: '+48 25 682 30 88',
    students_count: 580,
    specializations: [
      'Technik mechanizacji rolnictwa i agrotroniki',
      'Technik pojazdów samochodowych',
      'Technik weterynarii',
      'Technik logistyk',
      'Technik grafiki i poligrafii cyfrowej',
      'Technik architektury krajobrazu',
      'Technik żywienia i usług gastronomicznych',
      'Branżowa: Mechanik-operator maszyn rolniczych, Mechanik pojazdów samochodowych, Kierowca mechanik'
    ]
  },
  {
    id: 6,
    name: 'Liceum Ogólnokształcące im. Joachima Lelewela w Żelechowie',
    type: 'liceum',
    latitude: 51.811931,
    longitude: 21.901688,
    address: 'ul. Szkolna 3, 08-430 Żelechów',
    website: 'http://lelewelzelechow.edu.pl',
    phone: '+48 25 754 10 34',
    students_count: 280,
    specializations: [
      'Profil biologiczno-chemiczny (medyczny)',
      'Profil matematyczno-fizyczny (politechniczny)',
      'Profil humanistyczny (język polski, historia)',
      'Profil menedżersko-językowy (matematyka, geografia, język angielski)'
    ]
  },
  {
    id: 7,
    name: 'Zespół Szkół Ponadpodstawowych im. Ignacego Wyssogoty Zakrzewskiego w Żelechowie',
    type: 'technikum, branżowa',
    latitude: 51.812166,
    longitude: 21.898324,
    address: 'ul. Marszałka Józefa Piłsudskiego 45, 08-430 Żelechów',
    website: 'http://zspzelechow.pl',
    phone: '+48 25 754 11 69',
    students_count: 350,
    specializations: [
      'Technik informatyk',
      'Technik ekonomista',
      'Technik handlowiec',
      'Technik pojazdów samochodowych',
      'Technik żywienia i usług gastronomicznych',
      'Branżowa: Klasa wielozawodowa (mechanik, stolarz, kucharz, fryzjer, ślusarz)'
    ]
  },
  {
    id: 8,
    name: 'Zespół Szkół Ponadpodstawowych im. Tadeusza Kościuszki w Sobolewie',
    type: 'liceum, branżowa',
    latitude: 51.739529,
    longitude: 21.671495,
    address: 'ul. Kościuszki 19, 08-460 Sobolew',
    website: 'https://losobolew.pl',
    phone: '+48 25 682 50 49',
    students_count: 180,
    specializations: [
      'Liceum: profil ogólny (rozszerzenia: j. angielski, geografia, biologia, WOS)',
      'Branżowa: Oddział wielozawodowy (przygotowanie zawodowe u pracodawców)'
    ]
  },
  {
    id: 9,
    name: 'Liceum Ogólnokształcące w Zespole Szkół nr 1 im. Szarych Szeregów w Łaskarzewie',
    type: 'liceum',
    latitude: 51.793187,
    longitude: 21.584551,
    address: 'ul. Alejowa 23, 08-450 Łaskarzew',
    website: 'http://laskarzew1.pl',
    phone: '+48 25 684 50 21',
    students_count: 35,
    specializations: [
      'Profil ogólny (bloki rozszerzeń: język angielski, geografia, wiedza o społeczeństwie)'
    ]
  }
];