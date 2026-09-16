# ================================
# BUILD STAGE
# ================================
FROM maven:3.9.11-eclipse-temurin-17 AS build

WORKDIR /app

COPY pom.xml .

RUN mvn dependency:go-offline -B

COPY src ./src

RUN mvn clean package -DskipTests


# ================================
# RUN STAGE
# ================================
FROM eclipse-temurin:17-jre-jammy

WORKDIR /app

COPY --from=build /app/target/lostfoundportal-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 10000

ENTRYPOINT ["sh", "-c", "java -Dserver.port=${PORT:-10000} -jar app.jar"]