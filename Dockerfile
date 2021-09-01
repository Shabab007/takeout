# build environment
FROM node:12-alpine as build
# Copy the files from the current directory to app/
COPY . app/
# Use app/ as the working directory
WORKDIR app/
# Arguments
ARG ENV
# Prepare the build files
RUN if [ "$ENV" = "dev" ] ; then npm run build-dev ; else npm run build-stag ; fi

# production environment
FROM nginx:stable-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]