import { BetaSchemaForm } from '@ant-design/pro-components';
import { Modal } from 'antd';
import React, { useRef } from 'react';
import type { ProFormInstance } from '@ant-design/pro-components';
import type { FormModalProps, Recordable } from './types';
interface ShowModalProps<T extends object = Recordable> {
  modalProps: FormModalProps<T>;
  formProps: any;
}
export function useFormModal() {
  const { confirm } = Modal;
  const formRef = useRef<ProFormInstance>();
  let modal: any = null;
  const showModal = async <P extends object>({ modalProps, formProps }: ShowModalProps<P>) => {
    const onCancel = (e: any) => {
      modal?.destroy();
      // formRef.value?.resetFields();
      modalProps?.onCancel?.(e);
    };
    const onSubmit = async (values: any) => {
      await modalProps?.onFinish?.(values);
      // formRef.value?.resetFields();
      modal?.destroy();
    };
    const onOk = async () => {
      // const values = (formRef?.formModel || {}) as any;
      try {
        if (!formRef.current) return;
        const values = await formRef.current.validateFields();
        await onSubmit(values);
      } catch (error) {
        modalProps?.onFail?.({} as any);
        return Promise.reject(error);
      }
    };
    function sleep(ms: number) {
      return new Promise((resolve) => {
        setTimeout(resolve, ms);
      });
    }
    modal = await confirm({
      icon: null,
      ...modalProps,
      onCancel,
      onOk,
      content: (
        <BetaSchemaForm
          layoutType="Form"
          shouldUpdate={true}
          formRef={formRef}
          {...formProps}
          submitter={false}
        ></BetaSchemaForm>
      ),
    });
    await sleep(500);
    return formRef;
  };

  return [showModal, formRef] as const;
}
