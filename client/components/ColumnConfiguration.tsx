import { useState } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Column } from '../types/jobApplication'
import { useColumnConfiguration } from '../hooks/useColumnConfiguration'

interface ColumnConfigurationProps {
  onClose: () => void
}

export default function ColumnConfiguration({ onClose }: ColumnConfigurationProps) {
  const { columns, updateColumns, resetColumns } = useColumnConfiguration()
  const [localColumns, setLocalColumns] = useState<Column[]>(columns)

  const handleColumnToggle = (columnKey: string) => {
    const updatedColumns = localColumns.map(col => 
      col.key === columnKey 
        ? { ...col, visible: !col.visible }
        : col
    )
    setLocalColumns(updatedColumns)
  }

  const handleSave = () => {
    updateColumns(localColumns)
    onClose()
  }

  const handleReset = () => {
    resetColumns()
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Configure Columns
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-sm text-gray-600 mb-6">
            Select which columns to display in the job applications table. Required columns cannot be hidden.
          </p>

          <div className="space-y-4">
            {localColumns.map((column) => (
              <div key={column.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id={column.key}
                    checked={column.visible}
                    onChange={() => handleColumnToggle(column.key)}
                    disabled={column.required}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <label htmlFor={column.key} className="text-sm font-medium text-gray-900">
                    {column.label}
                  </label>
                  {column.required && (
                    <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                      Required
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex justify-between">
              <button
                onClick={handleReset}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
              >
                Reset to Default
              </button>
              <div className="flex space-x-4">
                <button
                  onClick={onClose}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="btn-primary"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}