# Слой сборки: используем актуальную LTS версию Node.js
FROM node:20-alpine AS build
WORKDIR /app

# Сначала копируем только файлы с зависимостями для кэширования
COPY package.json package-lock.json ./

# Устанавливаем зависимости с исправлением конфликтов версий
RUN npm ci --legacy-peer-deps

# Копируем все файлы проекта
COPY . .

# Собираем проект
RUN npm run build

# Слой запуска: Nginx для обслуживания статики и проксирования
FROM nginx:alpine

# Копируем подготовленный конфиг Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Копируем собранные статические файлы
COPY --from=build /app/dist /usr/share/nginx/html

# Открываем порт 80
EXPOSE 80

# Запускаем Nginx в режиме foreground
CMD ["nginx", "-g", "daemon off;"]