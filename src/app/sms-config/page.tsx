"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
// Simple Dinstar configuration interface
interface DinstarConfig {
  baseUrl: string;
  username: string;
  password: string;
  port: number;
  fromNumber: string;
  encoding: 'utf8' | 'ucs2' | 'latin1';
  timeout: number;
}

export default function SmsConfig() {
  const [config, setConfig] = useState<DinstarConfig>({
    baseUrl: 'http://192.168.1.100',
    username: '',
    password: '',
    port: 8080,
    fromNumber: '',
    encoding: 'utf8',
    timeout: 30
  });

  const [status, setStatus] = useState<'offline' | 'online' | 'testing'>('offline');
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    loadConfiguration();
  }, []);

  const loadConfiguration = async () => {
    try {
      // Simulate loading from localStorage or API
      const savedConfig = localStorage.getItem('dinstar_config');
      if (savedConfig) {
        setConfig(JSON.parse(savedConfig));
        // Test connection automatically
        testConnection(JSON.parse(savedConfig));
      }
    } catch (error) {
      console.error('Failed to load configuration:', error);
    }
  };

  const saveConfiguration = async () => {
    setSaving(true);
    try {
      // Validate configuration
      if (!config.baseUrl || !config.username || !config.password || !config.fromNumber) {
        alert('Ju lutem plotësoni të gjitha fushat e kërkuara');
        return;
      }

      // Save to localStorage (in real app, this would be saved to database)
      localStorage.setItem('dinstar_config', JSON.stringify(config));
      
      // Test connection after saving
      await testConnection(config);
      
      alert('Konfigurimi u ruajt me sukses!');
    } catch (error) {
      console.error('Failed to save configuration:', error);
      alert('Gabim në ruajtjen e konfigurimit');
    } finally {
      setSaving(false);
    }
  };

  const testConnection = async (testConfig: DinstarConfig) => {
    setTesting(true);
    setStatus('testing');
    
    try {
      // Simulate connection test
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In real implementation, this would test the actual Dinstar connection
      const isValid = testConfig.baseUrl && testConfig.username && testConfig.password;
      
      if (isValid) {
        setStatus('online');
      } else {
        setStatus('offline');
      }
    } catch (error) {
      console.error('Connection test failed:', error);
      setStatus('offline');
    } finally {
      setTesting(false);
    }
  };

  const handleInputChange = (field: keyof DinstarConfig, value: string | number) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'online':
        return <Badge className="bg-green-100 text-green-800">Online</Badge>;
      case 'testing':
        return <Badge className="bg-yellow-100 text-yellow-800">Duke testuar...</Badge>;
      case 'offline':
      default:
        return <Badge className="bg-red-100 text-red-800">Offline</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Konfigurimi i Gateway Dinstar</h1>
              <p className="text-gray-600 mt-2">Konfiguro lidhjen me gateway-n tuaj Dinstar për SMS</p>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600">Status:</span>
              {getStatusBadge()}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Configuration Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-gray-800">Konfigurimi i Gateway</CardTitle>
                <p className="text-sm text-gray-600">Plotësoni të dhënat për lidhjen me Dinstar Gateway</p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Connection Settings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="baseUrl" className="text-sm font-medium text-gray-700">
                      IP Address / URL <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="baseUrl"
                      type="text"
                      placeholder="http://192.168.1.100"
                      value={config.baseUrl}
                      onChange={(e) => handleInputChange('baseUrl', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="port" className="text-sm font-medium text-gray-700">
                      Port <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="port"
                      type="number"
                      placeholder="8080"
                      value={config.port}
                      onChange={(e) => handleInputChange('port', parseInt(e.target.value) || 8080)}
                      className="mt-1"
                    />
                  </div>
                </div>

                {/* Authentication */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                      Username <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="admin"
                      value={config.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                      Password <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={config.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>

                {/* SMS Settings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fromNumber" className="text-sm font-medium text-gray-700">
                      Numri Dërguesi <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="fromNumber"
                      type="text"
                      placeholder="+355694123456"
                      value={config.fromNumber}
                      onChange={(e) => handleInputChange('fromNumber', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="encoding" className="text-sm font-medium text-gray-700">
                      Encoding
                    </Label>
                    <Select 
                      value={config.encoding} 
                      onValueChange={(value: 'utf8' | 'ucs2' | 'latin1') => handleInputChange('encoding', value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="utf8">UTF-8 (Recommended)</SelectItem>
                        <SelectItem value="ucs2">UCS-2</SelectItem>
                        <SelectItem value="latin1">Latin-1</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Advanced Settings */}
                <div>
                  <Label htmlFor="timeout" className="text-sm font-medium text-gray-700">
                    Connection Timeout (sekonda)
                  </Label>
                  <Input
                    id="timeout"
                    type="number"
                    placeholder="30"
                    value={config.timeout}
                    onChange={(e) => handleInputChange('timeout', parseInt(e.target.value) || 30)}
                    className="mt-1 md:w-32"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button 
                    onClick={saveConfiguration} 
                    disabled={saving}
                    className="bg-blue-600 hover:bg-blue-700 flex-1 sm:flex-none"
                  >
                    {saving ? 'Duke ruajtur...' : 'Ruaj Konfigurimin'}
                  </Button>
                  
                  <Button 
                    onClick={() => testConnection(config)} 
                    disabled={testing}
                    variant="outline"
                    className="flex-1 sm:flex-none"
                  >
                    {testing ? 'Duke testuar...' : 'Testo Lidhjen'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Status Panel */}
          <div className="space-y-6">
            {/* Connection Status */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg text-gray-800">Status i Lidhjes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        status === 'online' ? 'bg-green-500' : 
                        status === 'testing' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}></div>
                      <span className="text-sm font-medium">Gateway Status</span>
                    </div>
                    {getStatusBadge()}
                  </div>

                  <div className="text-sm text-gray-600">
                    <p className="mb-2"><strong>URL:</strong> {config.baseUrl}:{config.port}</p>
                    <p className="mb-2"><strong>Username:</strong> {config.username || 'Jo i caktuar'}</p>
                    <p><strong>From Number:</strong> {config.fromNumber || 'Jo i caktuar'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Guide */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg text-gray-800">Udhëzues i Shpejtë</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start space-x-2">
                    <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-xs text-blue-600 font-medium">1</span>
                    </div>
                    <p>Plotësoni IP address-in e gateway Dinstar</p>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-xs text-blue-600 font-medium">2</span>
                    </div>
                    <p>Vendosni username dhe password-in e gateway</p>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-xs text-blue-600 font-medium">3</span>
                    </div>
                    <p>Caktoni numrin dërgues (sender number)</p>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-xs text-blue-600 font-medium">4</span>
                    </div>
                    <p>Klikoni "Testo Lidhjen" për të verifikuar konfigurimin</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Navigation */}
            <Card className="shadow-lg">
              <CardContent className="p-4">
                <Button 
                  onClick={() => window.location.href = '/sms-messages'}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Shko tek SMS Messages
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}