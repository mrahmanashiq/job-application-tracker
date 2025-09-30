import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { JobApplication, PaginatedResponse } from '../types/jobApplication'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001'

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
})

export const useJobApplications = (userId?: string, page = 1, limit = 25) => {
  return useQuery({
    queryKey: ['jobApplications', userId, page, limit],
    queryFn: async (): Promise<PaginatedResponse<JobApplication>> => {
      const { data } = await api.get(`/job-applications`, {
        params: { userId, page, limit }
      })
      return data
    },
    enabled: !!userId,
    keepPreviousData: true,
  })
}

export const useCreateJobApplication = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (application: Omit<JobApplication, '_id' | 'createdAt' | 'updatedAt'>) => {
      const { data } = await api.post('/job-applications', application)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobApplications'] })
    },
  })
}

export const useUpdateJobApplication = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, ...application }: JobApplication & { id: string }) => {
      const { data } = await api.put(`/job-applications/${id}`, application)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobApplications'] })
    },
  })
}

export const useDeleteJobApplication = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/job-applications/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobApplications'] })
    },
  })
}