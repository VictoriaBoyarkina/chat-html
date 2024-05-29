const path = require("path"); // Импортируем модуль "path" для работы с путями файлов
const HtmlWebpackPlugin = require("html-webpack-plugin");
const Dotenv = require("dotenv-webpack");

module.exports = {
  entry: {
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
      {
        test: /\.html$/, // Регулярное выражение для обработки файлов с расширением .css
        use: [
          {
            loader: 'file-loader',
            options: {
              name: "[name].[ext]",
            },
          },
        ],
        exclude: path.resolve(__dirname, 'pages/index.html'),
      },
      {
        test: /\.(jpg|png|svg)$/, // Регулярное выражение для обработки файлов с расширением .css
        use: [
          {
            loader: 'file-loader',
            options: {
              name: "[name].[ext]",
              outputPath: "img/",
              publicPath: "img/",
            },
          },
        ],
        exclude: path.resolve(__dirname, 'pages/index.html'),
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "./pages/index.html",
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
