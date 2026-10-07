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

-- Dodajemy od razu testowe dane (tzw. seed), żebyś miał na czym pracować w kolejnych krokach:
INSERT INTO schools (name, type, latitude, longitude, address, website, students_count) 
VALUES 
('I LO im. Marszałka Józefa Piłsudskiego', 'liceum', 51.8950, 21.6110, 'ul. Korczaka 10, Garwolin', 'https://1lo.garwolin.pl', 850),
('Zespół Szkół nr 1 im. Bohaterów Westerplatte', 'technikum', 51.8985, 21.6150, 'ul. Kościuszki 53, Garwolin', 'https://zs1.garwolin.pl', 1200);