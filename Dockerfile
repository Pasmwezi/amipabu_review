# Stage 1: Build the React application
FROM node:20-alpine AS build

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

# Build the application
RUN yarn build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

# Copy the built React app to Nginx's public directory
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration (optional, but good for single-page apps)
# This configuration ensures that all requests are routed to index.html,
# which is necessary for client-side routing (like React Router).
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]