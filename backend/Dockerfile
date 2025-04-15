# ---- Giai đoạn 1: Build ----
# Sử dụng image Maven chứa sẵn JDK 17 để build
FROM maven:3.9-eclipse-temurin-17 AS build

# Đặt thư mục làm việc
WORKDIR /app

# Copy file pom.xml trước để tận dụng cache layer của Docker
COPY pom.xml .

# (Tùy chọn) Tải dependencies trước
# RUN mvn dependency:go-offline

# Copy toàn bộ mã nguồn vào thư mục làm việc
COPY src ./src

# Build ứng dụng, bỏ qua test
RUN mvn clean package -DskipTests

# ---- Giai đoạn 2: Runtime ----
# Sử dụng image OpenJDK 17 gọn nhẹ hơn để chạy
FROM openjdk:17-jdk-slim

# Đặt thư mục làm việc
WORKDIR /app

# Sao chép CHỈ file JAR đã được build từ giai đoạn 'build'
COPY --from=build /app/target/backend-1.0-SNAPSHOT.jar app.jar

# Mở cổng ứng dụng
EXPOSE 8080

# Lệnh để chạy ứng dụng
ENTRYPOINT ["java", "-jar", "app.jar"]