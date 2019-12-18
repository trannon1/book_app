DROP TABLE IF EXISTS bookshelf;

CREATE TABLE bookshelf (
    id SERIAL PRIMARY KEY,
    author VARCHAR(255),
    title VARCHAR(255),
    isbn NUMERIC(20),
    image_url VARCHAR(255),
    description VARCHAR(255),
    bookshelf NUMERIC(20)
  );
  