import * as process from 'process';

export default () => ({
  port: parseInt(process.env.HTTP_PORT) || 3000,
  environment: process.env.NODE_ENV || 'dev',
  database: {
    logging: process.env.NODE_ENV === 'dev',
    host: process.env.DB_HOST || 'localh',
    port: parseInt(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
    tableSchemaAutoUpdate: process.env.TABLE_SCHEMA_AUTO_UPDATE === 'true',
  },
  jwtSecretKey: process.env.JWT_SECRET_KEY,
});
