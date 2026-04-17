import { useState, useEffect } from 'react'
import { Column } from '../types/jobApplication'

const DEFAULT_COLUMNS: Column[] = [
  { key: 'companyName', label: 'Company', visible: true, required: true, width: 150 },
  { key: 'jobTitle', label: 'Job Title', visible: true, required: true, width: 200 },
  { key: 'applicationStatus', label: 'Status', visible: true, required: true, width: 120 },
  { key: 'applicationDate', label: 'Applied Date', visible: true, required: true, width: 120 },
  { key: 'responseDate', label: 'Response Date', visible: true, required: false, width: 120 },
  { key: 'interviewDate', label: 'Interview Date', visible: true, required: false, width: 120 },
  { key: 'salary', label: 'Salary', visible: true, required: false, width: 100 },
  { key: 'location', label: 'Location', visible: true, required: false, width: 120 },
  { key: 'techStack', label: 'Tech Stack', visible: true, required: false, width: 200 },
  { key: 'workType', label: 'Work Type', visible: false, required: false, width: 100 },
  { key: 'resumeUsed', label: 'Resume Used', visible: false, required: false, width: 120 },
]

export const useColumnConfiguration = () => {
  const [columns, setColumns] = useState<Column[]>(DEFAULT_COLUMNS)

  useEffect(() => {
    const savedColumns = localStorage.getItem('jobTracker_columnConfig')
    if (savedColumns) {
      try {
        const parsedColumns: Column[] = JSON.parse(savedColumns)
        const savedKeys = new Set(parsedColumns.map(c => c.key))
        const missing = DEFAULT_COLUMNS.filter(c => !savedKeys.has(c.key))
        setColumns([...parsedColumns, ...missing])
      } catch (error) {
        console.error('Error parsing column configuration:', error)
        setColumns(DEFAULT_COLUMNS)
      }
    }
  }, [])

  const updateColumns = (newColumns: Column[]) => {
    setColumns(newColumns)
    localStorage.setItem('jobTracker_columnConfig', JSON.stringify(newColumns))
  }

  const resetColumns = () => {
    setColumns(DEFAULT_COLUMNS)
    localStorage.removeItem('jobTracker_columnConfig')
  }

  const visibleColumns = columns.filter(col => col.visible)

  return {
    columns,
    visibleColumns,
    updateColumns,
    resetColumns,
  }
}