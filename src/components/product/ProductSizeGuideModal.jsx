"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Ruler } from "lucide-react";
import { cn } from "@/lib/utils";

const SIZE_CHART = [
  { size: "XS", in: { chest: "34–36", waist: "28–30", hip: "35–37", length: "26" }, cm: { chest: "86–91", waist: "71–76", hip: "89–94", length: "66" } },
  { size: "S", in: { chest: "36–38", waist: "30–32", hip: "37–39", length: "27" }, cm: { chest: "91–96", waist: "76–81", hip: "94–99", length: "68" } },
  { size: "M", in: { chest: "38–40", waist: "32–34", hip: "39–41", length: "28" }, cm: { chest: "96–101", waist: "81–86", hip: "99–104", length: "71" } },
  { size: "L", in: { chest: "40–42", waist: "34–36", hip: "41–43", length: "29" }, cm: { chest: "101–106", waist: "86–91", hip: "104–109", length: "74" } },
  { size: "XL", in: { chest: "42–44", waist: "36–38", hip: "43–45", length: "30" }, cm: { chest: "106–112", waist: "91–96", hip: "109–114", length: "76" } },
  { size: "XXL", in: { chest: "44–46", waist: "38–40", hip: "45–47", length: "31" }, cm: { chest: "112–117", waist: "96–102", hip: "114–119", length: "79" } },
];

export default function ProductSizeGuideModal({ trigger }) {
  const [unit, setUnit] = useState("in");

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <button
            type="button"
            className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-600 underline-offset-2 hover:text-black hover:underline"
          >
            <Ruler size={13} />
            Size Guide
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md sm:max-w-lg p-5 sm:p-6 bg-white border border-neutral-200">
        <DialogHeader className="pb-3 border-b border-neutral-200">
          <div className="flex items-center justify-between pr-6">
            <DialogTitle className="text-lg font-black tracking-tight text-neutral-950 flex items-center gap-2">
              <Ruler size={18} className="text-[#fdd835]" />
              Size Guide & Measurements
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs text-neutral-500">
            Standard regular fit measurements ({unit.toUpperCase()})
          </p>
          <div className="inline-flex rounded-xs border border-neutral-200 bg-neutral-100 p-0.5 text-xs font-bold">
            <button
              type="button"
              onClick={() => setUnit("in")}
              className={cn(
                "px-2.5 py-1 rounded-xs transition",
                unit === "in" ? "bg-white text-black shadow-xs" : "text-neutral-500 hover:text-black"
              )}
            >
              IN
            </button>
            <button
              type="button"
              onClick={() => setUnit("cm")}
              className={cn(
                "px-2.5 py-1 rounded-xs transition",
                unit === "cm" ? "bg-white text-black shadow-xs" : "text-neutral-500 hover:text-black"
              )}
            >
              CM
            </button>
          </div>
        </div>

        <div className="mt-3 overflow-hidden rounded-xs border border-neutral-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 text-[11px] font-bold uppercase tracking-wider text-neutral-600 border-b border-neutral-200">
              <tr>
                <th className="py-2.5 px-3">Size</th>
                <th className="py-2.5 px-3">Chest</th>
                <th className="py-2.5 px-3">Waist</th>
                <th className="py-2.5 px-3">Hip</th>
                <th className="py-2.5 px-3">Length</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 bg-white font-medium text-neutral-800">
              {SIZE_CHART.map((row) => (
                <tr key={row.size} className="hover:bg-neutral-50/70">
                  <td className="py-2.5 px-3 font-bold text-black">{row.size}</td>
                  <td className="py-2.5 px-3">{row[unit].chest}</td>
                  <td className="py-2.5 px-3">{row[unit].waist}</td>
                  <td className="py-2.5 px-3">{row[unit].hip}</td>
                  <td className="py-2.5 px-3">{row[unit].length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 rounded-xs bg-neutral-50 p-3 text-[11px] text-neutral-600 space-y-1">
          <p className="font-bold text-black text-xs">How to Measure:</p>
          <p><span className="font-semibold text-neutral-800">Chest/Bust:</span> Measure around the fullest part of your chest, keeping the tape level.</p>
          <p><span className="font-semibold text-neutral-800">Waist:</span> Measure around your natural waistline, where your trousers usually sit.</p>
          <p><span className="font-semibold text-neutral-800">Length:</span> Measured from the highest point of the shoulder down to the hem.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

