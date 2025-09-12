// API Route: SMS Templates Management

import { NextRequest, NextResponse } from 'next/server';
import { SmsTemplate } from '@/types/sms';

// Mock templates database - in real Laravel, this would be in MySQL/PostgreSQL
let mockTemplates: SmsTemplate[] = [
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
  },
  {
    id: 'template_3',
    name: 'Reminder Message',
    slug: 'reminder',
    content: 'Hi {{name}}, this is a reminder: {{message}}. Thank you!',
    variables: ['name', 'message'],
    category: 'general',
    status: 'active',
    language: 'en',
    created_by: 'admin',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'template_4',
    name: 'Password Reset',
    slug: 'password-reset',
    content: 'Reset your password by clicking this link: {{reset_link}}. Link expires in 1 hour.',
    variables: ['reset_link'],
    category: 'security',
    status: 'active',
    language: 'en',
    created_by: 'admin',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
];

// GET: Retrieve all templates with pagination and filtering
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const category = url.searchParams.get('category') || '';
    const status = url.searchParams.get('status') || '';
    const search = url.searchParams.get('search') || '';

    // Filter templates
    let filteredTemplates = mockTemplates;
    
    if (category) {
      filteredTemplates = filteredTemplates.filter(template => template.category === category);
    }
    
    if (status) {
      filteredTemplates = filteredTemplates.filter(template => template.status === status);
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      filteredTemplates = filteredTemplates.filter(template => 
        template.name.toLowerCase().includes(searchLower) ||
        template.content.toLowerCase().includes(searchLower)
      );
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const paginatedTemplates = filteredTemplates.slice(startIndex, startIndex + limit);

    return NextResponse.json({
      success: true,
      message: 'SMS templates retrieved successfully',
      data: paginatedTemplates,
      pagination: {
        current_page: page,
        last_page: Math.ceil(filteredTemplates.length / limit),
        per_page: limit,
        total: filteredTemplates.length,
        from: startIndex + 1,
        to: startIndex + paginatedTemplates.length
      },
      meta: {
        categories: [...new Set(mockTemplates.map(t => t.category))],
        total_active: mockTemplates.filter(t => t.status === 'active').length,
        total_inactive: mockTemplates.filter(t => t.status === 'inactive').length
      }
    });

  } catch (error) {
    console.error('Get Templates API Error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to retrieve templates',
      errors: {
        general: [(error as Error).message]
      }
    }, { status: 500 });
  }
}

// POST: Create new SMS template
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.slug || !body.content) {
      return NextResponse.json({
        success: false,
        message: 'Missing required fields',
        errors: {
          name: !body.name ? ['Template name is required'] : [],
          slug: !body.slug ? ['Template slug is required'] : [],
          content: !body.content ? ['Template content is required'] : []
        }
      }, { status: 400 });
    }

    // Check if slug already exists
    if (mockTemplates.find(template => template.slug === body.slug)) {
      return NextResponse.json({
        success: false,
        message: 'Template slug already exists',
        errors: {
          slug: ['This slug is already in use']
        }
      }, { status: 409 });
    }

    // Extract variables from template content
    const variableMatches = body.content.match(/\{\{\s*([^}]+)\s*\}\}/g) || [];
    const variables = variableMatches.map((match: string) => 
      match.replace(/\{\{\s*|\s*\}\}/g, '')
    ).filter((variable: string, index: number, array: string[]) => 
      array.indexOf(variable) === index // Remove duplicates
    );

    // Create new template
    const newTemplate: SmsTemplate = {
      id: `template_${Date.now()}`,
      name: body.name,
      slug: body.slug,
      content: body.content,
      variables,
      category: body.category || 'general',
      status: body.status || 'active',
      language: body.language || 'en',
      created_by: 'current_user', // In real Laravel, this would come from auth
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Add to mock database
    mockTemplates.push(newTemplate);

    return NextResponse.json({
      success: true,
      message: 'SMS template created successfully',
      data: newTemplate
    }, { status: 201 });

  } catch (error) {
    console.error('Create Template API Error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to create template',
      errors: {
        general: [(error as Error).message]
      }
    }, { status: 500 });
  }
}

// PUT: Update existing SMS template
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json({
        success: false,
        message: 'Template ID is required',
        errors: {
          id: ['Template ID is required for updates']
        }
      }, { status: 400 });
    }

    // Find existing template
    const templateIndex = mockTemplates.findIndex(template => template.id === body.id);
    if (templateIndex === -1) {
      return NextResponse.json({
        success: false,
        message: 'Template not found',
        errors: {
          id: ['Template with this ID does not exist']
        }
      }, { status: 404 });
    }

    // Check if new slug conflicts with other templates
    if (body.slug && body.slug !== mockTemplates[templateIndex].slug) {
      if (mockTemplates.find(template => template.slug === body.slug && template.id !== body.id)) {
        return NextResponse.json({
          success: false,
          message: 'Template slug already exists',
          errors: {
            slug: ['This slug is already in use by another template']
          }
        }, { status: 409 });
      }
    }

    // Update template
    const currentTemplate = mockTemplates[templateIndex];
    const updatedTemplate: SmsTemplate = {
      ...currentTemplate,
      name: body.name || currentTemplate.name,
      slug: body.slug || currentTemplate.slug,
      content: body.content || currentTemplate.content,
      category: body.category || currentTemplate.category,
      status: body.status || currentTemplate.status,
      language: body.language || currentTemplate.language,
      updated_at: new Date().toISOString()
    };

    // Re-extract variables if content changed
    if (body.content) {
      const variableMatches = body.content.match(/\{\{\s*([^}]+)\s*\}\}/g) || [];
      updatedTemplate.variables = variableMatches.map((match: string) => 
        match.replace(/\{\{\s*|\s*\}\}/g, '')
      ).filter((variable: string, index: number, array: string[]) => 
        array.indexOf(variable) === index
      );
    }

    mockTemplates[templateIndex] = updatedTemplate;

    return NextResponse.json({
      success: true,
      message: 'SMS template updated successfully',
      data: updatedTemplate
    });

  } catch (error) {
    console.error('Update Template API Error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to update template',
      errors: {
        general: [(error as Error).message]
      }
    }, { status: 500 });
  }
}