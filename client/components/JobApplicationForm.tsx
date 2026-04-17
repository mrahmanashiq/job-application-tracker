import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import DatePicker from 'react-datepicker'
import Select from 'react-select'
import CreatableSelect from 'react-select/creatable'
import { XMarkIcon } from '@heroicons/react/24/outline'
import axios from 'axios'
import {
  JobApplication,
  ApplicationStatus,
  WorkType,
  JobType,
  InterviewType,
  QuestionCategory,
  QuestionDifficulty,
  InterviewQuestion
} from '../types/jobApplication'
import { useCreateJobApplication, useUpdateJobApplication } from '../hooks/useJobApplications'
import "react-datepicker/dist/react-datepicker.css"

interface JobApplicationFormProps {
  application?: JobApplication | null
  onClose: () => void
  userId?: string
}

interface FormData extends Omit<JobApplication, '_id' | 'createdAt' | 'updatedAt'> {}

export default function JobApplicationForm({ application, onClose, userId }: JobApplicationFormProps) {
  const [interviewQuestions, setInterviewQuestions] = useState<InterviewQuestion[]>(
    application?.interviewQuestions || []
  )
  const [submitError, setSubmitError] = useState<string | null>(null)

  const createMutation = useCreateJobApplication()
  const updateMutation = useUpdateJobApplication()
  
  const { register, handleSubmit, control, formState: { errors }, reset } = useForm<FormData>({
    defaultValues: {
      userId: userId || '',
      companyName: application?.companyName || '',
      jobTitle: application?.jobTitle || '',
      jobDescription: application?.jobDescription || '',
      applicationStatus: application?.applicationStatus || ApplicationStatus.APPLIED,
      applicationDate: application?.applicationDate || new Date(),
      resumeUsed: application?.resumeUsed || '',
      jobUrl: application?.jobUrl || '',
      salary: application?.salary || '',
      location: application?.location || '',
      techStack: application?.techStack || [],
      workType: application?.workType || WorkType.REMOTE,
      jobType: application?.jobType || JobType.FULL_TIME,
      contactPerson: application?.contactPerson || '',
      contactEmail: application?.contactEmail || '',
      notes: application?.notes || '',
      interviewDate: application?.interviewDate,
      interviewType: application?.interviewType,
      responseDate: application?.responseDate,
      rejectionReason: application?.rejectionReason || '',
      followUpDate: application?.followUpDate,
    }
  })

  const statusOptions = Object.values(ApplicationStatus).map(status => ({
    value: status,
    label: status.replace('_', ' ').toUpperCase()
  }))

  const workTypeOptions = Object.values(WorkType).map(type => ({
    value: type,
    label: type.charAt(0).toUpperCase() + type.slice(1)
  }))

  const jobTypeOptions = Object.values(JobType).map(type => ({
    value: type,
    label: type.replace('_', ' ').toUpperCase()
  }))

  const interviewTypeOptions = Object.values(InterviewType).map(type => ({
    value: type,
    label: type.charAt(0).toUpperCase() + type.slice(1)
  }))

  const questionCategoryOptions = Object.values(QuestionCategory).map(category => ({
    value: category,
    label: category.replace('_', ' ').toUpperCase()
  }))

  const questionDifficultyOptions = Object.values(QuestionDifficulty).map(difficulty => ({
    value: difficulty,
    label: difficulty.charAt(0).toUpperCase() + difficulty.slice(1)
  }))

  const addInterviewQuestion = () => {
    setInterviewQuestions([
      ...interviewQuestions,
      {
        question: '',
        answer: '',
        category: QuestionCategory.TECHNICAL,
        difficulty: QuestionDifficulty.MEDIUM,
        leetcodeLink: ''
      }
    ])
  }

  const updateInterviewQuestion = (index: number, field: keyof InterviewQuestion, value: any) => {
    const updated = [...interviewQuestions]
    updated[index] = { ...updated[index], [field]: value }
    setInterviewQuestions(updated)
  }

  const removeInterviewQuestion = (index: number) => {
    setInterviewQuestions(interviewQuestions.filter((_, i) => i !== index))
  }

  const onSubmit = async (data: FormData) => {
    setSubmitError(null)
    try {
      const formData = {
        ...data,
        interviewQuestions,
        userId: userId!
      }

      if (application?._id) {
        await updateMutation.mutateAsync({ id: application._id, ...formData })
      } else {
        await createMutation.mutateAsync(formData)
      }

      onClose()
    } catch (error) {
      let message = 'Unable to save application. Please try again.'
      if (axios.isAxiosError(error)) {
        const data = error.response?.data as { message?: string | string[] } | undefined
        if (Array.isArray(data?.message)) message = data!.message.join('; ')
        else if (typeof data?.message === 'string') message = data!.message
        else if (error.message) message = error.message
      }
      setSubmitError(message)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {application ? 'Edit Application' : 'Add New Application'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {submitError && (
            <div
              role="alert"
              className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800"
            >
              {submitError}
            </div>
          )}
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Company Name *</label>
              <input
                {...register('companyName', { required: 'Company name is required' })}
                className="form-input"
                placeholder="e.g., Google, Microsoft"
              />
              {errors.companyName && (
                <p className="mt-1 text-sm text-red-600">{errors.companyName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Job Title *</label>
              <input
                {...register('jobTitle', { required: 'Job title is required' })}
                className="form-input"
                placeholder="e.g., Software Engineer, Frontend Developer"
              />
              {errors.jobTitle && (
                <p className="mt-1 text-sm text-red-600">{errors.jobTitle.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Application Status *</label>
              <Controller
                name="applicationStatus"
                control={control}
                rules={{ required: 'Status is required' }}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={statusOptions}
                    value={statusOptions.find(option => option.value === field.value)}
                    onChange={(selected) => field.onChange(selected?.value)}
                    className="mt-1"
                  />
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Application Date *</label>
              <Controller
                name="applicationDate"
                control={control}
                rules={{ required: 'Application date is required' }}
                render={({ field }) => (
                  <DatePicker
                    selected={field.value ? new Date(field.value) : null}
                    onChange={(date: Date | null) => field.onChange(date)}
                    className="form-input"
                    dateFormat="MMM dd, yyyy"
                  />
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Resume Used</label>
              <input
                {...register('resumeUsed')}
                className="form-input"
                placeholder="e.g., Software Engineer Resume v2.1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Job URL</label>
              <input
                {...register('jobUrl')}
                type="url"
                className="form-input"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Salary</label>
              <input
                {...register('salary')}
                className="form-input"
                placeholder="e.g., $80,000 - $120,000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                {...register('location')}
                className="form-input"
                placeholder="e.g., San Francisco, CA"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Work Type</label>
              <Controller
                name="workType"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={workTypeOptions}
                    value={workTypeOptions.find(option => option.value === field.value)}
                    onChange={(selected) => field.onChange(selected?.value)}
                    className="mt-1"
                  />
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Job Type</label>
              <Controller
                name="jobType"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={jobTypeOptions}
                    value={jobTypeOptions.find(option => option.value === field.value)}
                    onChange={(selected) => field.onChange(selected?.value)}
                    className="mt-1"
                  />
                )}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Tech Stack</label>
              <Controller
                name="techStack"
                control={control}
                render={({ field }) => (
                  <CreatableSelect<{ value: string; label: string }, true>
                    isMulti
                    value={(field.value || []).map((tech: string) => ({ value: tech, label: tech }))}
                    onChange={(selected) =>
                      field.onChange(selected.map(option => option.value))
                    }
                    className="mt-1"
                    placeholder="Type a technology and press Enter (e.g., React, Node.js, PostgreSQL)"
                  />
                )}
              />
            </div>
          </div>

          {/* Job Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Job Description</label>
            <textarea
              {...register('jobDescription')}
              rows={4}
              className="form-input"
              placeholder="Paste the job description here..."
            />
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Contact Person</label>
              <input
                {...register('contactPerson')}
                className="form-input"
                placeholder="e.g., John Smith, HR Manager"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Contact Email</label>
              <input
                {...register('contactEmail')}
                type="email"
                className="form-input"
                placeholder="e.g., john.smith@company.com"
              />
            </div>
          </div>

          {/* Interview Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Interview Date</label>
              <Controller
                name="interviewDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    selected={field.value ? new Date(field.value) : null}
                    onChange={(date: Date | null) => field.onChange(date)}
                    className="form-input"
                    dateFormat="MMM dd, yyyy HH:mm"
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                  />
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Interview Type</label>
              <Controller
                name="interviewType"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={interviewTypeOptions}
                    value={interviewTypeOptions.find(option => option.value === field.value)}
                    onChange={(selected) => field.onChange(selected?.value)}
                    className="mt-1"
                    isClearable
                  />
                )}
              />
            </div>
          </div>

          {/* Interview Questions */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700">Interview Questions</label>
              <button
                type="button"
                onClick={addInterviewQuestion}
                className="btn-secondary text-sm"
              >
                Add Question
              </button>
            </div>

            {interviewQuestions.map((question, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4 space-y-4">
                <div className="flex justify-between items-start">
                  <h4 className="text-sm font-medium text-gray-700">Question {index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeInterviewQuestion(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600">Category</label>
                    <Select
                      value={questionCategoryOptions.find(option => option.value === question.category)}
                      onChange={(selected) => updateInterviewQuestion(index, 'category', selected?.value)}
                      options={questionCategoryOptions}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600">Difficulty</label>
                    <Select
                      value={questionDifficultyOptions.find(option => option.value === question.difficulty)}
                      onChange={(selected) => updateInterviewQuestion(index, 'difficulty', selected?.value)}
                      options={questionDifficultyOptions}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600">Question</label>
                  <textarea
                    value={question.question}
                    onChange={(e) => updateInterviewQuestion(index, 'question', e.target.value)}
                    className="form-input"
                    rows={2}
                    placeholder="Enter the interview question..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600">Your Answer</label>
                  <textarea
                    value={question.answer || ''}
                    onChange={(e) => updateInterviewQuestion(index, 'answer', e.target.value)}
                    className="form-input"
                    rows={3}
                    placeholder="Enter your answer..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600">LeetCode Link</label>
                  <input
                    type="url"
                    value={question.leetcodeLink || ''}
                    onChange={(e) => updateInterviewQuestion(index, 'leetcodeLink', e.target.value)}
                    className="form-input"
                    placeholder="https://leetcode.com/problems/..."
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Additional Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Response Date</label>
              <Controller
                name="responseDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    selected={field.value ? new Date(field.value) : null}
                    onChange={(date: Date | null) => field.onChange(date)}
                    className="form-input"
                    dateFormat="MMM dd, yyyy"
                  />
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Follow-up Date</label>
              <Controller
                name="followUpDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    selected={field.value ? new Date(field.value) : null}
                    onChange={(date: Date | null) => field.onChange(date)}
                    className="form-input"
                    dateFormat="MMM dd, yyyy"
                  />
                )}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Rejection Reason</label>
            <textarea
              {...register('rejectionReason')}
              rows={2}
              className="form-input"
              placeholder="If rejected, what was the reason given?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Notes</label>
            <textarea
              {...register('notes')}
              rows={4}
              className="form-input"
              placeholder="Any additional notes about this application..."
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={createMutation.isLoading || updateMutation.isLoading}
            >
              {createMutation.isLoading || updateMutation.isLoading ? 'Saving...' : 'Save Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}