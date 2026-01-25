#!/usr/bin/env -S deno run --allow-net --allow-read --allow-write --allow-run --allow-env

import { load } from "jsr:@std/dotenv@^0.221.0";

const env = await load();
const clientId = env["TWITCH_CLIENT_ID"];
// #region agent log
fetch('http://127.0.0.1:7243/ingest/8d7d4f1a-6ef5-4407-989d-16acc9457a89',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'get_token.ts:7',message:'Before authUrl construction',data:{clientId,stateExists:typeof state !== 'undefined',stateValue:typeof state !== 'undefined' ? state : 'UNDEFINED'},timestamp:Date.now(),sessionId:'debug-session',runId:'initial',hypothesisId:'A,B'})}).catch(()=>{});
// #endregion

function generateState(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

async function openBrowser(url: string): Promise<void> {
  const platform = Deno.build.os;
  const command = platform === "windows" 
    ? ["cmd", "/c", "start", url]
    : platform === "darwin"
    ? ["open", url]
    : ["xdg-open", url];
  console.log({command});
  // #region agent log
  fetch('http://127.0.0.1:7243/ingest/8d7d4f1a-6ef5-4407-989d-16acc9457a89',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'get_token.ts:30',message:'openBrowser called',data:{url,command},timestamp:Date.now(),sessionId:'debug-session',runId:'initial',hypothesisId:'D'})}).catch(()=>{});
  // #endregion
  const process = Deno.run({ cmd: command, stdout: "null", stderr: "null" });
  await process.status();
  process.close();
}

function parseFragment(fragment: string): Record<string, string> {
  const params: Record<string, string> = {};
  const pairs = fragment.substring(1).split('&');
  for (const pair of pairs) {
    const [key, value] = pair.split('=');
    if (key && value) params[key] = decodeURIComponent(value);
  }
  return params;
}

const state = generateState();
// #region agent log
fetch('http://127.0.0.1:7243/ingest/8d7d4f1a-6ef5-4407-989d-16acc9457a89',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'get_token.ts:47',message:'After state generation',data:{state,stateLength:state.length},timestamp:Date.now(),sessionId:'debug-session',runId:'initial',hypothesisId:'A,C'})}).catch(()=>{});
// #endregion
const authUrl = `https://id.twitch.tv/oauth2/authorize?response_type=token&client_id=${clientId}&redirect_uri=http://localhost:3000&scope=chat%3Aread%20chat%3Aedit&state=${state}`;
// #region agent log
fetch('http://127.0.0.1:7243/ingest/8d7d4f1a-6ef5-4407-989d-16acc9457a89',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'get_token.ts:50',message:'After authUrl construction',data:{authUrl,authUrlLength:authUrl.length},timestamp:Date.now(),sessionId:'debug-session',runId:'initial',hypothesisId:'A,C'})}).catch(()=>{});
// #endregion

const server = Deno.serve({
  port: 3000,
  onListen: () => {
    console.log("Server started. Opening browser...", {authUrl});
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/8d7d4f1a-6ef5-4407-989d-16acc9457a89',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'get_token.ts:57',message:'In onListen callback',data:{authUrl,state},timestamp:Date.now(),sessionId:'debug-session',runId:'initial',hypothesisId:'C,E'})}).catch(()=>{});
    // #endregion
    openBrowser(authUrl);
    console.log("Waiting for authorization...");
  }
}, async (req) => {
  const url = new URL(req.url);
  if (url.pathname === "/" && url.hash) {
    const params = parseFragment(url.hash);
    
    if (params.state !== state) {
      return new Response("State mismatch", { status: 403 });
    }
    
    if (params.error) {
      return new Response(`Error: ${params.error_description || params.error}`, { status: 400 });
    }
    
    if (params.access_token) {
      const token = `oauth:${params.access_token}`;
      const envContent = await Deno.readTextFile(".env");
      const updated = envContent.includes("TWITCH_OAUTH_TOKEN")
        ? envContent.replace(/TWITCH_OAUTH_TOKEN=.*/g, `TWITCH_OAUTH_TOKEN=${token}`)
        : `${envContent.trim()}\nTWITCH_OAUTH_TOKEN=${token}\n`;
      
      await Deno.writeTextFile(".env", updated);
      
      setTimeout(() => {
        server.shutdown();
        Deno.exit(0);
      }, 1000);
      
      return new Response("Token saved! You can close this window.", { status: 200 });
    }
  }
  
  return new Response("Waiting for authorization...", { status: 200 });
});
