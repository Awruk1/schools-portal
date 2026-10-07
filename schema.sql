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

DELETE FROM schools;
INSERT INTO schools (name, type, latitude, longitude, address, website, students_count) 
VALUES 
('I Liceum Ogólnokształcące im. Marszałka Józefa Piłsudskiego w Garwolinie', 'liceum', 51.895544, 21.609995, 'ul. Długa 35, 08-400 Garwolin', 'https://lo1garwolin.edu.pl', 850),
('Zespół Szkół nr 1 im. Bohaterów Westerplatte w Garwolinie', 'liceum, technikum', 51.904266, 21.607755, 'ul. Kościuszki 53, 08-400 Garwolin', 'https://zsgarwolin.pl', 1200),
('Katolickie Liceum Ogólnokształcące im. Cypriana Kamila Norwida w Garwolinie', 'liceum', 51.898091, 21.616864, 'ul. Staszica 11, 08-400 Garwolin', 'http://klogarwo.pl', 300),
('Zespół Szkół nr 2 im. Tadeusza Kościuszki w Garwolinie', 'technikum, zawodowa', 51.896764, 21.595117, 'ul. Żołnierzy II Armii Wojska Polskiego 20, 08-400 Garwolin', 'https://zsp2garwolin.pl', 950);