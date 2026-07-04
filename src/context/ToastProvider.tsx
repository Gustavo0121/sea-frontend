import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { ToastContext, type ToastType } from './toastContext'
import { ToastViewport, ToastItemView } from '../components/Toast'

interface ToastItem {
  id: number
  message: string
  type: ToastType
}

const TOAST_DURATION_MS = 4000

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const removeToast = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const showToast = useCallback(
    (message: string, type: ToastType = 'info') => {
      const id = Date.now() + Math.random()
      setToasts((current) => [...current, { id, message, type }])
      window.setTimeout(() => removeToast(id), TOAST_DURATION_MS)
    },
    [removeToast],
  )

  const value = useMemo(() => ({ showToast }), [showToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport>
        {toasts.map((toast) => (
          <ToastItemView key={toast.id} $type={toast.type} onClick={() => removeToast(toast.id)}>
            {toast.message}
          </ToastItemView>
        ))}
      </ToastViewport>
    </ToastContext.Provider>
  )
}
