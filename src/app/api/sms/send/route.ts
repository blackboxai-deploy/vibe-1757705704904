// API Route: Send Single SMS

import { NextRequest, NextResponse } from 'next/server';
import SmsService from '@/services/SmsService';
import { SendSmsRequest } from '@/types/sms';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as SendSmsRequest;

    // Validate required fields
    if (!body.recipient || (!body.message && !body.template_id)) {
      return NextResponse.json({
        success: false,
        message: 'Missing required fields: recipient and (message or template_id)',
        errors: {
          recipient: !body.recipient ? ['Recipient phone number is required'] : [],
          message: (!body.message && !body.template_id) ? ['Message or template_id is required'] : []
        }
      }, { status: 400 });
    }

    // Validate phone number format
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(body.recipient)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid phone number format',
        errors: {
          recipient: ['Phone number must be in international format (e.g., +1234567890)']
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

    // Send SMS using the service
    const result = await SmsService.sendSms(body);

    return NextResponse.json(result, {
      status: result.success ? 200 : 500
    });

  } catch (error) {
    console.error('SMS Send API Error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      errors: {
        general: [(error as Error).message]
      }
    }, { status: 500 });
  }
}

// GET method to retrieve send SMS form or recent logs
export async function GET() {
  try {
    // Return available providers and templates for the send form
    const providers = SmsService.getAvailableProviders();
    
    // Mock templates - in real Laravel, this would query the database
    const templates = [
      { id: 'welcome', name: 'Welcome Message', variables: ['name', 'company'] },
      { id: 'verification', name: 'Verification Code', variables: ['code'] },
      { id: 'reminder', name: 'Reminder Message', variables: ['name', 'message'] }
    ];

    return NextResponse.json({
      success: true,
      message: 'Send SMS configuration retrieved successfully',
      data: {
        providers,
        templates,
        limits: {
          maxMessageLength: 1600,
          maxRecipientsPerBulk: 1000
        }
      }
    });

  } catch (error) {
    console.error('SMS Send Config API Error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to retrieve SMS configuration',
      errors: {
        general: [(error as Error).message]
      }
    }, { status: 500 });
  }
}