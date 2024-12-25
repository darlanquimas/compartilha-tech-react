import React from "react";

interface Column<T> {
  title: string;
  render?: (item: T) => React.ReactNode;
  key: keyof T | string;
}

interface TableGridProps<T> {
  data: T[];
  columns: Column<T>[];
  actions?: (item: T) => React.ReactNode;
}

export default function TableGrid<T>({
  data,
  columns,
  actions,
}: TableGridProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            {columns.map((col) => (
              <th key={col.key as string} className="px-4 py-2 border">
                {col.title}
              </th>
            ))}
            {actions && <th className="px-4 py-2 border w-40">Ações</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="hover:bg-gray-100">
              {columns.map((col) => (
                <td key={col.key as string} className="px-4 py-2 border">
                  {col.render
                    ? col.render(item)
                    : (item[col.key as keyof T] as React.ReactNode)}
                </td>
              ))}
              {actions && (
                <td className="px-4 py-2 border flex flex-row flex-nowrap gap-4">
                  {actions(item)}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
