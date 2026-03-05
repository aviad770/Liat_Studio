import { useEffect, useRef, type ReactNode } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (isOpen) {
      dialog.showModal()
    } else {
      dialog.close()
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="fixed inset-0 m-0 p-0 w-full max-w-none h-auto max-h-[85vh] bg-white rounded-t-2xl shadow-xl border-0 bottom-0 top-auto backdrop:bg-black/40 overflow-y-auto"
      style={{ position: 'fixed' }}
    >
      <div className="sticky top-0 bg-white border-b border-sand-200 px-4 py-3 flex items-center justify-between z-10">
        <h3 className="text-lg font-bold text-sand-800">{title}</h3>
        <button
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-sand-100 text-sand-500 text-xl"
        >
          ✕
        </button>
      </div>
      <div className="p-4">{children}</div>
    </dialog>
  )
}
