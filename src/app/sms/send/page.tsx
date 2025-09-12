"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Template {
  id: string;
  name: string;
  content: string;
  variables: string[];
}

interface Provider {
  slug: string;
  name: string;
}

export default function SendSmsPage() {
  const [formData, setFormData] = useState({
    recipient: '',
    message: '',
    template_id: '',
    provider: '',
    template_variables: {} as Record<string, string>
  });
  
  const [templates, setTemplates] = useState<Template[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; data?: any } | null>(null);
  const [previewMessage, setPreviewMessage] = useState('');

  useEffect(() => {
    // Fetch available templates and providers
    const fetchData = async () => {
      try {
        const response = await fetch('/api/sms/send');
        const data = await response.json();
        
        if (data.success) {
          setTemplates(data.data.templates);
          setProviders(data.data.providers);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Update preview when template or variables change
    if (selectedTemplate) {
      let preview = selectedTemplate.content;
      for (const [key, value] of Object.entries(formData.template_variables)) {
        const placeholder = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g');
        preview = preview.replace(placeholder, value || `{{${key}}}`);
      }
      setPreviewMessage(preview);
    } else {
      setPreviewMessage(formData.message);
    }
  }, [selectedTemplate, formData.template_variables, formData.message]);

  const handleTemplateChange = (templateId: string) => {
    setFormData(prev => ({ ...prev, template_id: templateId, message: '' }));
    
    if (templateId) {
      const template = templates.find(t => t.id === templateId);
      setSelectedTemplate(template || null);
      
      // Initialize template variables
      const variables: Record<string, string> = {};
      template?.variables.forEach(variable => {
        variables[variable] = '';
      });
      setFormData(prev => ({ ...prev, template_variables: variables }));
    } else {
      setSelectedTemplate(null);
      setFormData(prev => ({ ...prev, template_variables: {} }));
    }
  };

  const handleVariableChange = (variable: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      template_variables: {
        ...prev.template_variables,
        [variable]: value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const payload = {
        recipient: formData.recipient,
        ...(selectedTemplate ? {
          template_id: formData.template_id,
          template_variables: formData.template_variables
        } : {
          message: formData.message
        }),
        ...(formData.provider && { provider: formData.provider })
      };

      const response = await fetch('/api/sms/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      setResult(data);

      if (data.success) {
        // Reset form on success
        setFormData({
          recipient: '',
          message: '',
          template_id: '',
          provider: '',
          template_variables: {}
        });
        setSelectedTemplate(null);
      }
    } catch (error) {
      setResult({
        success: false,
        message: 'Failed to send SMS. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const messageLength = previewMessage.length;
  const smsSegments = Math.ceil(messageLength / 160);
  const estimatedCost = smsSegments * 0.0075; // Approximate cost per SMS

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-4">
                <Link href="/sms/dashboard" className="text-blue-600 hover:text-blue-800">
                  ← Back to Dashboard
                </Link>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mt-2">Send SMS</h1>
              <p className="text-gray-600">Send individual SMS messages to recipients</p>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/sms/bulk">
                <Button variant="outline">Bulk SMS</Button>
              </Link>
              <Link href="/sms/templates">
                <Button variant="outline">Templates</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Send Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Send SMS Message</CardTitle>
                <CardDescription>
                  Send SMS to individual recipient using templates or custom message
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Recipient */}
                  <div className="space-y-2">
                    <Label htmlFor="recipient">Recipient Phone Number *</Label>
                    <Input
                      id="recipient"
                      type="tel"
                      placeholder="+1234567890"
                      value={formData.recipient}
                      onChange={(e) => setFormData(prev => ({ ...prev, recipient: e.target.value }))}
                      required
                    />
                    <p className="text-sm text-gray-500">
                      Include country code (e.g., +1 for US, +44 for UK)
                    </p>
                  </div>

                  {/* Template Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="template">SMS Template (Optional)</Label>
                    <Select value={formData.template_id} onValueChange={handleTemplateChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a template or write custom message" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Custom Message</SelectItem>
                        {templates.map((template) => (
                          <SelectItem key={template.id} value={template.id}>
                            {template.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Template Variables */}
                  {selectedTemplate && selectedTemplate.variables.length > 0 && (
                    <div className="space-y-4">
                      <Label>Template Variables</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedTemplate.variables.map((variable) => (
                          <div key={variable} className="space-y-2">
                            <Label htmlFor={variable} className="text-sm">
                              {variable}
                            </Label>
                            <Input
                              id={variable}
                              placeholder={`Enter ${variable}`}
                              value={formData.template_variables[variable] || ''}
                              onChange={(e) => handleVariableChange(variable, e.target.value)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Custom Message */}
                  {!selectedTemplate && (
                    <div className="space-y-2">
                      <Label htmlFor="message">Message Content *</Label>
                      <Textarea
                        id="message"
                        placeholder="Enter your SMS message..."
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                        required={!selectedTemplate}
                      />
                    </div>
                  )}

                  {/* Provider Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="provider">SMS Provider (Optional)</Label>
                    <Select value={formData.provider} onValueChange={(value) => setFormData(prev => ({ ...prev, provider: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Use default provider" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Default Provider</SelectItem>
                        {providers.map((provider) => (
                          <SelectItem key={provider.slug} value={provider.slug}>
                            {provider.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={loading || (!formData.message && !selectedTemplate)}
                  >
                    {loading ? 'Sending...' : 'Send SMS'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Preview & Info */}
          <div className="space-y-6">
            {/* Message Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Message Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm whitespace-pre-wrap">
                      {previewMessage || 'Your message will appear here...'}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Characters:</span>
                      <span className={messageLength > 160 ? 'text-orange-600' : 'text-gray-600'}>
                        {messageLength}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>SMS Segments:</span>
                      <span>{smsSegments}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Estimated Cost:</span>
                      <span>${estimatedCost.toFixed(4)}</span>
                    </div>
                  </div>
                  
                  {messageLength > 160 && (
                    <Alert>
                      <AlertDescription>
                        Message exceeds 160 characters and will be sent as {smsSegments} SMS segments.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Provider Info */}
            <Card>
              <CardHeader>
                <CardTitle>SMS Providers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {providers.map((provider) => (
                    <div key={provider.slug} className="flex items-center justify-between">
                      <span className="text-sm">{provider.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {provider.slug === 'twilio' ? 'Primary' : 'Backup'}
                      </Badge>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t">
                  <Link href="/sms/settings">
                    <Button variant="outline" className="w-full text-sm">
                      Configure Providers
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/sms/templates">
                  <Button variant="outline" className="w-full text-sm">
                    Manage Templates
                  </Button>
                </Link>
                <Link href="/sms/bulk">
                  <Button variant="outline" className="w-full text-sm">
                    Bulk SMS Campaign
                  </Button>
                </Link>
                <Link href="/sms/logs">
                  <Button variant="outline" className="w-full text-sm">
                    View SMS Logs
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Result Alert */}
        {result && (
          <div className="mt-8">
            <Alert className={result.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
              <AlertDescription className={result.success ? 'text-green-800' : 'text-red-800'}>
                {result.message}
                {result.success && result.data && (
                  <div className="mt-2 text-sm">
                    <p>Message ID: {result.data.id}</p>
                    <p>Status: {result.data.status}</p>
                    <p>Provider: {result.data.provider}</p>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          </div>
        )}
      </div>
    </div>
  );
}