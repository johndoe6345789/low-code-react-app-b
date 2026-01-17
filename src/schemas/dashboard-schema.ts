import { PageSchema } from '@/types/json-ui'

export const dashboardSchema: PageSchema = {
  id: 'dashboard',
  name: 'Dashboard',
  layout: {
    type: 'single',
  },
  dataSources: [
    {
      id: 'projects',
      type: 'kv',
      key: 'app-projects',
      defaultValue: [
        { 
          id: 1, 
          name: 'E-Commerce Platform', 
          status: 'active', 
          progress: 75, 
          team: 5,
          dueDate: '2024-03-15',
        },
        { 
          id: 2, 
          name: 'Mobile App Redesign', 
          status: 'pending', 
          progress: 30, 
          team: 3,
          dueDate: '2024-04-01',
        },
        { 
          id: 3, 
          name: 'API Integration', 
          status: 'active', 
          progress: 90, 
          team: 2,
          dueDate: '2024-02-28',
        },
      ],
    },
    {
      id: 'searchQuery',
      type: 'static',
      defaultValue: '',
    },
    {
      id: 'filterStatus',
      type: 'static',
      defaultValue: 'all',
    },
    {
      id: 'stats',
      type: 'computed',
      compute: (data) => {
        const projects = data.projects || []
        return {
          total: projects.length,
          active: projects.filter((p: any) => p.status === 'active').length,
          pending: projects.filter((p: any) => p.status === 'pending').length,
          avgProgress: projects.length > 0 
            ? Math.round(projects.reduce((sum: number, p: any) => sum + p.progress, 0) / projects.length)
            : 0,
        }
      },
      dependencies: ['projects'],
    },
    {
      id: 'filteredProjects',
      type: 'computed',
      compute: (data) => {
        let filtered = data.projects || []
        
        if (data.searchQuery) {
          const query = data.searchQuery.toLowerCase()
          filtered = filtered.filter((p: any) => 
            p.name.toLowerCase().includes(query)
          )
        }
        
        if (data.filterStatus && data.filterStatus !== 'all') {
          filtered = filtered.filter((p: any) => p.status === data.filterStatus)
        }
        
        return filtered
      },
      dependencies: ['projects', 'searchQuery', 'filterStatus'],
    },
  ],
  components: [
    {
      id: 'root',
      type: 'div',
      props: {
        className: 'h-full overflow-auto p-6 space-y-6 bg-gradient-to-br from-background via-background to-accent/5',
      },
      children: [
        {
          id: 'page-header',
          type: 'div',
          props: { className: 'mb-8' },
          children: [
            {
              id: 'page-title',
              type: 'Heading',
              props: {
                level: 1,
                className: 'bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2',
                children: 'Project Dashboard',
              },
            },
            {
              id: 'page-subtitle',
              type: 'Text',
              props: {
                variant: 'muted',
                children: 'Manage and track all your projects',
              },
            },
          ],
        },
        {
          id: 'stats-grid',
          type: 'Grid',
          props: {
            cols: 4,
            gap: 4,
            className: 'mb-6',
          },
          children: [
            {
              id: 'stat-total',
              type: 'DataCard',
              props: {
                title: 'Total Projects',
              },
              bindings: {
                value: { source: 'stats', path: 'total' },
              },
            },
            {
              id: 'stat-active',
              type: 'DataCard',
              props: {
                title: 'Active Projects',
              },
              bindings: {
                value: { source: 'stats', path: 'active' },
              },
            },
            {
              id: 'stat-pending',
              type: 'DataCard',
              props: {
                title: 'Pending Projects',
              },
              bindings: {
                value: { source: 'stats', path: 'pending' },
              },
            },
            {
              id: 'stat-progress',
              type: 'DataCard',
              props: {
                title: 'Avg Progress',
                description: 'Across all projects',
              },
              bindings: {
                value: { 
                  source: 'stats', 
                  path: 'avgProgress',
                  transform: (v: number) => `${v}%`,
                },
              },
            },
          ],
        },
        {
          id: 'action-bar',
          type: 'ActionBar',
          props: {
            title: 'Projects',
            className: 'mb-4',
          },
        },
        {
          id: 'filters-row',
          type: 'div',
          props: {
            className: 'flex gap-4 mb-6',
          },
          children: [
            {
              id: 'search-input',
              type: 'SearchInput',
              props: {
                placeholder: 'Search projects...',
                className: 'flex-1',
              },
              bindings: {
                value: { source: 'searchQuery' },
              },
              events: [
                {
                  event: 'change',
                  actions: [
                    {
                      id: 'update-search',
                      type: 'set-value',
                      target: 'searchQuery',
                      compute: (_data, event) => event,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: 'projects-list',
          type: 'div',
          props: {
            className: 'space-y-4',
          },
          children: [
            {
              id: 'projects-grid',
              type: 'Grid',
              props: {
                cols: 2,
                gap: 4,
              },
              bindings: {
                children: {
                  source: 'filteredProjects',
                  transform: (projects: any[]) => projects.map((project: any) => ({
                    id: `project-${project.id}`,
                    type: 'Card',
                    props: {
                      className: 'hover:shadow-lg transition-shadow',
                    },
                    children: [
                      {
                        id: `project-${project.id}-header`,
                        type: 'CardHeader',
                        children: [
                          {
                            id: `project-${project.id}-title-row`,
                            type: 'div',
                            props: {
                              className: 'flex items-center justify-between',
                            },
                            children: [
                              {
                                id: `project-${project.id}-title`,
                                type: 'CardTitle',
                                props: {
                                  children: project.name,
                                },
                              },
                              {
                                id: `project-${project.id}-status`,
                                type: 'StatusBadge',
                                props: {
                                  status: project.status,
                                },
                              },
                            ],
                          },
                        ],
                      },
                      {
                        id: `project-${project.id}-content`,
                        type: 'CardContent',
                        children: [
                          {
                            id: `project-${project.id}-info`,
                            type: 'div',
                            props: {
                              className: 'space-y-3',
                            },
                            children: [
                              {
                                id: `project-${project.id}-progress-label`,
                                type: 'Text',
                                props: {
                                  variant: 'caption',
                                  children: 'Progress',
                                },
                              },
                              {
                                id: `project-${project.id}-progress`,
                                type: 'Progress',
                                props: {
                                  value: project.progress,
                                },
                              },
                              {
                                id: `project-${project.id}-meta`,
                                type: 'div',
                                props: {
                                  className: 'flex justify-between text-sm text-muted-foreground mt-2',
                                },
                                children: [
                                  {
                                    id: `project-${project.id}-team`,
                                    type: 'Text',
                                    props: {
                                      variant: 'caption',
                                      children: `Team: ${project.team} members`,
                                    },
                                  },
                                  {
                                    id: `project-${project.id}-due`,
                                    type: 'Text',
                                    props: {
                                      variant: 'caption',
                                      children: `Due: ${project.dueDate}`,
                                    },
                                  },
                                ],
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  })),
                },
              },
            },
          ],
        },
      ],
    },
  ],
}
