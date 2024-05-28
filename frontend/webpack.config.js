const path = require("path"); // Импортируем модуль "path" для работы с путями файлов
const HtmlWebpackPlugin = require("html-webpack-plugin");
const Dotenv = require("dotenv-webpack");

module.exports = {
  entry: {
    login: "./js/login.js",
    main: "./js/main.js",
  }, // Точка входа для сборки проекта

  output: {
    filename: "[name].bundle.js", // Имя выходного файла сборки
    path: path.resolve(__dirname, "dist"), // Путь для выходного файла сборки
  },

  module: {
    rules: [
      {
        test: /\.css$/, // Регулярное выражение для обработки файлов с расширением .css
        use: ["style-loader", "css-loader"], // Загрузчики, используемые для обработки CSS-файлов
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      filename: "login",
      template: "./pages/login.html",
      chunks: ["login"], // Include only the login bundle
    }),
    new HtmlWebpackPlugin({
      template: "./pages/chat.html",
      chunks: ["main"], // Include only the main bundle
    }),
    new Dotenv(),
  ],

  devServer: {
    static: {
      directory: path.join(__dirname, ""), // Каталог для статики
    },
    open: true, // Автоматически открывать браузер
  },

  mode: "production", // Режим сборки
};
