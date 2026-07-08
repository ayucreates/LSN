import { X, Ruler } from 'lucide-react';

interface SizeGuideProps {
  onClose: () => void;
}

const WOMEN_SIZES = [
  { size: 'XS', bust: '30-32', waist: '24-26', hips: '32-34' },
  { size: 'S', bust: '32-34', waist: '26-28', hips: '34-36' },
  { size: 'M', bust: '34-36', waist: '28-30', hips: '36-38' },
  { size: 'L', bust: '36-38', waist: '30-32', hips: '38-40' },
  { size: 'XL', bust: '38-41', waist: '32-35', hips: '40-43' },
  { size: 'XXL', bust: '41-44', waist: '35-38', hips: '43-46' },
];

const MEN_SIZES = [
  { size: 'S', chest: '34-36', waist: '28-30', shoulders: '16-17' },
  { size: 'M', chest: '36-38', waist: '30-32', shoulders: '17-18' },
  { size: 'L', chest: '38-40', waist: '32-34', shoulders: '18-19' },
  { size: 'XL', chest: '40-42', waist: '34-36', shoulders: '19-20' },
  { size: 'XXL', chest: '42-44', waist: '36-38', shoulders: '20-21' },
];

const KIDS_SIZES = [
  { size: '2-3Y', height: '85-95', chest: '20-21', waist: '19-20' },
  { size: '4-5Y', height: '100-110', chest: '21-22', waist: '20-21' },
  { size: '6-7Y', height: '115-125', chest: '22-23', waist: '21-22' },
  { size: '8-9Y', height: '130-140', chest: '23-25', waist: '22-23' },
  { size: '10-12Y', height: '145-155', chest: '25-27', waist: '23-25' },
];

export function SizeGuide({ onClose }: SizeGuideProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gold-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Ruler className="w-5 h-5 text-gold-500" /> Size Guide
          </h2>
          <button onClick={onClose} className="p-1 text-gray-500 hover:text-gray-900"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-6 space-y-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Women's Size Chart (in inches)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gold-50">
                    <th className="text-left px-3 py-2 text-xs font-semibold text-gray-600">Size</th>
                    <th className="text-left px-3 py-2 text-xs font-semibold text-gray-600">Bust</th>
                    <th className="text-left px-3 py-2 text-xs font-semibold text-gray-600">Waist</th>
                    <th className="text-left px-3 py-2 text-xs font-semibold text-gray-600">Hips</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold-100">
                  {WOMEN_SIZES.map((row) => (
                    <tr key={row.size} className="hover:bg-gold-50/50">
                      <td className="px-3 py-2 font-medium text-gray-900">{row.size}</td>
                      <td className="px-3 py-2 text-gray-600">{row.bust}</td>
                      <td className="px-3 py-2 text-gray-600">{row.waist}</td>
                      <td className="px-3 py-2 text-gray-600">{row.hips}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Men's Size Chart (in inches)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gold-50">
                    <th className="text-left px-3 py-2 text-xs font-semibold text-gray-600">Size</th>
                    <th className="text-left px-3 py-2 text-xs font-semibold text-gray-600">Chest</th>
                    <th className="text-left px-3 py-2 text-xs font-semibold text-gray-600">Waist</th>
                    <th className="text-left px-3 py-2 text-xs font-semibold text-gray-600">Shoulders</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold-100">
                  {MEN_SIZES.map((row) => (
                    <tr key={row.size} className="hover:bg-gold-50/50">
                      <td className="px-3 py-2 font-medium text-gray-900">{row.size}</td>
                      <td className="px-3 py-2 text-gray-600">{row.chest}</td>
                      <td className="px-3 py-2 text-gray-600">{row.waist}</td>
                      <td className="px-3 py-2 text-gray-600">{row.shoulders}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Kids' Size Chart (height in cm)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gold-50">
                    <th className="text-left px-3 py-2 text-xs font-semibold text-gray-600">Age</th>
                    <th className="text-left px-3 py-2 text-xs font-semibold text-gray-600">Height</th>
                    <th className="text-left px-3 py-2 text-xs font-semibold text-gray-600">Chest</th>
                    <th className="text-left px-3 py-2 text-xs font-semibold text-gray-600">Waist</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold-100">
                  {KIDS_SIZES.map((row) => (
                    <tr key={row.size} className="hover:bg-gold-50/50">
                      <td className="px-3 py-2 font-medium text-gray-900">{row.size}</td>
                      <td className="px-3 py-2 text-gray-600">{row.height}</td>
                      <td className="px-3 py-2 text-gray-600">{row.chest}</td>
                      <td className="px-3 py-2 text-gray-600">{row.waist}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-gold-50 rounded-lg p-4 text-sm text-gray-600">
            <p className="font-medium text-gray-900 mb-1">Fit Tips</p>
            <ul className="space-y-1 text-xs">
              <li><span className="font-medium">Free Size:</span> One-size-fits-most design (check product description)</li>
              <li><span className="font-medium">Ethnic Wear:</span> Kurtis & suits run slightly loose for comfort</li>
              <li><span className="font-medium">Western Wear:</span> Tops & dresses follow standard body measurements</li>
              <li><span className="font-medium">Kids:</span> Size up for room to grow</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
