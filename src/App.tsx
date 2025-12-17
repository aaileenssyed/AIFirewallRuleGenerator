import { useState } from 'react';
import { Shield, Github } from 'lucide-react';
import InputForm from './components/InputForm';
import RulesDisplay from './components/RulesDisplay';
import ComparisonPanel from './components/ComparisonPanel';
import LearningPanel from './components/LearningPanel';
import {
  generateFirewallRules,
  UserInput,
  FirewallResult,
} from './services/firewallGenerator';

function App() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<FirewallResult | null>(null);

  const handleGenerate = async (input: UserInput) => {
    setIsGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    const generatedResult = generateFirewallRules(input);
    setResult(generatedResult);
    setIsGenerating(false);

    setTimeout(() => {
      document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-blue-600 rounded-lg p-2">
                <Shield className="text-white" size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  AI Firewall Rule Generator
                </h1>
                <p className="text-gray-600 mt-1">
                  Educational tool for learning secure iptables configuration
                </p>
              </div>
            </div>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <Github size={20} />
              <span className="hidden sm:inline">View on GitHub</span>
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <span className="font-semibold">Educational Purpose Only:</span> This tool generates
              secure iptables firewall rules based on best practices. It is designed for learning
              and does not execute any commands on your system. Always review and test rules in a
              safe environment before applying to production.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <div>
            <InputForm onGenerate={handleGenerate} isGenerating={isGenerating} />
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">How It Works</h2>
            <div className="space-y-4 text-gray-700">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Describe Your Server</p>
                  <p className="text-sm text-gray-600">
                    Use plain English or structured options to specify your server requirements
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <p className="font-semibold text-gray-900">AI Generates Rules</p>
                  <p className="text-sm text-gray-600">
                    The system applies security best practices and least-privilege principles
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Learn & Understand</p>
                  <p className="text-sm text-gray-600">
                    Get explanations, security warnings, and learn why each rule matters
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {result && (
          <div id="results" className="space-y-8 animate-fadeIn">
            <RulesDisplay
              rules={result.rules}
              warnings={result.warnings}
              score={result.score}
              scoreBreakdown={result.scoreBreakdown}
            />
            <ComparisonPanel comparison={result.comparison} />
            <LearningPanel learningPoints={result.learningPoints} />
          </div>
        )}

        {!result && (
          <div className="text-center py-16">
            <Shield className="mx-auto text-gray-300 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Ready to generate secure firewall rules
            </h3>
            <p className="text-gray-500">
              Fill out the form above and click "Generate Firewall Rules" to get started
            </p>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-600">
            Built for CS students and security beginners • Learn, experiment, and stay secure
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
