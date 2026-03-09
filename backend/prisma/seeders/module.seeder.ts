import { PrismaClient } from '@prisma/client';

export enum PermissionHandler {
  VIEW = 'view',
  CREATE = 'create',
  EDIT = 'edit',
  DELETE = 'delete',
  CREATE_OR_UPDATE = 'create_or_update',
}

export async function seedModules(prisma: PrismaClient) {
  console.log('Seeding Modules and Permissions...');

  // Cleanup old modules if slug changed
  const oldSlugs = ['monitoring'];
  for (const slug of oldSlugs) {
    const existing = await (prisma as any).module.findUnique({ where: { slug } });
    if (existing) {
      console.log(`Cleaning up old module: ${slug}`);
      await (prisma as any).permission.deleteMany({ where: { module_id: existing.id } });
      await (prisma as any).module.delete({ where: { id: existing.id } });
    }
  }

  const modulesData = [
    {
      name: 'Dashboard',
      key: 'dashboard',
      slug: 'dashboard',
      group: 'MAIN',
      icon: 'community',
      page: 'monitoring',
      endpoints: JSON.stringify([
        { method: 'GET', path: '/monitoring/showcase', handler: 'stats.showcase' },
        { method: 'GET', path: '/monitoring/enrollment', handler: 'charts.enrollment' },
        { method: 'GET', path: '/monitoring/finance', handler: 'charts.finance' },
        { method: 'GET', path: '/monitoring/grading', handler: 'charts.grading' },
        { method: 'GET', path: '/monitoring/attendance', handler: 'charts.attendance' },
      ]),
      meta: JSON.stringify({
        filter: [
          { 
            id: 'educational_unit', 
            label: 'Unit', 
            type: 'select', 
            options: ['Select All', 'SMA', 'SMP', 'SD', 'TK'],
            default: 'Select All'
          },
          { id: 'date_range', label: 'Date', type: 'date' }
        ],
        chart: [
          {
            type: 'stat-cards',
            source: { url: '/monitoring/showcase', method: 'GET' },
            permission: 'dashboard.stats.showcase'
          },
          { 
            type: 'line', 
            title: 'Enrollment Trend', 
            subtitle: 'Monthly student registration',
            source: { url: '/monitoring/enrollment', method: 'GET' },
            permission: 'dashboard.charts.enrollment'
          },
          {
            type: 'heatmap',
            title: 'Attendance Heatmap',
            subtitle: 'Weekly attendance intensity',
            source: { url: '/monitoring/attendance', method: 'GET' },
            permission: 'dashboard.charts.attendance'
          },
          {
            type: 'stacked-bar',
            title: 'Finance Collection',
            subtitle: 'Overview of financial collections and overdue',
            source: { url: '/monitoring/finance', method: 'GET' },
            permission: 'dashboard.charts.finance'
          },
          {
            type: 'list',
            title: 'Grading Windows',
            source: { url: '/monitoring/grading', method: 'GET' },
            permission: 'dashboard.charts.grading'
          }
        ]
      })
    },
    {
      name: 'Institutes',
      key: 'institutes',
      slug: 'institutes',
      group: 'Management',
      icon: 'grad',
      page: 'default',
      endpoints: JSON.stringify([
        { method: 'GET', path: '/institutes', handler: PermissionHandler.VIEW },
        { method: 'POST', path: '/institutes', handler: PermissionHandler.CREATE },
        { method: 'PATCH', path: '/institutes/:id', handler: PermissionHandler.EDIT },
        { method: 'DELETE', path: '/institutes/:id', handler: PermissionHandler.DELETE }
      ])
    },
    {
      name: 'Staff',
      key: 'staff',
      slug: 'staff',
      group: 'Management',
      icon: 'community',
      page: 'default',
      endpoints: JSON.stringify([
        { method: 'GET', path: '/institutes/:id/staff', handler: PermissionHandler.VIEW },
        { method: 'POST', path: '/staff', handler: PermissionHandler.CREATE },
        { method: 'PATCH', path: '/staff/:id', handler: PermissionHandler.EDIT },
        { method: 'DELETE', path: '/staff/:id', handler: PermissionHandler.DELETE }
      ])
    },
    {
      name: 'Teachers',
      key: 'teachers',
      slug: 'teachers',
      group: 'Management',
      icon: 'excellence',
      page: 'default',
      endpoints: JSON.stringify([
        { method: 'GET', path: '/institutes/:id/teachers', handler: PermissionHandler.VIEW },
        { method: 'POST', path: '/teachers', handler: PermissionHandler.CREATE },
        { method: 'PATCH', path: '/teachers/:id', handler: PermissionHandler.EDIT },
        { method: 'DELETE', path: '/teachers/:id', handler: PermissionHandler.DELETE }
      ])
    },
    {
      name: 'Students',
      key: 'students',
      slug: 'students',
      group: 'Management',
      icon: 'person',
      page: 'default',
      endpoints: JSON.stringify([
        { method: 'GET', path: '/institutes/:id/students', handler: PermissionHandler.VIEW },
        { method: 'POST', path: '/students', handler: PermissionHandler.CREATE },
        { method: 'PATCH', path: '/students/:id', handler: PermissionHandler.EDIT },
        { method: 'DELETE', path: '/students/:id', handler: PermissionHandler.DELETE }
      ])
    },
    {
      name: 'Religion',
      key: 'religion',
      slug: 'religions',
      group: 'Master Data',
      icon: 'community',
      page: 'default',
      endpoints: JSON.stringify([
        { method: 'GET', path: '/religion', handler: PermissionHandler.VIEW },
        { method: 'POST', path: '/religion', handler: PermissionHandler.CREATE },
        { method: 'PATCH', path: '/religion/:id', handler: PermissionHandler.EDIT },
        { method: 'DELETE', path: '/religion/:id', handler: PermissionHandler.DELETE }
      ]),
      forms: JSON.stringify([
        {
          handler: PermissionHandler.CREATE,
          title: 'Add New Religion',
          content: [
            { 
              id: 'name', 
              label: 'Religion Name', 
              type: 'textfield', 
              required: true, 
              placeholder: 'e.g. Islam',
              validation: { 
                required: true,
                message: 'Religion name is required'
              },
              translation: true,
              style: {
                order: 1,
                columns: { default: 12, md: 6 }
              }
            },
            {
              id: 'description',
              label: 'Description',
              type: 'textarea',
              required: false,
              placeholder: 'Enter religion description...',
              translation: true,
              style: {
                order: 2,
                columns: 12
              }
            }
          ],
          ui: {
            submitLabel: 'Save Religion',
            cancelLabel: 'Cancel',
            layout: 'standard'
          }
        }
      ]),
      meta: JSON.stringify({
        filter: [
          { id: 'name', label: 'Name', type: 'text' }
        ]
      })
    },
    {
      name: 'Ethnicity',
      key: 'ethnicity',
      slug: 'ethnicities',
      group: 'Master Data',
      icon: 'community',
      page: 'default',
      endpoints: JSON.stringify([
        { method: 'GET', path: '/ethnicity', handler: PermissionHandler.VIEW },
        { method: 'POST', path: '/ethnicity', handler: PermissionHandler.CREATE },
        { method: 'PATCH', path: '/ethnicity/:id', handler: PermissionHandler.EDIT },
        { method: 'DELETE', path: '/ethnicity/:id', handler: PermissionHandler.DELETE }
      ]),
      forms: JSON.stringify([
        {
          handler: PermissionHandler.CREATE,
          title: 'Add New Ethnicity',
          content: [
            { 
              id: 'name', 
              label: 'Ethnicity Name', 
              type: 'textfield', 
              required: true, 
              placeholder: 'e.g. Javanese',
              validation: { 
                required: true,
                message: 'Ethnicity name is required'
              },
              translation: true,
              style: {
                order: 1,
                columns: { default: 12, md: 6 }
              }
            },
            {
              id: 'description',
              label: 'Description',
              type: 'textarea',
              required: false,
              placeholder: 'Enter ethnicity description...',
              translation: true,
              style: {
                order: 2,
                columns: 12
              }
            }
          ],
          ui: {
            submitLabel: 'Save Ethnicity',
            cancelLabel: 'Cancel',
            layout: 'standard'
          }
        }
      ]),
      meta: JSON.stringify({
        filter: [
          { id: 'name', label: 'Name', type: 'text' }
        ]
      })
    },
    {
      name: 'Gender',
      key: 'gender',
      slug: 'genders',
      group: 'Master Data',
      icon: 'person',
      page: 'default',
      endpoints: JSON.stringify([
        { method: 'GET', path: '/gender', handler: PermissionHandler.VIEW },
        { method: 'POST', path: '/gender', handler: PermissionHandler.CREATE },
        { method: 'PATCH', path: '/gender/:id', handler: PermissionHandler.EDIT },
        { method: 'DELETE', path: '/gender/:id', handler: PermissionHandler.DELETE }
      ]),
      forms: JSON.stringify([
        {
          handler: PermissionHandler.CREATE,
          title: 'Add New Gender',
          content: [
            { 
              id: 'name', 
              label: 'Gender Name', 
              type: 'textfield', 
              required: true, 
              placeholder: 'e.g. Male',
              validation: { 
                required: true,
                message: 'Gender name is required'
              },
              translation: true,
              style: {
                order: 1,
                columns: { default: 12, md: 6 }
              }
            },
            {
              id: 'description',
              label: 'Description',
              type: 'textarea',
              required: false,
              placeholder: 'Enter gender description...',
              translation: true,
              style: {
                order: 2,
                columns: 12
              }
            }
          ],
          ui: {
            submitLabel: 'Save Gender',
            cancelLabel: 'Cancel',
            layout: 'standard'
          }
        }
      ]),
      meta: JSON.stringify({
        filter: [
          { id: 'name', label: 'Name', type: 'text' }
        ]
      })
    },
    {
      name: 'Settings',
      key: 'settings',
      slug: 'settings',
      group: 'System',
      icon: 'community',
      page: 'direct',
      config: JSON.stringify({
          sidebar: {
            position: 'bottom'
          },
      }),
      endpoints: JSON.stringify([
        { method: 'POST', path: '/settings/save', handler: PermissionHandler.CREATE },
        { method: 'GET', path: '/settings/:group', handler: PermissionHandler.VIEW }
      ]),
      forms: JSON.stringify([
        {
          handler: PermissionHandler.CREATE_OR_UPDATE,
          title: 'settings.overview.title',
          subtitle: 'pages.settings.description',
          fetch: '/settings/overview',
          content: [
            { id: 'logo', label: 'settings.overview.fields.logo', type: 'file', required: false, placeholder: 'Upload application logo', style: { order: 1, columns: { default: 12, sm: 6 } } },
            { id: 'favicon', label: 'settings.overview.fields.favicon', type: 'file', required: false, placeholder: 'Upload favicon icon', style: { order: 2, columns: { default: 12, sm: 6 } } },
            { id: 'foundation_name', label: 'settings.overview.fields.foundation_name', type: 'textfield', required: true, placeholder: 'e.g. ICANN Foundation', translation: true, style: { order: 3, columns: 12 } },
            { id: 'app_name', label: 'settings.overview.fields.app_name', type: 'textfield', required: true, placeholder: 'e.g. School Management System', translation: true, style: { order: 4, columns: { default: 12, sm: 6 } } },
            { id: 'short_name', label: 'settings.overview.fields.short_name', type: 'textfield', required: true, placeholder: 'e.g. SMS', translation: true, style: { order: 5, columns: { default: 12, sm: 6 } } },
            { id: 'description', label: 'settings.overview.fields.description', type: 'textarea', required: false, placeholder: 'Brief description about the foundation/application...', translation: true, style: { order: 6, columns: 12 } }
          ],
          ui: { submitLabel: 'settings.overview.ui.submit', layout: 'standard' }
        }
      ]),
      subModules: [
        {
          name: 'Tolgee',
          key: 'tolgee',
          slug: 'tolgee',
          icon: 'community',
          page: 'direct',
          forms: JSON.stringify([
            {
              handler: PermissionHandler.CREATE_OR_UPDATE,
              title: 'settings.tolgee.title',
              subtitle: 'settings.tolgee.description',
              fetch: '/settings/tolgee',
              content: [
                { id: 'api_url', label: 'settings.tolgee.fields.api_url', type: 'textfield', required: true, placeholder: 'e.g. https://app.tolgee.io', translation: true, style: { order: 1, columns: 12 } },
                { id: 'api_key', label: 'settings.tolgee.fields.api_key', type: 'textfield', required: true, placeholder: 'Enter your Tolgee API Key', translation: true, style: { order: 2, columns: 12 } }
              ],
              ui: { submitLabel: 'settings.tolgee.ui.submit', layout: 'standard' }
            }
          ])
        },
        {
          name: 'Mail Server',
          key: 'mail server',
          slug: 'mail-server',
          icon: 'community',
          page: 'direct',
          forms: JSON.stringify([
            {
              handler: PermissionHandler.CREATE_OR_UPDATE,
              title: 'settings.mail_server.title',
              subtitle: 'settings.mail_server.description',
              fetch: '/settings/mail-server',
              content: [
                { id: 'host', label: 'settings.mail_server.fields.host', type: 'textfield', required: true, placeholder: 'e.g. smtp.gmail.com', translation: true, style: { order: 1, columns: { default: 12, md: 8 } } },
                { id: 'port', label: 'settings.mail_server.fields.port', type: 'textfield', required: true, placeholder: 'e.g. 587', translation: true, style: { order: 2, columns: { default: 12, md: 4 } } },
                { id: 'username', label: 'settings.mail_server.fields.username', type: 'textfield', required: true, placeholder: 'Enter SMTP username', translation: true, style: { order: 3, columns: { default: 12, md: 6 } } },
                { id: 'password', label: 'settings.mail_server.fields.password', type: 'textfield', required: true, placeholder: 'Enter SMTP password', translation: true, style: { order: 4, columns: { default: 12, md: 6 } } },
                { id: 'from_email', label: 'settings.mail_server.fields.from_email', type: 'textfield', required: true, placeholder: 'e.g. noreply@school.com', translation: true, style: { order: 5, columns: 12 } }
              ],
              ui: { submitLabel: 'settings.mail_server.ui.submit', layout: 'standard' }
            }
          ])
        }
      ]
    }
  ];

  for (const mod of modulesData) {
    const parentModule = await (prisma as any).module.upsert({
      where: { slug: mod.slug },
      update: {
        name: mod.name,
        key: mod.key || mod.name.toLowerCase(),
        group: mod.group,
        icon: mod.icon,
        meta: (mod as any).meta || null,
        endpoints: (mod as any).endpoints || null,
        forms: (mod as any).forms || null,
        config: (mod as any).config || null,
        page: (mod as any).page || 'default',
      },
      create: {
        name: mod.name,
        key: mod.key || mod.name.toLowerCase(),
        slug: mod.slug,
        description: `${mod.name} management module`,
        group: mod.group,
        icon: mod.icon,
        meta: (mod as any).meta || null,
        endpoints: (mod as any).endpoints || null,
        forms: (mod as any).forms || null,
        config: (mod as any).config || null,
        page: (mod as any).page || 'default',
      },
    });

    // Handle Sub-modules if any
    if ((mod as any).subModules) {
      for (const sub of (mod as any).subModules) {
        await (prisma as any).module.upsert({
          where: { slug: sub.slug },
          update: {
            name: sub.name,
            key: sub.key || sub.name.toLowerCase(),
            group: mod.group,
            icon: sub.icon,
            page: sub.page || 'default',
            parent_id: parentModule.id,
            forms: sub.forms || null,
            meta: sub.meta || null,
            config: sub.config || null,
          },
          create: {
            name: sub.name,
            key: sub.key || sub.name.toLowerCase(),
            slug: sub.slug,
            description: `${sub.name} sub-module`,
            group: mod.group,
            icon: sub.icon,
            page: sub.page || 'default',
            parent_id: parentModule.id,
            forms: sub.forms || null,
            meta: sub.meta || null,
            config: sub.config || null,
          },
        });
      }
    }

    const endpoints = mod.endpoints ? JSON.parse(mod.endpoints) : [];
    const permissionTypes = endpoints.length > 0 
      ? Array.from(new Set(endpoints.map((e: any) => e.handler))) 
      : [PermissionHandler.VIEW];

    // Ensure basic CRUD permissions are always created for each module
    const defaultPermissions = [
      PermissionHandler.VIEW,
      PermissionHandler.CREATE,
      PermissionHandler.EDIT,
      PermissionHandler.DELETE
    ];
    
    const allPermissionTypes = Array.from(new Set([...permissionTypes, ...defaultPermissions]));

    for (const type of allPermissionTypes as string[]) {
      const pSlug = `${mod.slug}.${type}`;
      await (prisma as any).permission.upsert({
        where: { slug: pSlug },
        update: { name: `${mod.name.toLowerCase()}.${type}` },
        create: {
          name: `${mod.name.toLowerCase()}.${type}`,
          slug: pSlug,
          description: `Permission to ${type} ${mod.name.toLowerCase()}`,
          module_id: parentModule.id,
        },
      });
    }
  }
}
