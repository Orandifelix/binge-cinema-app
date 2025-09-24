# # ---- Build Stage ----
#     FROM node:20 AS builder
    
#     # Set working directory
#     WORKDIR /app
    
#     # Copy package.json and package-lock.json
#     COPY package*.json ./
    
#     # Install dependencies
#     RUN npm ci
    
#     # Copy the rest of the code
#     COPY . .
    
#     # Build the Vite app
#     RUN npm run build
    
#     # ---- Serve Stage ----
#     FROM nginx:alpine
    
#     # Copy built assets from builder
#     COPY --from=builder /app/dist /usr/share/nginx/html
    
#     # Copy default nginx config
#     COPY nginx.conf /etc/nginx/conf.d/default.conf
    
#     # Expose port
#     EXPOSE 80
    
#     CMD ["nginx", "-g", "daemon off;"]
    