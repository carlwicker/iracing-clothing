export async function middleware(request: Request) {
  return new Response("Middleware logic has been updated.");
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
