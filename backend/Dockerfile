# Use an official OpenJDK runtime as a base image
FROM eclipse-temurin:17-jdk

# Set the working directory inside the container
WORKDIR /app

# Copy the built JAR file into the container
# Adjust the JAR name if your build produces a different one
COPY target/*.jar app.jar

# Expose the port your app runs on (e.g., 8080)
EXPOSE 8080

# Run the JAR
ENTRYPOINT ["java", "-jar", "app.jar"]
