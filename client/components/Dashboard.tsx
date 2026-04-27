import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import JobApplicationForm from './JobApplicationForm'
import JobApplicationTable from './JobApplicationTable'
import ColumnConfiguration from './ColumnConfiguration'
import { JobApplication, ApplicationStatus } from '../types/jobApplication'
import { useJobApplications } from '../hooks/useJobApplications'

export default function Dashboard() {
  const { data: session } = useSession()
  const [showForm, setShowForm] = useState(false)
  const [editingApplication, setEditingApplication] = useState<JobApplication | null>(null)
  const [showColumnConfig, setShowColumnConfig] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<string>('')
  const pageSize = 25

  const {
    data: applications,
    isLoading,
    error,
    refetch
  } = useJobApplications(session?.userId, currentPage, pageSize, statusFilter || undefined)

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value)
    setCurrentPage(1)
  }

  const handleAddApplication = () => {
    setEditingApplication(null)
    setShowForm(true)
  }

  const handleEditApplication = (application: JobApplication) => {
    setEditingApplication(application)
    setShowForm(true)
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingApplication(null)
    refetch()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error loading applications. Please try again.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Job Applications</h1>
        <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
          <select
            value={statusFilter}
            onChange={(e) => handleStatusFilterChange(e.target.value)}
            aria-label="Filter by status"
            className="border border-gray-300 rounded-md text-sm px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Statuses</option>
            {Object.values(ApplicationStatus).map((status) => (
              <option key={status} value={status}>
                {status.replace('_', ' ').toUpperCase()}
              </option>
            ))}
          </select>
          <button
            onClick={() => setShowColumnConfig(true)}
            className="btn-secondary text-sm"
          >
            Configure Columns
          </button>
          <button
            onClick={handleAddApplication}
            className="btn-primary text-sm"
          >
            Add Application
          </button>
        </div>
      </div>

      <JobApplicationTable
        applications={applications?.data || []}
        onEdit={handleEditApplication}
        totalCount={applications?.total || 0}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        pageSize={pageSize}
      />

      {showForm && (
        <JobApplicationForm
          application={editingApplication}
          onClose={handleFormClose}
          userId={session?.userId}
        />
      )}

      {showColumnConfig && (
        <ColumnConfiguration
          onClose={() => setShowColumnConfig(false)}
        />
      )}
    </div>
  )
}