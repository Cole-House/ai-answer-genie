// TODO: Implement the code here to add rate limiting with Redis
// Refer to the Next.js Docs: https://nextjs.org/docs/app/building-your-application/routing/middleware
// Refer to Redis docs on Rate Limiting: https://upstash.com/docs/redis/sdks/ratelimit-ts/algorithms

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

const rateLimit = new Ratelimit({
  redis: redis,
  // 10 requests per 60 seconds
  limiter: Ratelimit.slidingWindow(10, "60 s"),
  analytics: true,
})

export async function middleware(request: NextRequest) {
  try {
    // get the user's IP address from request header
    const ip = (request.headers.get("x-real-ip") || request.headers.get("x-forwarded-for")) ?? '127.0.0.1';
    const { success, limit, reset, remaining } = await rateLimit.limit(ip);

    const response = success
    ? NextResponse.next()
    : NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    )

    response.headers.set("X-RateLimit-Limit", limit.toString());
    response.headers.set("X-RateLimit-Remaining", remaining.toString());
    response.headers.set("X-RateLimit-Reset", reset.toString());

    return response

  } catch (error) {
    // Handle the error appropriately
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );

  }
}


// Configure which paths the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except static files and images
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
