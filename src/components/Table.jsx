import React from "react";

export default function Table({
  headers = ["Source/Category", "Amount", "Date", "Notes", "Actions"],
  data = [],
}) {
  return (
    <div className="w-full overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <table className="w-full border-collapse text-left text-sm">
        {/* Table Header */}
        <thead className="bg-gray-100 border-b border-gray-300">
          <tr>
            {headers.map((header, index) => (
              <th key={index} className="px-4 py-3 font-semibold text-gray-700">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        {/* Table Body */}
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={headers.length}
                className="px-4 py-4 text-center text-gray-500"
              >
                No records found
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="border-b last:border-none hover:bg-gray-50 transition"
              >
                {/* Object.values(row) is safe now because row is guaranteed to be an object */}
                {Object.values(row).map((cell, cellIndex) => (
                  <td key={cellIndex} className="px-4 py-3 text-gray-700">
                    {cell}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
