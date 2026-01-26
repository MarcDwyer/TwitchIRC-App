export function generateState(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

export async function openBrowser(url: string): Promise<void> {
  const platform = Deno.build.os;
  const command = platform === "windows" 
    ? ["rundll32", "url.dll,FileProtocolHandler", url]
    : platform === "darwin"
    ? ["open", url]
    : ["xdg-open", url];
  
  const process = Deno.run({ cmd: command, stdout: "null", stderr: "null" });
  await process.status();
  process.close();
}

export function parseFragment(fragment: string): Record<string, string> {
  const params: Record<string, string> = {};
  const pairs = fragment.substring(1).split('&');
  for (const pair of pairs) {
    const [key, value] = pair.split('=');
    if (key && value) params[key] = decodeURIComponent(value);
  }
  return params;
}
