import { IMAGE_ERROR_DATA } from "@constants/index";
import { Image, Modal } from "antd";
import { MouseEvent } from "react";

export const PhotoModal = ({
  photoData,
  isVisible,
  onClose,
}: {
  photoData: {
    id: string;
    filename: string;
  }[];
  isVisible: boolean;
  onClose:
    | ((e: MouseEvent<HTMLElement, globalThis.MouseEvent>) => void)
    | undefined;
}) => {
  return (
    <Modal
      width={"75%"}
      footer={null}
      title="Images"
      visible={isVisible}
      onCancel={onClose}
    >
      <div className="grid grid-cols-3 gap-2">
        <Image.PreviewGroup
          preview={{
            modalRender: (children) => <div className="pb-12">{children}</div>,
          }}
        >
          {photoData &&
            photoData.map((image: { id: string; filename: string }) => (
              <Image
                placeholder="blur"
                key={image.id}
                height={250}
                fallback={IMAGE_ERROR_DATA}
                src={image.filename}
                alt="Image data"
              />
            ))}
        </Image.PreviewGroup>
      </div>
    </Modal>
  );
};
