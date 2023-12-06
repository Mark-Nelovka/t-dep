# Используйте официальный образ Node.js
FROM node:latest

# Устанавливаем директорию приложения в /app
WORKDIR /app

# Копируем файлы package.json и package-lock.json (если есть)
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем все остальные файлы в корень приложения
COPY . .

# Компилируем TypeScript код
RUN npm run build

# Экспортируем порт, на котором работает ваше приложение
EXPOSE 3000

# Команда для запуска приложения
CMD ["npm", "start"]
