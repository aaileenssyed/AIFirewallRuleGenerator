import { BookOpen, Lightbulb, AlertCircle } from 'lucide-react';

interface LearningPanelProps {
  learningPoints: string[];
}

export default function LearningPanel({ learningPoints }: LearningPanelProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
      <div className="flex items-center gap-3 mb-6">
        <BookOpen className="text-blue-600" size={32} />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Learning & Reflection</h2>
          <p className="text-gray-600">Understand the security principles behind these rules</p>
        </div>
      </div>

      <div className="space-y-4">
        {learningPoints.map((point, idx) => (
          <div key={idx} className="flex items-start gap-3">
            <Lightbulb className="text-yellow-500 flex-shrink-0 mt-1" size={20} />
            <p className="text-gray-700 leading-relaxed">{point}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-orange-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <p className="font-semibold text-orange-900 mb-2">
                Critical Warning: Never Blindly Trust AI-Generated Rules
              </p>
              <div className="text-sm text-orange-800 space-y-2">
                <p>
                  While this tool generates secure firewall rules based on best practices, you
                  should always:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Understand each rule before applying it to production</li>
                  <li>Test rules in a staging environment first</li>
                  <li>Consider your specific infrastructure and security requirements</li>
                  <li>Maintain backups of existing firewall configurations</li>
                  <li>Monitor logs after implementing new rules</li>
                  <li>Review rules regularly as your infrastructure evolves</li>
                </ul>
                <p className="mt-2 font-medium">
                  A firewall misconfiguration can either lock you out of your server or expose it
                  to attacks. Always proceed with caution.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-2">Additional Resources</h3>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>
            • Study the Linux iptables documentation to understand rule syntax and chains
          </li>
          <li>
            • Learn about stateful vs stateless firewalls and connection tracking
          </li>
          <li>
            • Explore defense-in-depth strategies beyond just firewall configuration
          </li>
          <li>
            • Practice in virtual machines or containers before touching production systems
          </li>
          <li>
            • Consider using firewall management tools like UFW or firewalld for easier administration
          </li>
        </ul>
      </div>
    </div>
  );
}
