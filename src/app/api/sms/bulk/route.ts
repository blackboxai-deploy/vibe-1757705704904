// API Route: Send Bulk SMS

import { NextRequest, NextResponse } from 'next/server';
import SmsService from '@/services/SmsService';
import { SendBulkSmsRequest } from '@/types/sms';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as SendBulkSmsRequest;

    // Validate required fields
    if ((!body.recipients || body.recipients.length === 0) && 
        (!body.contact_groups || body.contact_groups.length === 0)) {
      return NextResponse.json({
        success: false,
        message: 'At least one recipient or contact group is required',
        errors: {
          recipients: ['Provide recipients list or contact groups']
        }
      }, { status: 400 });
    }

    if (!body.message && !body.template_id) {
      return NextResponse.json({
        success: false,
        message: 'Message or template is required',
        errors: {
          message: ['Message or template_id is required']
        }
      }, { status: 400 });
    }

    // Validate recipient phone numbers
    if (body.recipients && body.recipients.length > 0) {
      const phoneRegex = /^\+?[1-9]\d{1,14}$/;
      const invalidNumbers = body.recipients.filter(recipient => !phoneRegex.test(recipient));
      
      if (invalidNumbers.length > 0) {
        return NextResponse.json({
          success: false,
          message: 'Invalid phone numbers found',
          errors: {
            recipients: [`Invalid numbers: ${invalidNumbers.join(', ')}`]
          }
        }, { status: 400 });
      }
    }

    // Validate bulk limits
    const totalRecipients = (body.recipients?.length || 0) + 
                           (body.contact_groups?.length || 0) * 50; // Estimate 50 contacts per group
    
    if (totalRecipients > 10000) {
      return NextResponse.json({
        success: false,
        message: 'Bulk SMS limit exceeded',
        errors: {
          recipients: ['Maximum 10,000 recipients allowed per campaign']
        }
      }, { status: 400 });
    }

    // Validate message length if provided
    if (body.message && body.message.length > 1600) {
      return NextResponse.json({
        success: false,
        message: 'Message too long',
        errors: {
          message: ['Message cannot exceed 1600 characters (10 SMS segments)']
        }
      }, { status: 400 });
    }

    // Send bulk SMS using the service
    const result = await SmsService.sendBulkSms(body);

    return NextResponse.json(result, {
      status: result.success ? 200 : 500
    });

  } catch (error) {
    console.error('Bulk SMS API Error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      errors: {
        general: [(error as Error).message]
      }
    }, { status: 500 });
  }
}

// GET method to retrieve bulk SMS campaigns and their status
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const status = url.searchParams.get('status') || '';

    // Mock campaign data - in real Laravel, this would query the database
    const mockCampaigns = [
      {
        id: 'campaign_1',
        name: 'Welcome Campaign',
        template_id: 'welcome',
        status: 'completed',
        total_recipients: 1500,
        sent_count: 1500,
        delivered_count: 1485,
        failed_count: 15,
        created_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        completed_at: new Date(Date.now() - 3000000).toISOString() // 50 minutes ago
      },
      {
        id: 'campaign_2',
        name: 'Verification Campaign',
        template_id: 'verification',
        status: 'sending',
        total_recipients: 500,
        sent_count: 350,
        delivered_count: 340,
        failed_count: 10,
        created_at: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
        started_at: new Date(Date.now() - 1200000).toISOString() // 20 minutes ago
      },
      {
        id: 'campaign_3',
        name: 'Reminder Campaign',
        template_id: 'reminder',
        status: 'scheduled',
        total_recipients: 800,
        sent_count: 0,
        delivered_count: 0,
        failed_count: 0,
        created_at: new Date().toISOString(),
        scheduled_at: new Date(Date.now() + 3600000).toISOString() // 1 hour from now
      }
    ];

    // Filter by status if provided
    let filteredCampaigns = mockCampaigns;
    if (status) {
      filteredCampaigns = mockCampaigns.filter(campaign => campaign.status === status);
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const paginatedCampaigns = filteredCampaigns.slice(startIndex, startIndex + limit);

    return NextResponse.json({
      success: true,
      message: 'Bulk SMS campaigns retrieved successfully',
      data: paginatedCampaigns,
      pagination: {
        current_page: page,
        last_page: Math.ceil(filteredCampaigns.length / limit),
        per_page: limit,
        total: filteredCampaigns.length,
        from: startIndex + 1,
        to: startIndex + paginatedCampaigns.length
      }
    });

  } catch (error) {
    console.error('Bulk SMS Campaigns API Error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to retrieve campaigns',
      errors: {
        general: [(error as Error).message]
      }
    }, { status: 500 });
  }
}