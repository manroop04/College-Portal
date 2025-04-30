// components/ui/table.tsx
import React from 'react';

type TableProps = {
  children: React.ReactNode;
};

export function Table({ children }: TableProps) {
  return (
    <div className="overflow-x-auto rounded-xl shadow-md border border-gray-200">
      <table className="min-w-full text-sm text-left text-gray-700">
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ children }: TableProps) {
  return (
    <thead className="bg-gray-100 text-xs uppercase text-gray-600">
      {children}
    </thead>
  );
}

export function TableHead({ children }: TableProps) {
  return (
    <th scope="col" className="px-6 py-3 font-medium">
      {children}
    </th>
  );
}

export function TableBody({ children }: TableProps) {
  return <tbody className="bg-white divide-y divide-gray-200">{children}</tbody>;
}

export function TableRow({ children }: TableProps) {
  return <tr>{children}</tr>;
}

export function TableCell({ children }: TableProps) {
  return <td className="px-6 py-4">{children}</td>;
}

export default Table;