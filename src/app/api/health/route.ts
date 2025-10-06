export const revalidate = 0;

export async function GET() {
  const wc = !!process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;
  const rpc = !!process.env.NEXT_PUBLIC_RPC_URL;
  const chain = process.env.NEXT_PUBLIC_CHAIN_ID || "";

  return Response.json({
    ok: true,
    stack: "next-app-router",
    paseo: { chainId: chain, rpcConfigured: rpc },
    walletconnect: wc,
    supabaseEnv: !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    time: new Date().toISOString(),
  });
}
