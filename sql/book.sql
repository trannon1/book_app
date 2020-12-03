DROP TABLE IF EXISTS reviews;

CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    company VARCHAR(255),
    addr VARCHAR(255),
    description TEXT
  );
  