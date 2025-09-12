"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function HomePage() {
  const [stats] = useState({
    totalSent: 25487,
    deliveryRate: 98.2,
    activeCampaigns: 3,
    monthlySpend: 247.83
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">SMS Module</h1>
              <p className="text-gray-600 mt-1">Laravel Worksuite SMS Management System</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-sm">
                Multi-Provider Support
              </Badge>
              <Badge variant="outline" className="text-sm">
                Enterprise Ready
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Professional SMS Management
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Complete SMS solution with Twilio, Vonage, and AWS SNS integration. 
              Send single messages, bulk campaigns, and manage templates with advanced analytics.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/sms/dashboard">
                <Button size="lg" className="text-lg px-8">
                  Open SMS Dashboard
                </Button>
              </Link>
              <Link href="/sms/send">
                <Button variant="outline" size="lg" className="text-lg px-8">
                  Send SMS
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-blue-600">
                {stats.totalSent.toLocaleString()}
              </CardTitle>
              <CardDescription>Total SMS Sent</CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-green-600">
                {stats.deliveryRate}%
              </CardTitle>
              <CardDescription>Delivery Rate</CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-purple-600">
                {stats.activeCampaigns}
              </CardTitle>
              <CardDescription>Active Campaigns</CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-orange-600">
                ${stats.monthlySpend}
              </CardTitle>
              <CardDescription>This Month</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-blue-600 rounded"></div>
                </div>
                Multi-Provider Support
              </CardTitle>
              <CardDescription>
                Integrated with Twilio, Vonage, and AWS SNS for maximum reliability and global coverage.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Twilio Integration</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Vonage (Nexmo) Support</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">AWS SNS Integration</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-purple-600 rounded"></div>
                </div>
                Template Management
              </CardTitle>
              <CardDescription>
                Create, manage, and reuse SMS templates with dynamic variable substitution.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/sms/templates">
                <Button variant="outline" className="w-full">
                  Manage Templates
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-green-600 rounded"></div>
                </div>
                Bulk Campaigns
              </CardTitle>
              <CardDescription>
                Send SMS to thousands of recipients with queue processing and real-time tracking.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/sms/bulk">
                <Button variant="outline" className="w-full">
                  Create Campaign
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-orange-600 rounded"></div>
                </div>
                Analytics & Logs
              </CardTitle>
              <CardDescription>
                Comprehensive delivery tracking, analytics, and detailed SMS logs.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/sms/logs">
                <Button variant="outline" className="w-full">
                  View Logs
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-red-600 rounded"></div>
                </div>
                Global Coverage
              </CardTitle>
              <CardDescription>
                International SMS delivery to 200+ countries with competitive pricing.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600">
                Starting from $0.0065 per SMS
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-indigo-600 rounded"></div>
                </div>
                Enterprise Security
              </CardTitle>
              <CardDescription>
                Secure credential management, audit trails, and compliance-ready features.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/sms/settings">
                <Button variant="outline" className="w-full">
                  Configure Settings
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg border p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Get Started with SMS Module
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Configure your SMS providers, create templates, and start sending professional SMS messages 
            to your customers with advanced tracking and analytics.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/sms/dashboard">
              <Button size="lg">
                Go to Dashboard
              </Button>
            </Link>
            <Link href="/sms/settings">
              <Button variant="outline" size="lg">
                Configure Providers
              </Button>
            </Link>
            <Link href="/docs/installation">
              <Button variant="outline" size="lg">
                View Documentation
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-white/80 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            <p>SMS Module for Laravel Worksuite - Professional SMS Management System</p>
            <p className="text-sm mt-2">
              Integrated with Twilio, Vonage, and AWS SNS for reliable message delivery
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}