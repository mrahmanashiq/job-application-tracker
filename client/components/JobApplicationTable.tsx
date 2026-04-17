import { useState, useMemo } from 'react'
import { format } from 'date-fns'
import { JobApplication, ApplicationStatus } from '../types/jobApplication'
import { useColumnConfiguration } from '../hooks/useColumnConfiguration'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

interface JobApplicationTableProps {
  applications: JobApplication[]
  onEdit: (application: JobApplication) => void
  totalCount: number
  currentPage: number
  onPageChange: (page: number) => void
  pageSize: number
}

export default function JobApplicationTable({
  applications,
  onEdit,
  totalCount,
  currentPage,
  onPageChange,
  pageSize
}: JobApplicationTableProps) {
  const { visibleColumns } = useColumnConfiguration()
  const totalPages = Math.ceil(totalCount / pageSize)

  const getStatusBadge = (status: ApplicationStatus) => {
    const statusColors = {
      [ApplicationStatus.APPLIED]: 'bg-blue-100 text-blue-800',
      [ApplicationStatus.UNDER_REVIEW]: 'bg-yellow-100 text-yellow-800',
      [ApplicationStatus.INTERVIEW_SCHEDULED]: 'bg-purple-100 text-purple-800',
      [ApplicationStatus.INTERVIEWED]: 'bg-indigo-100 text-indigo-800',
      [ApplicationStatus.OFFER_RECEIVED]: 'bg-green-100 text-green-800',
      [ApplicationStatus.REJECTED]: 'bg-red-100 text-red-800',
      [ApplicationStatus.WITHDRAWN]: 'bg-gray-100 text-gray-800',
      [ApplicationStatus.ACCEPTED]: 'bg-emerald-100 text-emerald-800',
    }

    return (
      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusColors[status]}`}>
        {status.replace('_', ' ').toUpperCase()}
      </span>
    )
  }

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return '-'
    return format(new Date(date), 'MMM dd, yyyy')
  }

  const renderCellContent = (application: JobApplication, columnKey: string) => {
    switch (columnKey) {
      case 'companyName':
        return application.companyName
      case 'jobTitle':
        return application.jobTitle
      case 'applicationStatus':
        return getStatusBadge(application.applicationStatus)
      case 'applicationDate':
        return formatDate(application.applicationDate)
      case 'responseDate':
        return formatDate(application.responseDate)
      case 'interviewDate':
        return formatDate(application.interviewDate)
      case 'salary':
        return application.salary || '-'
      case 'location':
        return application.location || '-'
      case 'techStack':
        if (!application.techStack || application.techStack.length === 0) return '-'
        return (
          <div className="flex flex-wrap gap-1">
            {application.techStack.map((tech, idx) => (
              <span
                key={`${tech}-${idx}`}
                className="inline-flex px-2 py-0.5 text-xs font-medium rounded bg-primary-50 text-primary-700"
              >
                {tech}
              </span>
            ))}
          </div>
        )
      case 'workType':
        return application.workType || '-'
      case 'resumeUsed':
        return application.resumeUsed || '-'
      default:
        return '-'
    }
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {visibleColumns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  style={{ width: column.width }}
                >
                  {column.label}
                </th>
              ))}
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {applications.map((application) => (
              <tr key={application._id} className="hover:bg-gray-50">
                {visibleColumns.map((column) => (
                  <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {renderCellContent(application, column.key)}
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onEdit(application)}
                    className="text-primary-600 hover:text-primary-900 transition-colors duration-200"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span> to{' '}
                <span className="font-medium">{Math.min(currentPage * pageSize, totalCount)}</span> of{' '}
                <span className="font-medium">{totalCount}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeftIcon className="h-5 w-5" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      page === currentPage
                        ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRightIcon className="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}