import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth, type DecodedIdToken } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

function adminApp() { if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) return null; return getApps()[0] ?? initializeApp({credential:cert({projectId:process.env.FIREBASE_PROJECT_ID,clientEmail:process.env.FIREBASE_CLIENT_EMAIL,privateKey:process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g,"\n")})}); }
export const db = () => { const app=adminApp(); return app ? getFirestore(app) : null; };
export async function requireToken(request: Request, roles?: string[]): Promise<DecodedIdToken> { const value=request.headers.get("authorization"); if(!value?.startsWith("Bearer ")) throw new Error("UNAUTHENTICATED"); const app=adminApp(); if(!app) throw new Error("AUTH_UNAVAILABLE"); const token=await getAuth(app).verifyIdToken(value.slice(7)); const role=String(token.role ?? "user"); if(roles && !roles.includes(role)) throw new Error("FORBIDDEN"); return token; }
export function authError(error: unknown) { const code=error instanceof Error?error.message:"UNKNOWN"; const status=code==="UNAUTHENTICATED"?401:code==="FORBIDDEN"?403:503; return Response.json({error:{code,message:code==="AUTH_UNAVAILABLE"?"Authentication is not configured on this deployment.":"You are not allowed to perform this action."}},{status}); }
