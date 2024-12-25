import { useState } from "react";
import Button from "../Button";
import Input from "../Input";
import Switch from "../Switch";
import { useCreateUser } from "../../api";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

type UserFormData = {
  name: string;
  age: string;
  active: boolean;
};

export default function UserForm() {
  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    age: "",
    active: true,
  });

  const { mutateAsync } = useCreateUser();

  const queryClient = useQueryClient();

  async function registerUser() {
    await mutateAsync({
      name: formData.name,
      age: formData.age,
      active: formData.active,
    });

    queryClient.invalidateQueries({
      predicate: (query) => query.queryKey[0] === "users",
    });
    toast(`Usuário ${formData.name} criado com sucesso`, { type: "success" });
    setFormData({
      name: "",
      age: "",
      active: true,
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex sm:flex-row flex-col items-center gap-2">
        <Input
          placeholder="Nome"
          value={formData.name}
          onChange={(e) => {
            setFormData({ ...formData, name: e.target.value });
          }}
        />
        <div className="flex flex-row gap-2 w-full">
          <Input
            className="sm:w-full"
            placeholder="Idade"
            type="number"
            value={formData.age}
            onChange={(e) => {
              setFormData({ ...formData, age: e.target.value });
            }}
          />
          <Switch
            checked={formData.active}
            onCheckedChange={(e) => {
              setFormData({ ...formData, active: e });
            }}
          />
        </div>
      </div>
      <Button
        title="Registrar usuario"
        mode="primary"
        onClick={registerUser}
        className="sm:max-w-64"
      />
    </div>
  );
}
