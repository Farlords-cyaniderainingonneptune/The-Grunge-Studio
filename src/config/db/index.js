import pgp from 'pg-promise';

const pg = pgp({ noWarnings: true });

const cn = {
  connectionString: process.env.DATABASE_URL,
  max: 10
};

const db = pg(cn);

export default db;