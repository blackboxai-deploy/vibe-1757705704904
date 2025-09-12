// API Route: Single SMS Template Operations

import { NextRequest, NextResponse } from 'next/server';
import { SmsTemplate } from '@/types/sms';

// Mock templates database (same as in main templates route)
const mockTemplates: SmsTemplate[] = [
  {
    id: 'template_1',
    name: 'Welcome Message',
    slug: 'welcome',
    content: 'Welcome {{name}} to {{company}}! Your account is now active and ready to use.',
    variables: ['name', 'company'],
    category: 'onboarding',
    status: 'active',
    language: 'en',
    created_by: 'admin',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'template_2',
    name: 'Verification Code',
    slug: 'verification',
    content: 'Your verification code is: {{code}}. This code is valid for 10 minutes. Do not share this code with anyone.',
    variables: ['code'],
    category: 'security',
    status: 'active',
    language: 'en',
    created_by: 'admin',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
];

// GET: Retrieve single template by ID
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: templateId } = await params;

    const template = mockTemplates.find(t => t.id === templateId);
    
    if (!template) {
      return NextResponse.json({
        success: false,
        message: 'Template not found',
        errors: {
          id: ['Template with this ID does not exist']
        }
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Template retrieved successfully',
      data: template
    });

  } catch (error) {
    console.error('Get Template API Error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to retrieve template',
      errors: {
        general: [(error as Error).message]
      }
    }, { status: 500 });
  }
}

// DELETE: Delete template by ID
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: templateId } = await params;

    const templateIndex = mockTemplates.findIndex(t => t.id === templateId);
    
    if (templateIndex === -1) {
      return NextResponse.json({
        success: false,
        message: 'Template not found',
        errors: {
          id: ['Template with this ID does not exist']
        }
      }, { status: 404 });
    }

    // Check if template is being used in active campaigns
    // In real Laravel, this would check the database for active campaigns using this template
    const template = mockTemplates[templateIndex];
    const isInUse = await checkTemplateUsage(templateId);

    if (isInUse) {
      return NextResponse.json({
        success: false,
        message: 'Cannot delete template',
        errors: {
          usage: ['This template is currently being used in active campaigns']
        }
      }, { status: 409 });
    }

    // Remove template
    mockTemplates.splice(templateIndex, 1);

    return NextResponse.json({
      success: true,
      message: 'Template deleted successfully',
      data: {
        deleted_template: {
          id: template.id,
          name: template.name,
          slug: template.slug
        }
      }
    });

  } catch (error) {
    console.error('Delete Template API Error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to delete template',
      errors: {
        general: [(error as Error).message]
      }
    }, { status: 500 });
  }
}

// PATCH: Partial update template (e.g., toggle status)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: templateId } = await params;
    const body = await request.json();

    const templateIndex = mockTemplates.findIndex(t => t.id === templateId);
    
    if (templateIndex === -1) {
      return NextResponse.json({
        success: false,
        message: 'Template not found',
        errors: {
          id: ['Template with this ID does not exist']
        }
      }, { status: 404 });
    }

    // Allow only certain fields to be patched
    const allowedFields = ['status', 'category', 'name'];
    const updates: Partial<SmsTemplate> = {};

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field as keyof SmsTemplate] = body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No valid fields to update',
        errors: {
          fields: [`Allowed fields for partial update: ${allowedFields.join(', ')}`]
        }
      }, { status: 400 });
    }

    // Apply updates
    const currentTemplate = mockTemplates[templateIndex];
    const updatedTemplate = {
      ...currentTemplate,
      ...updates,
      updated_at: new Date().toISOString()
    };

    mockTemplates[templateIndex] = updatedTemplate;

    return NextResponse.json({
      success: true,
      message: 'Template updated successfully',
      data: updatedTemplate
    });

  } catch (error) {
    console.error('Patch Template API Error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to update template',
      errors: {
        general: [(error as Error).message]
      }
    }, { status: 500 });
  }
}

// Helper function to check if template is being used
async function checkTemplateUsage(templateId: string): Promise<boolean> {
  // Mock check - in real Laravel, this would query campaigns and other tables
  // that might reference this template
  
  // Simulate some templates being in use
  const templatesInUse = ['template_1', 'template_2'];
  return templatesInUse.includes(templateId);
}

// POST: Preview template with variables
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: templateId } = await params;
    const body = await request.json();

    const template = mockTemplates.find(t => t.id === templateId);
    
    if (!template) {
      return NextResponse.json({
        success: false,
        message: 'Template not found',
        errors: {
          id: ['Template with this ID does not exist']
        }
      }, { status: 404 });
    }

    // Process template with provided variables
    let previewContent = template.content;
    const variables = body.variables || {};

    // Replace variables in template
    for (const [key, value] of Object.entries(variables)) {
      const placeholder = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g');
      previewContent = previewContent.replace(placeholder, String(value));
    }

    // Find any unreplaced variables
    const unreplacedVariables = template.variables.filter(variable => 
      !Object.prototype.hasOwnProperty.call(variables, variable)
    );

    return NextResponse.json({
      success: true,
      message: 'Template preview generated successfully',
      data: {
        original_content: template.content,
        preview_content: previewContent,
        variables_used: Object.keys(variables),
        unreplaced_variables: unreplacedVariables,
        character_count: previewContent.length,
        estimated_sms_parts: Math.ceil(previewContent.length / 160)
      }
    });

  } catch (error) {
    console.error('Preview Template API Error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to generate template preview',
      errors: {
        general: [(error as Error).message]
      }
    }, { status: 500 });
  }
}