FROM maven:3.8.7-eclipse-temurin-17 AS build
WORKDIR /app
COPY . .
RUN mvn clean package

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/po-bot-dc-1.0-SNAPSHOT-jar-with-dependencies.jar .
CMD ["java", "-jar", "po-bot-dc-1.0-SNAPSHOT-jar-with-dependencies.jar"]
