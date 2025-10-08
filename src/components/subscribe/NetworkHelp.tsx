import Link from "next/link";

export default function NetworkHelp() {
  return (
    <section
      id="network-help"
      className="rounded-2xl border p-5 border-zinc-200 bg-white/70 text-zinc-900
                 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-100"
    >
      <h3 className="text-sm font-semibold">Datos de la red PASEO</h3>
      <ul className="mt-3 space-y-1 text-sm text-zinc-700 dark:text-zinc-300">
        <li><strong>Nombre:</strong> Paseo PassetHub</li>
        <li><strong>URL RPC:</strong> https://testnet-passet-hub-eth-rpc.polkadot.io</li>
        <li><strong>ChainID:</strong> 420420422</li>
        <li><strong>Símbolo:</strong> PAS</li>
      </ul>
      <p className="mt-3 text-xs">
        <Link
          href="https://chainlist.org/?testnets=true&search=Paseo"
          target="_blank"
          className="underline underline-offset-2 hover:text-zinc-900 dark:hover:text-zinc-100"
        >
          ChainList — Verifica los datos de la red
        </Link>
      </p>
    </section>
  );
}
