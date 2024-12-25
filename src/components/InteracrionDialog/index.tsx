import * as Dialog from "@radix-ui/react-dialog";
import { FiX } from "react-icons/fi";

import Button from "../Button"; // Reutilizando o componente Button do seu código
import { toast } from "react-toastify";

interface DecisionDialogProps {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export default function InteracrionDialog({
  open,
  onOpenChange,
  onConfirm,
  title,
  message,
}: DecisionDialogProps) {
  const handleConfirm = async () => {
    try {
      await onConfirm();
    } catch (error) {
      toast(`Erro ao confirmar a ação: ${error}`, { type: "error" });
    } finally {
      onOpenChange(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-30" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded shadow-md w-96">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-lg font-bold">{title}</Dialog.Title>
            <Dialog.Close className="text-gray-500 hover:text-gray-800">
              <FiX size={20} />
            </Dialog.Close>
          </div>
          <Dialog.Description className="mb-4 text-sm text-gray-500">
            {message}
          </Dialog.Description>
          <div className="mt-6 flex justify-end gap-4">
            <Button
              title="Cancelar"
              type="button"
              onClick={() => onOpenChange(false)}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              mode={"secondary"}
            />
            <Button
              title="Confirmar"
              type="button"
              onClick={handleConfirm}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              mode={"primary"}
            />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
