import { CLASSROOM_URL } from '../constants';
import { apiSlice } from './apiSlice';

const searchRequest = {};

export const LecturersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getClassrooms: builder.query({ 
      query: ({ search }) => ({
        url: `${CLASSROOM_URL}/retrieve`,
        method: 'POST', 
        body: search
        // params: { keyword, pageNumber },
      }),
      // keepUnusedDataFor: 5,
      providesTags: ['Lecturers'],
    }),
    getClassroomsDetails: builder.query({
      query: (productId) => ({
        url: `${CLASSROOM_URL}/retrieve/${productId}`,
      }),
      keepUnusedDataFor: 5,
    }),
    createClassrooms: builder.mutation({
      query: (data) => ({
        url: `${CLASSROOM_URL}/add`,
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['Lecturers'],
    }),
    updateClassrooms: builder.mutation({
      query: (data) => ({
        url: `${CLASSROOM_URL}/update`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Lecturers'],
    }),
    uploadClassroomsImage: builder.mutation({
      query: (data) => ({
        url: `${CLASSROOM_URL}/update-image`,
        method: 'POST',
        body: data,
      }),
    }),
    deleteClassrooms: builder.mutation({
      query: (subject) => ({
        url: `${CLASSROOM_URL}/delete`,
        method: 'POST',
        body: subject
      }),
      providesTags: ['Lecturers'],
    }),
    createReview: builder.mutation({
      query: (data) => ({
        url: `${CLASSROOM_URL}/${data.productId}/reviews`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Lecturers'],
    }),
    getTopProducts: builder.query({
      query: () => `${CLASSROOM_URL}/top`, 
      keepUnusedDataFor: 5,
    }),
    getInvalidProducts: builder.query({
      query: ({ keyword, pageNumber, field }) => ({
        url: `${CLASSROOM_URL}/retrieve`,
        params: { keyword, pageNumber, field },
      }),
      keepUnusedDataFor: 5,
      providesTags: ['Lecturers'],
    }),
    getFilter: builder.query({
      query: () => `${CLASSROOM_URL}/filters`,
    }),
  }),
});

export const {
  useGetClassroomsQuery,
  useGetClassroomsDetailsQuery,
  useCreateClassroomsMutation,
  useUpdateClassroomsMutation,
  useUploadLecturersImageMutation,
  useDeleteClassroomsMutation,
  useCreateReviewMutation,
  useGetTopProductsQuery,
  useGetInvalidProductsQuery,
  useGetFilterQuery,
} = LecturersApiSlice;
