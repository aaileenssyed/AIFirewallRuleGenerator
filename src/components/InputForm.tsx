import { useState } from 'react';
import { Zap } from 'lucide-react';
import { UserInput } from '../services/firewallGenerator';

interface InputFormProps {
  onGenerate: (input: UserInput) => void;
  isGenerating: boolean;
}

const PROTOCOL_OPTIONS = [
  'HTTP',
  'HTTPS',
  'SSH',
  'FTP',
  'MySQL',
  'PostgreSQL',
  'MongoDB',
  'Redis',
];

export default function InputForm({ onGenerate, isGenerating }: InputFormProps) {
  const [description, setDescription] = useState('');
  const [serverRole, setServerRole] = useState<'web' | 'db' | 'bastion' | 'custom'>('web');
  const [protocols, setProtocols] = useState<string[]>([]);
  const [sourceType, setSourceType] = useState<'any' | 'single' | 'cidr'>('any');
  const [sourceValue, setSourceValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate({
      description,
      serverRole,
      protocols,
      sourceType,
      sourceValue: sourceValue || undefined,
    });
  };

  const toggleProtocol = (protocol: string) => {
    setProtocols((prev) =>
      prev.includes(protocol) ? prev.filter((p) => p !== protocol) : [...prev, protocol]
    );
  };

  const quickFillExample = (example: string) => {
    switch (example) {
      case 'web':
        setDescription('Public web server with HTTPS');
        setServerRole('web');
        setProtocols(['HTTP', 'HTTPS']);
        setSourceType('any');
        setSourceValue('');
        break;
      case 'secure-web':
        setDescription('Web server with restricted SSH access');
        setServerRole('web');
        setProtocols(['HTTPS', 'SSH']);
        setSourceType('cidr');
        setSourceValue('10.0.0.0/8');
        break;
      case 'bastion':
        setDescription('Bastion host for SSH access');
        setServerRole('bastion');
        setProtocols(['SSH']);
        setSourceType('cidr');
        setSourceValue('203.0.113.0/24');
        break;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Configure Your Server</h2>
        <p className="text-gray-600">
          Describe your server requirements using plain English or structured options below.
        </p>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <span className="text-sm font-medium text-gray-700">Quick Examples:</span>
        <button
          type="button"
          onClick={() => quickFillExample('web')}
          className="text-xs px-3 py-1 bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors"
        >
          Public Web Server
        </button>
        <button
          type="button"
          onClick={() => quickFillExample('secure-web')}
          className="text-xs px-3 py-1 bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors"
        >
          Secure Web + SSH
        </button>
        <button
          type="button"
          onClick={() => quickFillExample('bastion')}
          className="text-xs px-3 py-1 bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors"
        >
          Bastion Host
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Natural Language Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., Web server with SSH access from office network only"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={3}
          />
          <p className="mt-1 text-xs text-gray-500">
            Describe what your server does and who needs access to it
          </p>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Structured Options</h3>

          <div className="space-y-4">
            <div>
              <label htmlFor="serverRole" className="block text-sm font-medium text-gray-700 mb-2">
                Server Role
              </label>
              <select
                id="serverRole"
                value={serverRole}
                onChange={(e) => setServerRole(e.target.value as any)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="web">Web Server</option>
                <option value="db">Database Server</option>
                <option value="bastion">Bastion Host</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Allowed Protocols
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {PROTOCOL_OPTIONS.map((protocol) => (
                  <button
                    key={protocol}
                    type="button"
                    onClick={() => toggleProtocol(protocol)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      protocols.includes(protocol)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {protocol}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Allowed Source
              </label>
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      value="any"
                      checked={sourceType === 'any'}
                      onChange={(e) => setSourceType(e.target.value as any)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Any (0.0.0.0/0)</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      value="single"
                      checked={sourceType === 'single'}
                      onChange={(e) => setSourceType(e.target.value as any)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Single IP</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      value="cidr"
                      checked={sourceType === 'cidr'}
                      onChange={(e) => setSourceType(e.target.value as any)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">CIDR Range</span>
                  </label>
                </div>

                {(sourceType === 'single' || sourceType === 'cidr') && (
                  <input
                    type="text"
                    value={sourceValue}
                    onChange={(e) => setSourceValue(e.target.value)}
                    placeholder={
                      sourceType === 'single'
                        ? 'e.g., 203.0.113.42'
                        : 'e.g., 10.0.0.0/8 or 203.0.113.0/24'
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isGenerating}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
              Generating Rules...
            </>
          ) : (
            <>
              <Zap size={20} />
              Generate Firewall Rules
            </>
          )}
        </button>
      </form>
    </div>
  );
}
