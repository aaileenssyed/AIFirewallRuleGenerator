import { ShieldAlert, ShieldCheck } from 'lucide-react';
import { ComparisonExample } from '../services/firewallGenerator';

interface ComparisonPanelProps {
  comparison: ComparisonExample;
}

export default function ComparisonPanel({ comparison }: ComparisonPanelProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Secure vs Insecure Comparison</h2>
        <p className="text-gray-600">
          Learn why least-privilege firewall rules are more secure than permissive configurations.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="border-2 border-red-300 rounded-lg overflow-hidden">
          <div className="bg-red-50 px-4 py-3 border-b border-red-300">
            <div className="flex items-center gap-2">
              <ShieldAlert className="text-red-600" size={24} />
              <h3 className="font-bold text-red-900">Insecure Approach</h3>
            </div>
          </div>
          <div className="p-4">
            <div className="bg-gray-900 rounded p-3 mb-4">
              {comparison.insecure.rules.map((rule, idx) => (
                <code key={idx} className="block text-red-400 font-mono text-sm mb-1">
                  {rule}
                </code>
              ))}
            </div>
            <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
              {comparison.insecure.why}
            </div>
          </div>
        </div>

        <div className="border-2 border-green-300 rounded-lg overflow-hidden">
          <div className="bg-green-50 px-4 py-3 border-b border-green-300">
            <div className="flex items-center gap-2">
              <ShieldCheck className="text-green-600" size={24} />
              <h3 className="font-bold text-green-900">Secure Approach (Generated)</h3>
            </div>
          </div>
          <div className="p-4">
            <div className="bg-gray-900 rounded p-3 mb-4">
              {comparison.secure.rules.map((rule, idx) => (
                <code key={idx} className="block text-green-400 font-mono text-sm mb-1">
                  {rule}
                </code>
              ))}
            </div>
            <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
              {comparison.secure.why}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm font-semibold text-blue-900 mb-2">Key Takeaway:</p>
        <p className="text-sm text-blue-800">
          Default-deny policies follow the principle of least privilege. You explicitly allow what
          is needed and deny everything else. This protects you from misconfigurations and reduces
          your attack surface.
        </p>
      </div>
    </div>
  );
}
