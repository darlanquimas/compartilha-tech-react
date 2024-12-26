import { FiEdit, FiTrash2 } from "react-icons/fi";
import TableGrid from "../TableGrid";
import { User } from "../../types/user";
import { useDeleteUser } from "../../api/user";
import { toast } from "react-toastify";
import { useState } from "react";
import InteracrionDialog from "../InteracrionDialog";

interface UserTableProps {
  data: User[];
  onEdit?: (user: User) => void;
  [key: string]: unknown;
}

export default function UserTable({ data, onEdit, ...rest }: UserTableProps) {
  const { mutateAsync: deleteUser } = useDeleteUser();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const columns = [
    { title: "Nome", key: "Name" },
    { title: "Idade", key: "Age" },
    {
      title: "Status",
      key: "Active",
      render: (user: User) => (user.Active ? "Ativo" : "Inativo"),
    },
  ];

  const actions = (user: User) => (
    <div className="flex gap-2">
      {onEdit && (
        <button
          type="button"
          className="p-2 rounded-full border-solid border-2 border-black"
          onClick={() => onEdit(user)}
          aria-label={`Editar ${user.Name}`}
        >
          <FiEdit size={24} color="black" />
        </button>
      )}
      <button
        type="button"
        className="p-2 rounded-full border-solid border-2 border-black"
        onClick={() => {
          setUserToDelete(user);
          setIsDialogOpen(true);
        }}
        aria-label={`Excluir ${user.Name}`}
      >
        <FiTrash2 size={24} color="black" />
      </button>
    </div>
  );

  const handleConfirmDelete = async () => {
    if (userToDelete) {
      try {
        await deleteUser(userToDelete.ID);
        toast(`Usuário ${userToDelete.Name} excluído com sucesso!`, {
          type: "success",
        });
      } catch {
        toast("Erro ao excluir o usuário. Tente novamente.", {
          type: "error",
        });
      }
    }
  };

  return (
    <div>
      <TableGrid data={data} columns={columns} actions={actions} {...rest} />
      <InteracrionDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title="Excluir Usuário - Essa ação não pode ser desfeita!"
        message={`Tem certeza que deseja excluir o usuário ${userToDelete?.Name}?`}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
