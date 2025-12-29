import { useRef } from 'react'

import styles from './Modal.module.scss'

type ModalProps = {
  buttonLabel?: string
  buttonClassName?: string
  children?: React.ReactNode
}

const Modal = ({ buttonLabel = 'モーダルを開く', buttonClassName = '', children }: ModalProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  const openModal = () => {
    if (dialogRef.current) {
      dialogRef.current?.showModal()
      dialogRef.current.removeAttribute('style')
    }
  }
  const closeModal = () => {
    dialogRef.current?.close()
  }

  const handleBackdropClick = (event: React.MouseEvent<HTMLDialogElement, MouseEvent>) => {
    if (event.target === dialogRef.current) {
      closeModal()
    }
  }

  return (
    <>
      {/* モーダルを開くボタン */}
      <button
        type="button"
        onClick={openModal}
        className={`${styles.openBtn} ${buttonClassName && styles[buttonClassName]}`}
      >
        {buttonLabel}
      </button>
      {/* モーダル本体（クリックで閉じる挙動を追加） */}
      <dialog ref={dialogRef} className={styles.dialog} onClick={handleBackdropClick}>
        {children}
        <button type="button" ref={closeButtonRef} onClick={closeModal} aria-label="閉じる" className={styles.closeBtn}>
          ×
        </button>
      </dialog>
    </>
  )
}

export default Modal
