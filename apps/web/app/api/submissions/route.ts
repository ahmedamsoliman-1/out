import { NextRequest, NextResponse } from "next/server";
import { submissionSchema } from "@yella/types";
import { db } from "../../../lib/admin";
import { allow } from "../../../lib/rate-limit";
export async function POST(request: NextRequest) {
  const ip=request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const rate=await allow(`rate:submission:${ip}`,5,3600);
  if(!rate.allowed) return NextResponse.json({error:{code:"RATE_LIMITED",message:"Please try again later."}},{status:429});
  const type=request.headers.get("content-type")||"";
  const body=type.includes("application/json")?await request.json():Object.fromEntries((await request.formData()).entries());
  const normalized={...body,startAt: body.startAt ? new Date(String(body.startAt)).toISOString() : body.startAt,permissionsConfirmed: body.permissionsConfirmed === true || body.permissionsConfirmed === "on"};
  const parsed=submissionSchema.safeParse(normalized);
  if(!parsed.success)return NextResponse.json({error:{code:"VALIDATION_ERROR",message:"Please complete the required fields with valid details."}},{status:400});
  const id=crypto.randomUUID(); const store=db();
  if(store) await store.collection("submissions").doc(id).set({...parsed.data,id,status:"in_review",createdAt:new Date().toISOString(),source:"public_form"});
  return NextResponse.json({data:{id,status:"in_review",persisted:Boolean(store),message:"Thanks — your submission is now in editorial review."}},{status:201});
}
