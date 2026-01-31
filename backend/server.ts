Deno.serve({ port: 1337 }, (req: Request): Response => {
  const url = new URL(req.url);

  return new Response(`Hello from Deno server!\nPath: ${url.pathname}`, {
    status: 200,
    headers: { "Content-Type": "text/plain" },
  });
});

console.log("Server running on http://localhost:1337");
