module.exports = {
  development: {
    username: "root",
    password: "",
    database: "sirup_dikmen",
    host: "127.0.0.1",
    dialect: "mysql",
  },
  test: {
    username: "root",
    password: "",
    database: "sirup_dikmen_test",
    host: "127.0.0.1",
    dialect: "mysql",
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: "sirup_dikmen_app",
    host: process.env.DB_HOST,
    dialect: "mysql",
  },
};
