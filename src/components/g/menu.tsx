import { type CSSProperties, PropType, Teleport, computed, defineComponent, nextTick, onUnmounted, ref, watch, watchEffect } from 'vue'

import type { MenuItem, MenuItemRole, MenuPosition } from '@/utils'
import { getPrimitiveProp } from '../sharedProps'

export interface MenuProps {
  anchorElement?: HTMLElement | null
  ariaLabel: string
  items: MenuItem[]
  menuPosition?: MenuPosition | null
}

export const menuProps = {
  anchorElement: {
    type: Object as PropType<HTMLElement | null>,
    required: false,
    default: null
  },

  ariaLabel: getPrimitiveProp(String, true),

  items: {
    type: Array as PropType<MenuItem[]>,
    required: true,
    default: undefined
  },

  menuPosition: {
    type: Object as PropType<MenuPosition | null>,
    required: false,
    default: null
  }
}

const viewportMargin = 8

const baseClassName = 'g-menu'

export const GMenu = defineComponent({
  name: 'GMenu',

  props: menuProps,

  emits: [ 'close', 'select' ],

  setup(props: MenuProps, { emit }) {
    const menuReference = ref<HTMLDivElement | null>(null)
    const resolvedMenuPosition = ref(props.menuPosition ?? null)

    const menuStyle = computed<CSSProperties>(() => {
      if (!resolvedMenuPosition.value) {
        return {
          visibility: 'hidden'
        }
      }

      const nextMenuStyle: CSSProperties = {
        left: `${resolvedMenuPosition.value.x}px`,
        top: `${resolvedMenuPosition.value.y}px`
      }

      if (resolvedMenuPosition.value.minWidth) {
        nextMenuStyle.minWidth = `${resolvedMenuPosition.value.minWidth}px`
      }

      return nextMenuStyle
    })

    const closeMenu = (): void => {
      emit('close')
    }

    watch(
      () => props.menuPosition,
      value => resolvedMenuPosition.value = value ?? null,
      { immediate: true }
    )

    watch(
      () => [ props.items.length, props.menuPosition ],
      async () => {
        if (!props.menuPosition) {
          return
        }

        await nextTick()

        if (!menuReference.value) {
          return
        }

        const menuBounds = menuReference.value.getBoundingClientRect()
        let resolvedX = props.menuPosition.x
        let resolvedY = props.menuPosition.y
        const fitsRight = resolvedX + menuBounds.width + viewportMargin <= window.innerWidth
        const fitsBottom = resolvedY + menuBounds.height + viewportMargin <= window.innerHeight

        if (!fitsRight) {
          resolvedX = props.menuPosition.x - menuBounds.width
        }

        if (!fitsBottom) {
          resolvedY = props.menuPosition.y - menuBounds.height
        }

        if (resolvedX < viewportMargin) {
          resolvedX = viewportMargin
        }

        if (resolvedY < viewportMargin) {
          resolvedY = viewportMargin
        }

        resolvedMenuPosition.value = {
          ...props.menuPosition,
          x: resolvedX,
          y: resolvedY
        }
      },
      { flush: 'post' }
    )

    watchEffect(onCleanup => {
      if (!props.menuPosition) {
        return
      }

      const handleEscape = (event: KeyboardEvent): void => {
        if (event.key !== 'Escape') {
          return
        }

        closeMenu()
      }

      const handlePointerDown = (event: PointerEvent): void => {
        if (!menuReference.value) {
          return
        }

        const eventTarget = event.target

        if (!(eventTarget instanceof Node)) {
          return
        }

        if (menuReference.value.contains(eventTarget)) {
          return
        }

        if (props.anchorElement?.contains(eventTarget)) {
          return
        }

        closeMenu()
      }

      const handleViewportResize = (): void => {
        closeMenu()
      }
      const handleViewportScroll = (event: Event): void => {
        const eventTarget = event.target

        if (eventTarget instanceof Node && menuReference.value?.contains(eventTarget)) {
          return
        }

        closeMenu()
      }

      const handleWindowBlur = (): void => {
        closeMenu()
      }

      window.addEventListener('blur', handleWindowBlur)
      window.addEventListener('keydown', handleEscape)
      window.addEventListener('pointerdown', handlePointerDown, true)
      window.addEventListener('resize', handleViewportResize)
      window.addEventListener('scroll', handleViewportScroll, true)

      onCleanup(() => {
        window.removeEventListener('blur', handleWindowBlur)
        window.removeEventListener('keydown', handleEscape)
        window.removeEventListener('pointerdown', handlePointerDown, true)
        window.removeEventListener('resize', handleViewportResize)
        window.removeEventListener('scroll', handleViewportScroll, true)
      })
    })

    onUnmounted(() => {
      resolvedMenuPosition.value = null
    })

    const renderMenuItem = (menuItem: MenuItem) => {
      let menuItemAriaChecked: boolean | undefined
      let menuItemRole: MenuItemRole = 'menuitem'
      const menuItemClassNames = [ `${baseClassName}__item` ]

      if (menuItem.role === 'menuitemradio') {
        menuItemAriaChecked = menuItem.isActive === true
      }

      if (menuItem.role) {
        menuItemRole = menuItem.role
      }

      if (menuItem.isActive) {
        menuItemClassNames.push(`${baseClassName}__item--active`)
      }

      if (menuItem.variant === 'danger') {
        menuItemClassNames.push(`${baseClassName}__item--danger`)
      }

      const handleMenuItemClick = (event: MouseEvent): void => {
        event.preventDefault()
        event.stopPropagation()

        if (menuItem.disabled) {
          return
        }

        emit('select', menuItem.id)
        closeMenu()
      }

      const handleMenuItemMouseDown = (event: MouseEvent): void => {
        event.preventDefault()
        event.stopPropagation()
      }

      return (
        <button
          key={menuItem.id}
          aria-checked={menuItemAriaChecked}
          aria-label={menuItem.ariaLabel}
          class={menuItemClassNames.join(' ')}
          disabled={menuItem.disabled}
          role={menuItemRole}
          type="button"
          onClick={handleMenuItemClick}
          onMousedown={handleMenuItemMouseDown}
        >
          <span class={`${baseClassName}__label`}>{menuItem.label}</span>
        </button>
      )
    }

    const renderMenu = () => {
      return (
        <Teleport to="body">
          <div class={`${baseClassName}__layer`}>
            <div
              ref={menuReference}
              aria-label={props.ariaLabel}
              class={baseClassName}
              role="menu"
              style={menuStyle.value}
            >
              {props.items.map(renderMenuItem)}
            </div>
          </div>
        </Teleport>
      )
    }

    return () => {
      if (props.menuPosition) {
        return (
          renderMenu()
        )
      }
    }
  }
})
