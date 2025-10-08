import WalletSection from "./WalletSection";
import NetworkHelp from "./NetworkHelp";
import TermsCheck from "./TermsCheck";
import ConfirmTransferButton from "./ConfirmTransferButton";

type Props = {
  termsChecked: boolean;
  onTermsChange: (v: boolean) => void;

  onConfirmTransfer: () => void;
  confirmDisabled: boolean;
  confirming: boolean;
  confirmError: string | null;
};

export default function RightPanel({
  termsChecked,
  onTermsChange,
  onConfirmTransfer,
  confirmDisabled,
  confirming,
  confirmError,
}: Props) {
  return (
    <div id="right-panel" className="space-y-6">
      <WalletSection />
      <NetworkHelp />
      <TermsCheck checked={termsChecked} onChange={onTermsChange} />
      <ConfirmTransferButton
        disabled={confirmDisabled}
        loading={confirming}
        errorText={confirmError}
        onConfirm={onConfirmTransfer}
      />
    </div>
  );
}
