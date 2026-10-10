import React from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { evaluateContrast, type WcagEvaluation } from '../../utils/themeContrast';

export interface ContrastRatioCardProps {
  primaryAccent: string;
}

export const ContrastRatioCard: React.FC<ContrastRatioCardProps> = ({
  primaryAccent,
}) => {
  const evaluation: WcagEvaluation = evaluateContrast(primaryAccent);

  const levelStyles = {
    AAA: {
      badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      label: 'ممتاز — معيار AAA (فائق الوضوح)',
      icon: CheckCircle2,
    },
    AA: {
      badge: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
      label: 'جيد — معيار AA القياسي (مطابق)',
      icon: ShieldCheck,
    },
    FAIL: {
      badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      label: 'تنبيه — تباين ضعيف (FAIL)',
      icon: AlertTriangle,
    },
  }[evaluation.level];

  const Icon = levelStyles.icon;

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-[#090d16] border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-300">
          تحليل التباين وإمكانية الوصول (WCAG 2.1)
        </span>
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold border font-mono ${levelStyles.badge}`}
        >
          {evaluation.level}
        </span>
      </div>

      <div className="flex items-center justify-between gap-3.5 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-slate-800 text-amber-400">
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-white block">
              نسبة التباين: <span className="font-mono text-amber-400">{evaluation.ratioFormatted}</span>
            </span>
            <span className="text-[11px] text-slate-400">
              {levelStyles.label}
            </span>
          </div>
        </div>

        {/* Live Button Text Preview */}
        <div className="flex flex-col items-end">
          <span className="text-[10px] text-slate-500 mb-1">اللون الأمثل للنص:</span>
          <div
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-sm"
            style={{
              backgroundColor: primaryAccent,
              color: evaluation.textColor,
            }}
          >
            نص الأزرار
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContrastRatioCard;
