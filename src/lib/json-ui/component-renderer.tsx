import { createElement, useMemo, Fragment } from 'react'
import { UIComponent, Binding, ComponentRendererProps } from '@/types/json-ui'
import { getUIComponent } from './component-registry'
import { resolveDataBinding, evaluateCondition } from './utils'

function resolveBinding(
  binding: Binding,
  data: Record<string, unknown>,
  context: Record<string, unknown>,
  state?: Record<string, unknown>
): unknown {
  return resolveDataBinding(binding, data, context, { state, bindings: context })
}

export function ComponentRenderer({ component, data, context = {}, state, onEvent }: ComponentRendererProps) {
  const mergedData = useMemo(() => ({ ...data, ...context }), [data, context])
  const resolvedProps = useMemo(() => {
    const resolved: Record<string, unknown> = { ...component.props }
    
    if (component.bindings) {
      Object.entries(component.bindings).forEach(([propName, binding]) => {
        resolved[propName] = resolveBinding(binding, data, context, state)
      })
    }

    if (component.dataBinding) {
      const boundData = resolveDataBinding(component.dataBinding, data, context, { state, bindings: context })
      if (boundData !== undefined) {
        resolved.value = boundData
        resolved.data = boundData
      }
    }
    
    if (component.events && onEvent) {
      component.events.forEach(handler => {
        resolved[`on${handler.event.charAt(0).toUpperCase()}${handler.event.slice(1)}`] = (e: unknown) => {
          const conditionMet = !handler.condition
            || (typeof handler.condition === 'function'
              ? handler.condition(mergedData as Record<string, any>)
              : evaluateCondition(handler.condition, mergedData as Record<string, any>))
          if (conditionMet) {
            onEvent(component.id, handler, e)
          }
        }
      })
    }

    if (component.className) {
      resolved.className = resolved.className
        ? `${resolved.className} ${component.className}`
        : component.className
    }

    if (component.style) {
      resolved.style = { ...(resolved.style as Record<string, unknown>), ...component.style }
    }
    
    return resolved
  }, [component, data, context, state, mergedData, onEvent])
  
  const Component = getUIComponent(component.type)
  
  if (!Component) {
    console.warn(`Component type "${component.type}" not found`)
    return null
  }
  
  const renderChildren = (
    children: UIComponent[] | string | undefined,
    renderContext: Record<string, unknown>
  ) => {
    if (!children) return null
    if (typeof children === 'string') {
      return children
    }

    return children.map((child, index) => (
      <Fragment key={typeof child === 'string' ? `text-${index}` : child.id || index}>
        {typeof child === 'string'
          ? child
          : (
            <ComponentRenderer
              component={child}
              data={data}
              context={renderContext}
              state={state}
              onEvent={onEvent}
            />
          )}
      </Fragment>
    ))
  }

  const renderBranch = (
    branch: UIComponent | (UIComponent | string)[] | string | undefined,
    renderContext: Record<string, unknown>
  ) => {
    if (branch === undefined) return null
    if (typeof branch === 'string') {
      return branch
    }
    if (Array.isArray(branch)) {
      return branch.map((child, index) => (
        <Fragment key={typeof child === 'string' ? `text-${index}` : child.id || index}>
          {typeof child === 'string'
            ? child
            : (
              <ComponentRenderer
                component={child}
                data={data}
                context={renderContext}
                state={state}
                onEvent={onEvent}
              />
            )}
        </Fragment>
      ))
    }
    return (
      <ComponentRenderer
        component={branch}
        data={data}
        context={renderContext}
        state={state}
        onEvent={onEvent}
      />
    )
  }

  const renderConditionalContent = (renderContext: Record<string, unknown>) => {
    if (!component.conditional) return undefined
    const conditionMet = evaluateCondition(component.conditional.if, { ...data, ...renderContext } as Record<string, any>)
    if (conditionMet) {
      if (component.conditional.then !== undefined) {
        return renderBranch(component.conditional.then as UIComponent | (UIComponent | string)[] | string, renderContext)
      }
      return undefined
    }
    if (component.conditional.else !== undefined) {
      return renderBranch(component.conditional.else as UIComponent | (UIComponent | string)[] | string, renderContext)
    }
    return null
  }

  if (component.loop) {
    const items = resolveDataBinding(component.loop.source, data, context, { state, bindings: context }) || []
    const loopChildren = items.map((item: unknown, index: number) => {
      const loopContext = {
        ...context,
        [component.loop!.itemVar]: item,
        ...(component.loop!.indexVar ? { [component.loop!.indexVar]: index } : {}),
      }

      if (component.conditional) {
        const conditionalContent = renderConditionalContent(loopContext)
        if (conditionalContent !== undefined) {
          return (
            <Fragment key={`${component.id}-${index}`}>{conditionalContent}</Fragment>
          )
        }
      }

      if (component.condition) {
        const conditionValue = resolveBinding(component.condition, data, loopContext, state)
        if (!conditionValue) {
          return null
        }
      }

      return (
        <Fragment key={`${component.id}-${index}`}>
          {renderChildren(component.children, loopContext)}
        </Fragment>
      )
    })

    return createElement(Component, resolvedProps, loopChildren)
  }

  if (component.conditional) {
    const conditionalContent = renderConditionalContent(mergedData)
    if (conditionalContent !== undefined) {
      return conditionalContent
    }
  }

  if (component.condition) {
    const conditionValue = resolveBinding(component.condition, data, context, state)
    if (!conditionValue) {
      return null
    }
  }

  return createElement(Component, resolvedProps, renderChildren(component.children, context))
}
