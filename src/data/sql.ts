import mysql from 'mysql2/promise';

const dbHost = process.env.DB_HOST ?? process.env.HOST ?? "127.0.0.1";
const dbPort = Number(process.env.DB_PORT ?? process.env.PORT ?? 3306);
const dbName =
  process.env.DB_NAME ??
  process.env.DB_DATABASE ??
  process.env.DATABASE;
const dbUser =
  process.env.DB_USER ??
  process.env.DB_USERNAME ??
  process.env.USERNAME;
const dbPassword = process.env.DB_PASSWORD ?? process.env.PASSWORD;

export const pool = mysql.createPool({
  host: dbHost,
  user: dbUser,
  password: dbPassword,
  database: dbName,
  port: dbPort,
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});