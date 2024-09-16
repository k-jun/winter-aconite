FROM denoland/deno:1.36.1

# The port that your application listens to.
EXPOSE 8080

WORKDIR /app

# Prefer not to run as root.
USER deno

# These steps will be re-run upon each file change in your working directory:
COPY . .
# Compile the main app so that it doesn't need to be compiled each startup/entry.
RUN deno cache src/main.js

ENV PORT 8080
CMD ["run", "--allow-net","--allow-read", "--allow-env", "src/main.js"]
