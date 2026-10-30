import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { authError, db, requireToken } from "../../../../../../lib/admin";
import { audit } from "../../../../../../lib/audit";
const schema=z.object({status:z.enum(["approved","rejected","needs_changes"]),reviewNotes:z.string().max(2000).optional()});
export async function POST(request:NextRequest,{params}:{params:Promise<{id:string}>}){try{const user=await requireToken(request,["admin","editor"]);const body=schema.safeParse(await request.json());if(!body.success)return NextResponse.json({error:{code:"VALIDATION_ERROR",message:"Invalid review"}},{status:400});const {id}=await params;const store=db();if(!store)throw new Error("AUTH_UNAVAILABLE");await store.collection("submissions").doc(id).set({...body.data,reviewedAt:new Date().toISOString(),reviewedBy:user.uid},{merge:true});await audit(user.uid,"submission.reviewed","submission",id,body.data);return NextResponse.json({data:{id,...body.data}});}catch(e){return authError(e)}}
