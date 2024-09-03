import { serve } from "https://deno.land/std@0.166.0/http/server.ts";
// import { Server } from "https://deno.land/x/socket_io@0.2.0/mod.ts";
import { Application } from "https://deno.land/x/oak@v11.1.0/mod.ts";

const app = new Application();

app.use(async (context, next) => {
  console.log(context.request.headers);
  console.log(new Date(), context.request.url.pathname);
  try {
    await context.send({
      root: `${Deno.cwd()}/static`,
      index: "index.html",
    });
  } catch {
    await next();
  }
});

app.listen({ port: Deno.env.get("PORT") });
