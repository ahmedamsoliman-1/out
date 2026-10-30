import { NextRequest, NextResponse } from "next/server";
import { eventSchema } from "@yella/types";
import { authError, db, requireToken } from "../../../../lib/admin";
import { audit } from "../../../../lib/audit";
export async function GET(request:NextRequest){try{await requireToken(request,["admin","editor"]);const store=db();if(!store)throw new Error("AUTH_UNAVAILABLE");const docs=await store.collection("events").orderBy("updatedAt","desc").limit(50).get();return NextResponse.json({data:docs.docs.map(d=>({id:d.id,...d.data()}))});}catch(e){return authError(e)}}
export async function POST(request:NextRequest){try{const user=await requireToken(request,["admin","editor"]);const parsed=eventSchema.safeParse(await request.json());if(!parsed.success)return NextResponse.json({error:{code:"VALIDATION_ERROR",message:"Invalid event"}},{status:400});const store=db();if(!store)throw new Error("AUTH_UNAVAILABLE");await store.collection("events").doc(parsed.data.id).set(parsed.data);await audit(user.uid,"event.created","event",parsed.data.id,parsed.data);return NextResponse.json({data:parsed.data},{status:201});}catch(e){return authError(e)}}
