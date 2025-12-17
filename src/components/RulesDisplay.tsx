import { useState } from 'react';
import { Copy, Check, Shield, AlertTriangle, Info } from 'lucide-react';
import { FirewallRule, SecurityWarning, ScoreBreakdown } from '../services/firewallGenerator';

interface RulesDisplayProps {
  rules: FirewallRule[];
  warnings: SecurityWarning[];
  score: number;
  scoreBreakdown: ScoreBreakdown[];
}

export default function RulesDisplay({
  rules,
  warnings,
  score,
  scoreBreakdown,
}: RulesDisplayProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    const rulesText = rules.map((r) => r.rule).join('\n');
    navigator.clipboard.writeText(rulesText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-50 border-green-200';
    if (score >= 60) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="text-red-600" size={20} />;
      case 'warning':
        return <AlertTriangle className="text-yellow-600" size={20} />;
      default:
        return <Info className="text-blue-600" size={20} />;
    }
  };

  const getSeverityBg = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className={`rounded-lg border-2 p-6 ${getScoreBgColor(score)}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Shield size={32} className={getScoreColor(score)} />
            <div>
              <h3 className="text-lg font-bold text-gray-900">Least-Privilege Score</h3>
              <p className="text-sm text-gray-600">Security assessment of your configuration</p>
            </div>
          </div>
          <div className={`text-5xl font-bold ${getScoreColor(score)}`}>{score}</div>
        </div>

        <div className="space-y-2 mt-4">
          {scoreBreakdown.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between text-sm">
              <span className="text-gray-700">{item.category}</span>
              <div className="flex items-center gap-2">
                <span
                  className={`font-semibold ${
                    item.points === item.maxPoints
                      ? 'text-green-600'
                      : item.points > 0
                      ? 'text-yellow-600'
                      : 'text-red-600'
                  }`}
                >
                  {item.points}/{item.maxPoints}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-300">
          <p className="text-sm text-gray-700 font-medium">Score Breakdown:</p>
          {scoreBreakdown.map((item, idx) => (
            <p key={idx} className="text-xs text-gray-600 mt-1">
              • {item.reason}
            </p>
          ))}
        </div>
      </div>

      {warnings.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-gray-900">Security Warnings</h3>
          {warnings.map((warning, idx) => (
            <div key={idx} className={`rounded-lg border p-4 ${getSeverityBg(warning.severity)}`}>
              <div className="flex items-start gap-3">
                {getSeverityIcon(warning.severity)}
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 mb-1">{warning.message}</p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Recommendation:</span> {warning.recommendation}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-gray-900 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">Generated iptables Rules</h3>
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm font-medium"
          >
            {copied ? (
              <>
                <Check size={16} />
                Copied!
              </>
            ) : (
              <>
                <Copy size={16} />
                Copy All
              </>
            )}
          </button>
        </div>

        <div className="space-y-4">
          {rules.map((rule, idx) => (
            <div key={idx} className="space-y-2">
              <code className="block text-green-400 font-mono text-sm bg-gray-800 p-3 rounded">
                {rule.rule}
              </code>
              <div className="pl-3 border-l-2 border-gray-700 space-y-1">
                <p className="text-sm text-gray-300">
                  <span className="font-semibold text-white">What:</span> {rule.explanation}
                </p>
                <p className="text-sm text-gray-300">
                  <span className="font-semibold text-white">Why:</span> {rule.threat}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-700">
          <p className="text-xs text-gray-400">
            Educational Purpose Only - Review each rule before applying to production systems
          </p>
        </div>
      </div>
    </div>
  );
}
