import * as Dialog from "@radix-ui/react-dialog";
import { FiX } from "react-icons/fi";
import { useEffect, useState } from "react";
import { User } from "../../types/user";
import Switch from "../Switch";
import Input from "../Input";
import Button from "../Button";
import { toast } from "react-toastify";
import { useUpdateUser } from "../../api";

interface UserModalProps {
  client: User;
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export default function UserModal({
  client,
  open,
  onOpenChange,
}: UserModalProps) {
  const [formData, setFormData] = useState<User>(client);

  const { mutateAsync: updateUser } = useUpdateUser(client.ID);

  useEffect(() => {
    if (open) {
      setFormData(client);
    }
  }, [client, open]);

  const handleSave = async () => {
    try {
      await updateUser({
        name: formData.Name,
        age: formData.Age.toString(),
        active: formData.Active,
      });
      onOpenChange(false);
      toast(`Usuário ${formData.Name} atualizado com sucesso`, {
        type: "success",
      });
    } catch (error) {
      console.log("Error updating user: ", error);
      toast("Erro ao atualizar usuário: ", { type: "error" });
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-30" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded shadow-md w-96">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-lg font-bold">
              Editar Usuário
            </Dialog.Title>
            <Dialog.Close className="text-gray-500 hover:text-gray-800">
              <FiX size={20} />
            </Dialog.Close>
          </div>
          <Dialog.Description className="mb-4 text-sm text-gray-500">
            Atualize os dados do usuário e clique em "Salvar".
          </Dialog.Description>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nome
              </label>
              <Input
                type="text"
                name="name"
                value={formData.Name}
                onChange={(e) => {
                  setFormData({ ...formData, Name: e.target.value });
                }}
                className="mt-1 block w-full border border-gray-300 rounded p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Idade
              </label>
              <Input
                type="number"
                name="age"
                value={formData.Age}
                onChange={(e) => {
                  setFormData({ ...formData, Age: +e.target.value });
                }}
                className="mt-1 block w-full border border-gray-300 rounded p-2"
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={formData.Active}
                onCheckedChange={(e) => {
                  setFormData({ ...formData, Active: e });
                }}
              />
              <label className="text-sm font-medium text-gray-700">Ativo</label>
            </div>
          </form>
          <div className="mt-6 flex justify-end gap-4">
            <Button
              title="Cancelar"
              type="button"
              onClick={() => onOpenChange(false)}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              mode={"secondary"}
            />
            <Button
              title="Salvar"
              type="button"
              onClick={handleSave}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              mode={"primary"}
            />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
