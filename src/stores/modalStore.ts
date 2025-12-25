import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export type ModalType = 'alert' | 'confirm' | 'success' | 'error' | 'warning' | 'info'

export interface ModalOptions {
  title: string
  content: string
  type?: ModalType
  confirmText?: string
  cancelText?: string
}

export const useModalStore = defineStore('modal', () => {
  const isVisible = ref(false)
  const modalOptions = ref<ModalOptions>({
    title: '',
    content: '',
    type: 'alert',
  })

  // Promise 기반 Confirm 처리를 위한 resolve 함수 저장
  const resolvePromise = ref<((value: boolean) => void) | null>(null)

  const openAppModal = (options: ModalOptions): Promise<boolean> => {
    // [Critical Fix] 이미 열려있는 모달이 있다면 강제로 취소(false) 처리하여 닫음
    // 이를 통해 Promise가 영원히 Pending 상태로 남는 것을 방지함
    if (isVisible.value && resolvePromise.value) {
      resolvePromise.value(false)
      resolvePromise.value = null
    }

    modalOptions.value = {
      type: 'alert', // default
      confirmText: '확인',
      // cancelText: '취소', // [Fix] 기본값을 제거하여 confirm 타입이 아니면 취소 버튼이 안 뜨게 함
      ...options,
    }
    isVisible.value = true

    // confirm 타입이나 alert의 확인 버튼 클릭을 기다리는 Promise 반환
    return new Promise((resolve) => {
      resolvePromise.value = resolve
    })
  }

  const confirmAction = () => {
    isVisible.value = false
    if (resolvePromise.value) {
      resolvePromise.value(true)
      resolvePromise.value = null
    }
  }

  const cancelAction = () => {
    isVisible.value = false
    if (resolvePromise.value) {
      resolvePromise.value(false)
      resolvePromise.value = null
    }
  }

  return {
    isVisible,
    options: computed(() => modalOptions.value),
    openAppModal,
    confirmAction,
    cancelAction,
  }
})
