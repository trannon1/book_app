DROP TABLE IF EXISTS books;

CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    authors VARCHAR(255),
    title VARCHAR(255),
    isbn NUMERIC(20),
    image_url VARCHAR(255),
    description TEXT,
    bookshelf NUMERIC(20)
  );
  