import ProductBox from "./ProductBox";
import PlanSelector from "./PlanSelector";
import CouponField from "./CouponField";
import OrderSummary from "./OrderSummary";
import OrderDetailsModal from "./OrderDetailsModal";
import type { Plan } from "@/lib/pricing";

type Props = {
  plan: Plan;
  onPlanChange: (p: Plan) => void;

  couponCode: string;
  onCouponChange: (v: string) => void;
  couponValidFormat: boolean;

  onApplyCoupon: () => void;
  couponApplyDisabled: boolean;
  applyError: string | null;

  totalDueTodayText: string;
  nextCharge: string;

  detailsOpen: boolean;
  onOpenDetails: () => void;
  onCloseDetails: () => void;

  basePriceCents: number;
  discountBps: number;
  finalPriceCents: number;

  loadingSession: boolean;
};

export default function LeftPanel({
  plan,
  onPlanChange,
  couponCode,
  onCouponChange,
  couponValidFormat,
  onApplyCoupon,
  couponApplyDisabled,
  applyError,
  totalDueTodayText,
  nextCharge,
  detailsOpen,
  onOpenDetails,
  onCloseDetails,
  basePriceCents,
  discountBps,
  finalPriceCents,
  loadingSession,
}: Props) {
  return (
    <div id="left-panel" className="space-y-6">
      <ProductBox />
      <PlanSelector plan={plan} onChange={onPlanChange} />
      <CouponField
        value={couponCode}
        onChange={onCouponChange}
        validFormat={couponValidFormat}
        onApply={onApplyCoupon}
        applyDisabled={couponApplyDisabled}
        errorText={applyError}
      />
      <OrderSummary
        totalText={totalDueTodayText}
        nextChargeText={nextCharge}
        onOpenDetails={onOpenDetails}
      />
      <OrderDetailsModal
        open={detailsOpen}
        onClose={onCloseDetails}
        basePriceCents={basePriceCents}
        discountBps={discountBps}
        finalPriceCents={finalPriceCents}
      />
      {loadingSession && (
        <p className="text-xs text-zinc-400">Creando sesión de checkout…</p>
      )}
    </div>
  );
}
