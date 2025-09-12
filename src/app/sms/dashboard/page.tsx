"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SmsStats {
  totalSent: number;
  totalDelivered: number;
  totalFailed: number;
  deliveryRate: number;
  costThisMonth: number;
  costLastMonth: number;
  recentLogs: any[];
}

interface DashboardData {
  stats: SmsStats;
  providers: Array<{
    name: string;
    status: 'active' | 'inactive';
    lastUsed: string;
  }>;
  recentCampaigns: Array<{
    id: string;
    name: string;
    status: string;
    recipients: number;
    deliveryRate: number;
    createdAt: string;
  }>;
}

export default function SmsDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch dashboard data
    const fetchDashboardData = async () => {
      setLoading(true);
      
      // Mock data - in real Laravel, this would fetch from the API
      const mockData: DashboardData = {
        stats: {
          totalSent: 25487,
          totalDelivered: 25038,
          totalFailed: 449,
          deliveryRate: 98.2,
          costThisMonth: 247.83,
          costLastMonth: 198.45,
          recentLogs: []
        },
        providers: [
          { name: 'Twilio', status: 'active', lastUsed: '2024-01-15T10:30:00Z' },
          { name: 'Vonage', status: 'active', lastUsed: '2024-01-15T09:15:00Z' },
          { name: 'AWS SNS', status: 'inactive', lastUsed: '2024-01-10T14:20:00Z' }
        ],
        recentCampaigns: [
          {
            id: 'camp_1',
            name: 'Welcome Campaign',
            status: 'completed',
            recipients: 1500,
            deliveryRate: 98.5,
            createdAt: '2024-01-15T08:00:00Z'
          },
          {
            id: 'camp_2',
            name: 'Verification Campaign',
            status: 'sending',
            recipients: 850,
            deliveryRate: 97.8,
            createdAt: '2024-01-15T10:00:00Z'
          },
          {
            id: 'camp_3',
            name: 'Reminder Campaign',
            status: 'scheduled',
            recipients: 2200,
            deliveryRate: 0,
            createdAt: '2024-01-15T12:00:00Z'
          }
        ]
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setData(mockData);
      setLoading(false);
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading SMS Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load dashboard data</p>
          <Button onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-4">
                <Link href="/" className="text-blue-600 hover:text-blue-800">
                  ← Back to Home
                </Link>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mt-2">SMS Dashboard</h1>
              <p className="text-gray-600">Monitor your SMS campaigns and analytics</p>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/sms/send">
                <Button>Send SMS</Button>
              </Link>
              <Link href="/sms/bulk">
                <Button variant="outline">Create Campaign</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sent</CardTitle>
              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.stats.totalSent.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">All time messages</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Delivery Rate</CardTitle>
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.stats.deliveryRate}%</div>
              <p className="text-xs text-muted-foreground">
                {data.stats.totalDelivered.toLocaleString()} delivered
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${data.stats.costThisMonth}</div>
              <p className="text-xs text-muted-foreground">
                +{(((data.stats.costThisMonth - data.stats.costLastMonth) / data.stats.costLastMonth) * 100).toFixed(1)}% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Failed Messages</CardTitle>
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.stats.totalFailed}</div>
              <p className="text-xs text-muted-foreground">
                {((data.stats.totalFailed / data.stats.totalSent) * 100).toFixed(1)}% failure rate
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="campaigns" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="campaigns">Recent Campaigns</TabsTrigger>
            <TabsTrigger value="providers">SMS Providers</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="campaigns" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent SMS Campaigns</CardTitle>
                <CardDescription>
                  Monitor the status and performance of your recent SMS campaigns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.recentCampaigns.map((campaign) => (
                    <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{campaign.name}</h4>
                        <p className="text-sm text-gray-500">
                          {campaign.recipients.toLocaleString()} recipients • Created {new Date(campaign.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        {campaign.status !== 'scheduled' && (
                          <div className="text-right">
                            <div className="text-sm font-medium">{campaign.deliveryRate}%</div>
                            <div className="text-xs text-gray-500">Delivered</div>
                          </div>
                        )}
                        <Badge 
                          variant={
                            campaign.status === 'completed' ? 'default' :
                            campaign.status === 'sending' ? 'secondary' :
                            'outline'
                          }
                        >
                          {campaign.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t">
                  <Link href="/sms/bulk">
                    <Button variant="outline" className="w-full">
                      View All Campaigns
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="providers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>SMS Provider Status</CardTitle>
                <CardDescription>
                  Monitor the health and usage of your configured SMS providers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.providers.map((provider, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className={`w-3 h-3 rounded-full ${provider.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                        <div>
                          <h4 className="font-medium">{provider.name}</h4>
                          <p className="text-sm text-gray-500">
                            Last used: {new Date(provider.lastUsed).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Badge 
                        variant={provider.status === 'active' ? 'default' : 'secondary'}
                      >
                        {provider.status}
                      </Badge>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t">
                  <Link href="/sms/settings">
                    <Button variant="outline" className="w-full">
                      Configure Providers
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Delivery Performance</CardTitle>
                  <CardDescription>Message delivery statistics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Messages Delivered</span>
                    <span className="font-medium">{data.stats.totalDelivered.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Messages Failed</span>
                    <span className="font-medium text-red-600">{data.stats.totalFailed.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Success Rate</span>
                    <span className="font-medium text-green-600">{data.stats.deliveryRate}%</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cost Analysis</CardTitle>
                  <CardDescription>Monthly spending overview</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">This Month</span>
                    <span className="font-medium">${data.stats.costThisMonth}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Last Month</span>
                    <span className="font-medium">${data.stats.costLastMonth}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Average per SMS</span>
                    <span className="font-medium">$0.0072</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-6">
              <Link href="/sms/logs">
                <Button variant="outline" className="w-full">
                  View Detailed Analytics
                </Button>
              </Link>
            </div>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/sms/send" className="block">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg">Send Single SMS</CardTitle>
                <CardDescription>Send SMS to individual recipient</CardDescription>
              </CardHeader>
            </Card>
          </Link>
          
          <Link href="/sms/bulk" className="block">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg">Create Campaign</CardTitle>
                <CardDescription>Send bulk SMS to multiple recipients</CardDescription>
              </CardHeader>
            </Card>
          </Link>
          
          <Link href="/sms/templates" className="block">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg">Manage Templates</CardTitle>
                <CardDescription>Create and edit SMS templates</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}