import { Redis } from "@upstash/redis";
const client = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN ? Redis.fromEnv() : null;
export async function allow(key:string, limit:number, seconds:number){
  if(!client) return { allowed:true, remaining:limit, mode:"unconfigured" as const };
  const count=await client.incr(key); if(count===1) await client.expire(key,seconds);
  return {allowed:count<=limit,remaining:Math.max(0,limit-count),mode:"redis" as const};
}
