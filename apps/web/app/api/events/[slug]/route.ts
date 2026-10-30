import { NextResponse } from "next/server";
import { getEvent } from "../../../../lib/events";
export async function GET(_: Request,{params}:{params:Promise<{slug:string}>}){const {slug}=await params;const event=getEvent(slug);return event?NextResponse.json({data:event}):NextResponse.json({error:{code:"NOT_FOUND",message:"Event not found"}},{status:404});}
