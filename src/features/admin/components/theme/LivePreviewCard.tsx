import React from 'react';
import { Sparkles, PhoneCall } from 'lucide-react';
import { useAdminLanguage } from '../../context/AdminLanguageContext';
import { MealAssets } from '../../../../utils/imageRegistry';
import type { ThemeTokenConfig } from '../../types/settings.types';

interface LivePreviewCardProps {
  tokens: ThemeTokenConfig;
}

export const LivePreviewCard: React.FC<LivePreviewCardProps> = ({ tokens }) => {
  const { isRTL } = useAdminLanguage();
  const sampleAsset = MealAssets['shawarma-tower'];

  return (
    <div className="rounded-3xl border border-white/10 p-6 sm:p-8 space-y-6 bg-[#0f172a]">
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${tokens.primaryAccent}20`, color: tokens.primaryAccent }}
          >
            <Sparkles size={20} />
          </div>
          <div>
            <h4 className="text-base font-bold text-white">
              {isRTL ? 'معاينة المظهر الحية' : 'Live Theme Palette Preview'}
            </h4>
            <p className="text-xs text-slate-400">
              {isRTL
                ? 'كيف يظهر اللون المخصص وعناصر الواجهة الفاخرة للزبائن'
                : 'Real-time simulation of customer-facing components'}
            </p>
          </div>
        </div>
      </div>

      {/* Simulated Storefront Card */}
      <div
        className="rounded-3xl p-6 border shadow-2xl transition-all max-w-sm mx-auto"
        style={{
          backgroundColor: tokens.darkSurface,
          borderColor: tokens.darkBorder || `${tokens.primaryAccent}40`,
        }}
      >
        <div className="relative h-44 rounded-2xl overflow-hidden mb-4 bg-slate-950">
          {sampleAsset && (
            <img
              src={sampleAsset.src}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute top-3 start-3">
            <span
              className="text-[11px] font-extrabold px-3 py-1 rounded-full text-slate-950 shadow-md"
              style={{ backgroundColor: tokens.primaryAccent }}
            >
              {isRTL ? 'توقيع مايسترو' : 'Maestro Signature'}
            </span>
          </div>
        </div>

        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h5 className="font-bold text-white text-base">
              {isRTL ? 'برج شاورما مايسترو الملكي' : 'Royal Shawarma Tower'}
            </h5>
            <span
              className="font-extrabold text-base tracking-tight"
              style={{ color: tokens.primaryAccent }}
            >
              240,000 {isRTL ? 'ل.س' : 'SYP'}
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            {isRTL
              ? 'لفائف الشاورما الملكية المقرمشة مع صوصات التومية الشامية الفاخرة.'
              : 'Crisp golden shawarma rolls served with authentic Damascus toum.'}
          </p>

          <div className="pt-2">
            <button
              type="button"
              className="w-full py-2.5 px-4 rounded-xl font-bold text-slate-950 text-xs shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
              style={{
                backgroundColor: tokens.primaryAccent,
                boxShadow: `0 8px 20px ${tokens.primaryAccent}33`,
              }}
            >
              <PhoneCall size={14} />
              <span>{isRTL ? 'اطلب الآن عبر واتساب' : 'Order Now via WhatsApp'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
