import React from "react";

export default function Table({
  headers = ["Source/Category", "Amount", "Date", "Notes", "Actions"],
  data = [],
}) {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-gray-200 shadow-sm">
      <table className="w-full border-collapse text-sm">
        {/* Table Header */}
        <thead className="bg-linear-to-r from-gray-50 to-gray-100">
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                className="px-6 py-4 font-semibold text-gray-700 border-b border-gray-200 text-left first:rounded-tl-xl last:rounded-tr-xl"
              >
                <div className="flex items-center gap-2">
                  {header}
                  {index < headers.length - 1 && (
                    <div className="w-px h-4 bg-gray-300 ml-2" />
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className="divide-y divide-gray-100">
          {data.length === 0 ? (
            <tr>
              <td colSpan={headers.length} className="px-6 py-12 text-center">
                <div className="flex flex-col items-center justify-center gap-3">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.801 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.801 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-600 font-medium">
                      No records found
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      Add some data to get started
                    </p>
                  </div>
                </div>
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="hover:bg-linear-to-r hover:from-gray-50/50 hover:to-white transition-all duration-200 group"
              >
                {Object.values(row).map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="px-6 py-4 text-gray-700 group-hover:text-gray-900 relative"
                  >
                    {/* Add subtle hover effect */}
                    <div className="relative z-10">
                      {React.isValidElement(cell) ? cell : cell}
                    </div>
                    {/* Background highlight on hover */}
                    <div className="absolute inset-0 bg-linear-to-r from-transparent to-gray-50/30 opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>

        {/* Optional Table Footer */}
        {data.length > 0 && (
          <tfoot className="bg-gray-50 border-t border-gray-200">
            <tr>
              <td colSpan={headers.length} className="px-6 py-3">
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <div>
                    Showing{" "}
                    <span className="font-semibold text-gray-700">
                      {data.length}
                    </span>{" "}
                    records
                  </div>
                  <div className="flex items-center gap-4">
                    <button className="px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors text-gray-600">
                      Previous
                    </button>
                    <span className="text-gray-700">Page 1 of 1</span>
                    <button className="px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors text-gray-600">
                      Next
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}
