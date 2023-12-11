import { TIMETABLE_SUBMIT } from '../constants';
import { apiSlice } from './apiSlice';

const searchRequest = {};

export const TimetableApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTimetables: builder.query({ 
      query: ({ search }) => ({
        url: `${TIMETABLE_SUBMIT}/submit`,
        method: 'POST', 
        body: search
        // params: { keyword, pageNumber },
      }),
      // keepUnusedDataFor: 5,
      providesTags: ['Lecturers'],
    }),
    getTimetablesDetails: builder.query({
      query: ({ search }) => ({
        url: `${TIMETABLE_SUBMIT}/retrieve`,
        method: 'POST', 
        body: search
        // params: { keyword, pageNumber },
      }),
      keepUnusedDataFor: 5,
    }),
    submitTimetable: builder.mutation({
      query: (data) => ({
        url: `${TIMETABLE_SUBMIT}/submit`,
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['Timetable'],
    }),
    updateClassCredits: builder.mutation({
      query: (data) => ({
        url: `${TIMETABLE_SUBMIT}/update`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Lecturers'],
    }),
    uploadClassCreditsImage: builder.mutation({
      query: (data) => ({
        url: `${TIMETABLE_SUBMIT}/update-image`,
        method: 'POST',
        body: data,
      }),
    }),
    deleteClassCredits: builder.mutation({
      query: (subject) => ({
        url: `${TIMETABLE_SUBMIT}/delete`,
        method: 'POST',
        body: subject
      }),
      providesTags: ['Lecturers'],
    }),
    save: builder.mutation({
      query: (data) => ({
        url: `${TIMETABLE_SUBMIT}/save`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Lecturers'],
    }),
    getTopProducts: builder.query({
      query: () => `${TIMETABLE_SUBMIT}/top`, 
      keepUnusedDataFor: 5,
    }),
    getInvalidProducts: builder.query({
      query: ({ keyword, pageNumber, field }) => ({
        url: `${TIMETABLE_SUBMIT}/retrieve`,
        params: { keyword, pageNumber, field },
      }),
      keepUnusedDataFor: 5,
      providesTags: ['Lecturers'],
    }),
    getFilter: builder.query({
      query: () => `${TIMETABLE_SUBMIT}/filters`,
    }),
  }),
});

export const {
  useGetTimetablesQuery,
  useGetTimetablesDetailsQuery,
  useSubmitTimetableMutation,
  useUpdateClassCreditsMutation,
  useUploadClassCreditsImageMutation,
  useDeleteClassCreditsMutation,
  useSaveMutation,
  useGetTopProductsQuery,
  useGetInvalidProductsQuery,
  useGetFilterQuery,
} = TimetableApiSlice;
