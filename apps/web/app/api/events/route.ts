import { NextRequest, NextResponse } from "next/server";
import { eventQuerySchema } from "@yella/types";
import { getEvents } from "../../../lib/events";
export async function GET(request: NextRequest) { const raw = Object.fromEntries(request.nextUrl.searchParams); const query = eventQuerySchema.safeParse(raw); if (!query.success) return NextResponse.json({error:{code:"VALIDATION_ERROR",message:"Invalid event filters"}},{status:400}); return NextResponse.json({data:getEvents(query.data), meta:{source:"editorial-demo", timezone:"Asia/Dubai"}}); }
