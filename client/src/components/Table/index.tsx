import React from "react";
import type { FC, ReactNode } from "react";

/* ========= TYPES ========= */
interface TableProps {
    children: ReactNode;
    loading?: boolean;
    emptyText?: string;
    className?: string;
}

/* ========= TABLE ========= */
const Table: FC<TableProps> = ({ children, loading, emptyText, className = "" }) => {
    const hasChildren = React.Children.count(children) > 0;

    return (
        <div className={`overflow-x-auto rounded-lg border shadow-sm ${className}`}>
            <div className="relative">
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-10 rounded-lg">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                )}
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                    {hasChildren ? children : (
                        <tbody className="bg-white">
                            <tr>
                                <td colSpan={100} className="px-6 py-12 text-center text-gray-500">
                                    {emptyText || "No data available"}
                                </td>
                            </tr>
                        </tbody>
                    )}
                </table>
            </div>
        </div>
    );
};

/* ========= HEADER ========= */
const TableHeader: FC<TableProps> = ({ children, className = "" }) => (
    <thead className={`bg-gray-50 text-gray-900 text-xs font-medium uppercase tracking-wider ${className}`}>
        {children}
    </thead>
);

/* ========= BODY ========= */
const TableBody: FC<TableProps> = ({ children, className = "" }) => (
    <tbody className={`bg-white divide-y divide-gray-200 ${className}`}>
        {children}
    </tbody>
);

/* ========= ROW ========= */
const TableRow: FC<TableProps> = ({ children, className = "" }) => (
    <tr className={`hover:bg-gray-50 transition-colors ${className}`}>
        {children}
    </tr>
);

/* ========= HEAD CELL ========= */
const TableHeadCell: FC<TableProps> = ({ children, className = "" }) => (
    <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${className}`}>
        {children}
    </th>
);

/* ========= CELL ========= */
const TableCell: FC<TableProps> = ({ children, className = "" }) => (
    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 ${className}`}>
        {children}
    </td>
);

/* ========= EXPORTS ========= */
export { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell };


