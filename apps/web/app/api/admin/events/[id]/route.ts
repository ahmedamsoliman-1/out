import { NextRequest, NextResponse } from "next/server";
import { eventSchema } from "@yella/types";
import { authError, db, requireToken } from "../../../../../lib/admin";
import { audit } from "../../../../../lib/audit";
export async function PATCH(request:NextRequest,{params}:{params:Promise<{id:string}>}){try{const user=await requireToken(request,["admin","editor"]);const {id}=await params;const patch=eventSchema.partial().safeParse(await request.json());if(!patch.success)return NextResponse.json({error:{code:"VALIDATION_ERROR",message:"Invalid event update"}},{status:400});const store=db();if(!store)throw new Error("AUTH_UNAVAILABLE");await store.collection("events").doc(id).set({...patch.data,updatedAt:new Date().toISOString()},{merge:true});await audit(user.uid,"event.updated","event",id,patch.data);return NextResponse.json({data:{id,...patch.data}});}catch(e){return authError(e)}}
