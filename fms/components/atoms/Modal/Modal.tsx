import CloseIcon from "@icons/CloseIcon.svg";
import { Modal as AntModal } from "antd";
import { ReactNode } from "react";

const Modal = ({
  footer,
  title,
  isVisible,
  onCancel,
  content,
  width,
  destroyOnClose = true,
  className,
}: {
  footer: ReactNode;
  title: string;
  isVisible: boolean;
  // FIXME: add types for e
  onCancel: ((e: any) => void) | undefined;
  content: ReactNode;
  width?: string | number | undefined;
  destroyOnClose?: boolean;
  className?: string;
}) => {
  return (
    <AntModal
      destroyOnClose={destroyOnClose}
      width={width}
      closeIcon={<CloseIcon className="text-2xl" />}
      title={title}
      footer={footer}
      visible={isVisible}
      onCancel={onCancel}
      className={className}
    >
      {content}
    </AntModal>
  );
};

export default Modal;
