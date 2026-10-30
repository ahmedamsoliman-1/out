import { NextRequest, NextResponse } from "next/server";
import { authError, db, requireToken } from "../../../../lib/admin";
export async function GET(request:NextRequest){try{await requireToken(request,["admin","editor"]);const store=db();if(!store)throw new Error("AUTH_UNAVAILABLE");const docs=await store.collection("submissions").where("status","==","in_review").orderBy("createdAt","desc").limit(50).get();return NextResponse.json({data:docs.docs.map(d=>({id:d.id,...d.data()}))});}catch(e){return authError(e)}}
