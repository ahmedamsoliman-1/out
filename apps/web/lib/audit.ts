import { db } from "./admin";
export async function audit(actorUid:string,action:string,entityType:string,entityId:string,after?:unknown){const store=db();if(!store)return;await store.collection("adminAuditLogs").add({actorUid,action,entityType,entityId,after:after??null,at:new Date().toISOString()});}
