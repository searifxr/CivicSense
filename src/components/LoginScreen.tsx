import React, { useState } from 'react';
import { Users, Briefcase } from 'lucide-react';
import type { UserType, Department } from '../App';

interface LoginScreenProps {
  onLogin: (type: UserType, department?: Department) => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [selectedType, setSelectedType] = useState<UserType>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | ''>('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedType && email && password) {
      if (selectedType === 'worker' && selectedDepartment) {
        onLogin(selectedType, selectedDepartment as Department);
      } else if (selectedType === 'resident') {
        onLogin(selectedType);
      }
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1644158767445-79390e879319?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwc2t5bGluZSUyMGlsbHVzdHJhdGlvbnxlbnwxfHx8fDE3NjUwNTI3NDF8MA&ixlib=rb-4.1.0&q=80&w=1080')`
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-5xl mb-2">CivicSense</h1>
          <p className="text-gray-600">Keeping Our City Beautiful Together</p>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-8">
          <h2 className="text-2xl text-center mb-6">Welcome</h2>

          {/* User Type Selection */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              type="button"
              onClick={() => setSelectedType('resident')}
              className={`p-6 rounded-2xl border-2 transition-all ${
                selectedType === 'resident'
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-green-300'
              }`}
            >
              <Users className={`w-8 h-8 mx-auto mb-2 ${
                selectedType === 'resident' ? 'text-green-600' : 'text-gray-400'
              }`} />
              <div className={selectedType === 'resident' ? 'text-green-700' : 'text-gray-700'}>
                I am a
              </div>
              <div className={selectedType === 'resident' ? 'text-green-700' : 'text-gray-700'}>
                Resident/Visitor
              </div>
            </button>

            <button
              type="button"
              onClick={() => setSelectedType('worker')}
              className={`p-6 rounded-2xl border-2 transition-all ${
                selectedType === 'worker'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <Briefcase className={`w-8 h-8 mx-auto mb-2 ${
                selectedType === 'worker' ? 'text-blue-600' : 'text-gray-400'
              }`} />
              <div className={selectedType === 'worker' ? 'text-blue-700' : 'text-gray-700'}>
                I am a
              </div>
              <div className={selectedType === 'worker' ? 'text-blue-700' : 'text-gray-700'}>
                City Worker
              </div>
            </button>
          </div>

          {/* Department Selection for Workers */}
          {selectedType === 'worker' && (
            <div className="mb-6">
              <label htmlFor="department" className="block text-sm text-gray-700 mb-1">
                Department
              </label>
              <select
                id="department"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value as Department)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Department</option>
                <option value="Police Department">Police Department</option>
                <option value="Sanitation">Sanitation</option>
                <option value="Public Works">Public Works</option>
                <option value="Transportation">Transportation</option>
                <option value="Parks & Recreation">Parks & Recreation</option>
                <option value="General Services">General Services</option>
              </select>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={!selectedType}
              className={`w-full py-3 rounded-xl transition-all ${
                selectedType === 'resident'
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : selectedType === 'worker'
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}