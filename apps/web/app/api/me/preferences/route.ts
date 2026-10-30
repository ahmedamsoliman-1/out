import { NextRequest, NextResponse } from "next/server";
import { preferencesSchema } from "@yella/types";
import { authError, db, requireToken } from "../../../../lib/admin";
export async function GET(request:NextRequest){try{const user=await requireToken(request);const snap=await db()?.collection("users").doc(user.uid).get();return NextResponse.json({data:snap?.exists?snap.data()?.preferences:null});}catch(e){return authError(e)}}
export async function PUT(request:NextRequest){try{const user=await requireToken(request);const parsed=preferencesSchema.safeParse(await request.json());if(!parsed.success)return NextResponse.json({error:{code:"VALIDATION_ERROR",message:"Invalid preferences"}},{status:400});const store=db();if(!store)throw new Error("AUTH_UNAVAILABLE");await store.collection("users").doc(user.uid).set({preferences:parsed.data,updatedAt:new Date().toISOString()},{merge:true});return NextResponse.json({data:parsed.data});}catch(e){return authError(e)}}
