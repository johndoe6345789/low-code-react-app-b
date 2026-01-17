export const computeFilteredUsers = (data: any) => {
  const query = (data.filterQuery || '').toLowerCase()
  if (!query) return data.users || []
  return (data.users || []).filter((user: any) =>
    user.name.toLowerCase().includes(query) ||
    user.email.toLowerCase().includes(query)
  )
}

export const computeStats = (data: any) => ({
  total: data.users?.length || 0,
  active: data.users?.filter((u: any) => u.status === 'active').length || 0,
  inactive: data.users?.filter((u: any) => u.status === 'inactive').length || 0,
})

export const computeTodoStats = (data: any) => ({
  total: data.todos?.length || 0,
  completed: data.todos?.filter((t: any) => t.completed).length || 0,
  remaining: data.todos?.filter((t: any) => !t.completed).length || 0,
})

export const computeAddTodo = (data: any) => ({
  id: Date.now(),
  text: data.newTodo,
  completed: false,
})

export const updateFilterQuery = (_: any, event: any) => event?.target?.value || ''

export const updateNewTodo = (data: any, event: any) => event?.target?.value || ''

export const checkCanAddTodo = (data: any) => data.newTodo?.trim().length > 0

export const transformFilteredUsers = (users: any[]) => `${users.length} users`

export const transformUserList = (users: any[]) => users.map((user: any) => ({
  type: 'Card',
  id: `user-${user.id}`,
  props: {
    className: 'bg-background/50 hover:bg-background/80 transition-colors border-l-4 border-l-primary',
  },
  children: [
    {
      type: 'CardContent',
      id: `user-content-${user.id}`,
      props: { className: 'pt-6' },
      children: [
        {
          type: 'div',
          id: `user-row-${user.id}`,
          props: { className: 'flex items-start justify-between' },
          children: [
            {
              type: 'div',
              id: `user-info-${user.id}`,
              props: { className: 'flex-1' },
              children: [
                {
                  type: 'div',
                  id: `user-name-${user.id}`,
                  props: { className: 'font-semibold text-lg mb-1', children: user.name },
                },
                {
                  type: 'div',
                  id: `user-email-${user.id}`,
                  props: { className: 'text-sm text-muted-foreground', children: user.email },
                },
                {
                  type: 'div',
                  id: `user-joined-${user.id}`,
                  props: { className: 'text-xs text-muted-foreground mt-2', children: `Joined ${user.joined}` },
                },
              ],
            },
            {
              type: 'Badge',
              id: `user-status-${user.id}`,
              props: {
                variant: user.status === 'active' ? 'default' : 'secondary',
                children: user.status,
              },
            },
          ],
        },
      ],
    },
  ],
}))
