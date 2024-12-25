import { UserForm, UserTable } from "./components";
import { useDeleteUser, useGetUsers } from "./api";
import { User } from "./types/user";
import UserModal from "./components/UserModal";
import { useState } from "react";

export default function App() {
  const { data: userList = [] } = useGetUsers();
  const deleteUser = useDeleteUser();

  const [client, setClient] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEdit = (user: User) => {
    setClient(user);
    setIsModalOpen(true);
  };

  const handleDelete = async (user: User) => {
    if (confirm(`Tem certeza de que deseja excluir o usuário ${user.Name}?`)) {
      deleteUser.mutate(user.ID, {
        onSuccess: () => alert("Usuário excluído com sucesso!"),
        onError: () => alert("Erro ao excluir o usuário."),
      });
    }
  };

  return (
    <div className="flex w-full items-center flex-col gap-2">
      <div className="w-3/5 min-w-80">
        <div className="mt-4">
          <UserForm />
        </div>
        <div className="mt-4">
          <UserTable
            data={userList}
            onEdit={handleEdit}
            onDelete={handleDelete}
            disabled={deleteUser.isPending}
            className="my-custom-class"
          />
          {client && (
            <UserModal
              client={client}
              open={isModalOpen}
              onOpenChange={setIsModalOpen}
            />
          )}
        </div>
      </div>
    </div>
  );
}
