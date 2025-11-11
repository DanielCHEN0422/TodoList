import { useState, useCallback } from 'react'

interface UseModalOptions {
  onOpen?: () => void
  onClose?: () => void
  defaultOpen?: boolean
}

interface UseModalReturn {
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
  // 扩展能力：可以传入自定义的打开/关闭逻辑
  setOpen: (open: boolean) => void
}

/**
 * Modal 控制 Hook
 * 提供基础的打开/关闭功能，并保留扩展能力
 * 
 * @param options - 配置选项
 * @returns Modal 控制对象
 * 
 * @example
 * ```tsx
 * const { isOpen, open, close } = useModal({
 *   onOpen: () => console.log('Modal opened'),
 *   onClose: () => console.log('Modal closed')
 * })
 * ```
 */
export function useModal(options: UseModalOptions = {}): UseModalReturn {
  const { onOpen, onClose, defaultOpen = false } = options

  const [isOpen, setIsOpen] = useState<boolean>(defaultOpen)

  const open = useCallback(() => {
    setIsOpen(true)
    onOpen?.()
  }, [onOpen])

  const close = useCallback(() => {
    setIsOpen(false)
    onClose?.()
  }, [onClose])

  const toggle = useCallback(() => {
    setIsOpen((prev) => {
      const newValue = !prev
      if (newValue) {
        onOpen?.()
      } else {
        onClose?.()
      }
      return newValue
    })
  }, [onOpen, onClose])

  const setOpen = useCallback((open: boolean) => {
    setIsOpen(open)
    if (open) {
      onOpen?.()
    } else {
      onClose?.()
    }
  }, [onOpen, onClose])

  return {
    isOpen,
    open,
    close,
    toggle,
    setOpen,
  }
}

