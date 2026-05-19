// Database Configuration - Sequelize ORM

const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const DB_NAME     = process.env.DB_NAME    || 'mophix_studio';
const DB_USER     = process.env.DB_USER    || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD ?? '';
const DB_HOST     = process.env.DB_HOST    || '127.0.0.1';
const DB_DIALECT  = process.env.DB_DIALECT || 'mysql';

// Safely parse port — fallback to 3306 if missing or NaN
const DB_PORT = process.env.DB_PORT
    ? parseInt(process.env.DB_PORT.trim(), 10)
    : 3306;

if (isNaN(DB_PORT)) {
    throw new Error(`Invalid DB_PORT value in .env: "${process.env.DB_PORT}"`);
}

const sequelizeOptions = {
    host: DB_HOST,
    port: DB_PORT,
    dialect: DB_DIALECT,
    logging: process.env.NODE_ENV === 'development'
        ? (msg) => console.log(msg)
        : false,
    pool: {
        max:     parseInt(process.env.DB_POOL_MAX,     10) || 5,
        min:     parseInt(process.env.DB_POOL_MIN,     10) || 0,
        acquire: parseInt(process.env.DB_POOL_ACQUIRE, 10) || 30000,
        idle:    parseInt(process.env.DB_POOL_IDLE,    10) || 10000,
    },
    timezone: process.env.DB_TIMEZONE || '+03:00',
    define: {
        timestamps: true,
        underscored: true,
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci',
    },
};

// Enable SSL if requested (useful for cloud DBs)
if (process.env.DB_SSL === 'true') {
    sequelizeOptions.dialectOptions = {
        ...sequelizeOptions.dialectOptions,
        ssl: { require: true, rejectUnauthorized: false },
    };
}

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, sequelizeOptions);

// Test connection on startup
(async () => {
    try {
        await sequelize.authenticate();
        console.log(`✔ Database connected — ${DB_DIALECT}://${DB_HOST}:${DB_PORT}/${DB_NAME}`);
    } catch (err) {
        console.error('✘ Unable to connect to the database:');
        console.error(`  Host:    ${DB_HOST}:${DB_PORT}`);
        console.error(`  DB:      ${DB_NAME}`);
        console.error(`  User:    ${DB_USER}`);
        console.error(`  Reason:  ${err.message}`);
        process.exit(1); // Crash early with a clear message instead of silent failure
    }
})();

module.exports = sequelize;
module.exports.Sequelize = Sequelize;