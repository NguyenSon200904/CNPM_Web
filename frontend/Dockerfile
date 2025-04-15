# Sử dụng image Node chính thức để build React app
FROM node:18 AS build

# Đặt thư mục làm việc
WORKDIR /app

# Copy package.json và cài đặt dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy toàn bộ mã nguồn và build ứng dụng React
COPY . .
RUN npm run build

# Sử dụng image Nginx để phục vụ các file tĩnh
FROM nginx:alpine

# Copy các file build từ bước trước vào thư mục Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Copy file cấu hình Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose cổng 80 (mặc định của Nginx)
EXPOSE 80

# Chạy Nginx
CMD ["nginx", "-g", "daemon off;"]