# Giai đoạn 1: Build file JAR bằng Maven
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
# Copy file pom.xml và source code vào để build
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Giai đoạn 2: Chạy ứng dụng với JRE nhẹ
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy file jar từ giai đoạn build sang
COPY --from=build /app/target/*.jar app.jar

# QUAN TRỌNG: Tạo thư mục storage để lưu PDF và cấp quyền
# Thư mục này sẽ được mount với volume 'paper_storage' trong docker-compose
RUN mkdir -p /app/storage/papers && chmod 777 /app/storage/papers

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]