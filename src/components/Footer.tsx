import Image from "next/image";
import { copy } from "../lib/copy";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-5 py-10 sm:flex-row sm:justify-between">
        {/* Logo auto-swap según tema */}
        <div className="flex items-center gap-3">
          <Image
            src="/brand/dotcare_dark.png"
            alt="DOTCARE"
            width={110}
            height={28}
            className="hidden dark:block"
            priority
          />
          <Image
            src="/brand/dotcare_light.png"
            alt="DOTCARE"
            width={110}
            height={28}
            className="block dark:hidden"
            priority
          />
          <span className="text-xs text-muted">wellness for builders</span>
        </div>

        <p className="text-xs text-muted text-center sm:text-right">
          {copy.footer.rights}
        </p>
      </div>
    </footer>
  );
}
