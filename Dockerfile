FROM eclipse-temurin:21-jdk AS build

WORKDIR /app
COPY . .
RUN ./mvnw -B clean package -DskipTests

FROM eclipse-temurin:21-jre

WORKDIR /app
RUN useradd --system --create-home spring
USER spring
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
