import {
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import axiosService from "../../services/axiosService";

interface CreateUserParams {
  name: string;
  age?: string;
  active: boolean;
}

interface UpdateUserParams {
  name?: string;
  age?: string;
  active?: boolean;
}
import { User } from "../../types/user";

// Funções utilitárias para lidar com requisições
const fetchUsers = async (): Promise<User[]> => {
  const response = await axiosService.get<User[]>("/person");
  return response.data;
};

const fetchUserById = async (id: string): Promise<User> => {
  const response = await axiosService.get<User>(`/person/${id}`);
  return response.data;
};

const deleteUserById = async (id: string): Promise<void> => {
  const response = await axiosService.delete(`/person/${id}`);
  if (response.status !== 200) throw new Error("Erro ao deletar usuário");
};

const createUser = async (params: CreateUserParams): Promise<User> => {
  const response = await axiosService.post<User>("/person", {
    name: params.name,
    age: parseInt(params.age ?? "0"),
    active: params.active,
  });
  return response.data;
};

const updateUserById = async (
  id: string,
  params: UpdateUserParams
): Promise<User> => {
  const response = await axiosService.patch<User>(`/person/${id}`, {
    name: params.name,
    age: parseInt(params.age ?? "0"),
    active: params.active,
  });
  return response.data;
};

// Hooks

// Fetch all users
export function useGetUsers(options?: UseQueryOptions<User[]>) {
  return useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
    ...options,
  });
}

// Fetch user by ID
export function useGetUserById(id: string, options?: UseQueryOptions<User>) {
  return useQuery({
    queryKey: ["users", id],
    queryFn: () => fetchUserById(id),
    enabled: !!id, // Só busca se o ID existir
    ...options,
  });
}

// Delete user
export function useDeleteUser(
  options?: UseMutationOptions<void, Error, string>
) {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: deleteUserById,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.setQueryData<User[] | undefined>(["users"], (oldData) =>
        oldData ? oldData.filter((user) => user.ID !== id) : []
      );
    },
    ...options,
  });
}

// Create user
export function useCreateUser(
  options?: UseMutationOptions<User, unknown, CreateUserParams>
) {
  const queryClient = useQueryClient();

  return useMutation<User, unknown, CreateUserParams>({
    mutationFn: createUser,
    onSuccess: (newUser) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.setQueryData<User[] | undefined>(["users"], (oldData) =>
        oldData ? [...oldData, newUser] : [newUser]
      );
    },
    ...options,
  });
}

// Update user
export function useUpdateUser(
  id: string,
  options?: UseMutationOptions<User, unknown, UpdateUserParams>
) {
  const queryClient = useQueryClient();

  return useMutation<User, unknown, UpdateUserParams>({
    mutationFn: (params) => updateUserById(id, params),
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.setQueryData<User[] | undefined>(["users"], (oldData) =>
        oldData
          ? oldData.map((user) =>
              user.ID === updatedUser.ID ? updatedUser : user
            )
          : []
      );
    },
    ...options,
  });
}
