# Stage 1: Build the Angular app
FROM node:18 AS build
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code and build
COPY . .
RUN npm run build -- --configuration production

# Stage 2: Serve the app with Nginx
FROM nginx:alpine
# Copy compiled files from the build stage to Nginx html directory
COPY --from=build /app/dist/bus-tracker-app /usr/share/nginx/html
# Copy custom Nginx configuration for Angular routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
