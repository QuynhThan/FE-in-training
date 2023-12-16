import { LECTURERS_URL } from '../constants';
import { apiSlice } from './apiSlice';

const searchRequest = {};

export const LecturersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLecturers: builder.query({ 
      query: ( search ) => ({
        url: `${LECTURERS_URL}/retrieve`,
        method: 'POST', 
        body: search
        // params: { keyword, pageNumber },
      }),
      // keepUnusedDataFor: 5,
      providesTags: ['Lecturers'],
    }),
    getLecturersDetails: builder.query({
      query: (productId) => ({
        url: `${LECTURERS_URL}/retrieve/${productId}`,
      }),
      keepUnusedDataFor: 5,
    }),
    createLecturers: builder.mutation({
      query: (data) => ({
        url: `${LECTURERS_URL}/add`,
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['Lecturers'],
    }),
    updateLecturers: builder.mutation({
      query: (data) => ({
        url: `${LECTURERS_URL}/update`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Lecturers'],
    }),
    uploadLecturersImage: builder.mutation({
      query: (data) => ({
        url: `${LECTURERS_URL}/update-image`,
        method: 'POST',
        body: data,
      }),
    }),
    deleteLecturers: builder.mutation({
      query: (subject) => ({
        url: `${LECTURERS_URL}/delete`,
        method: 'POST',
        body: subject
      }),
      providesTags: ['Lecturers'],
    }),
    createReview: builder.mutation({
      query: (data) => ({
        url: `${LECTURERS_URL}/${data.productId}/reviews`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Lecturers'],
    }),
    getTopProducts: builder.query({
      query: () => `${LECTURERS_URL}/top`, 
      keepUnusedDataFor: 5,
    }),
    getInvalidProducts: builder.query({
      query: ({ keyword, pageNumber, field }) => ({
        url: `${LECTURERS_URL}/retrieve`,
        params: { keyword, pageNumber, field },
      }),
      keepUnusedDataFor: 5,
      providesTags: ['Lecturers'],
    }),
    getFilter: builder.query({
      query: () => `${LECTURERS_URL}/filters`,
    }),
  }),
});

export const {
  useGetLecturersQuery,
  useGetLecturersDetailsQuery,
  useCreateLecturersMutation,
  useUpdateLecturersMutation,
  useUploadLecturersImageMutation,
  useDeleteLecturersMutation,
  useCreateReviewMutation,
  useGetTopProductsQuery,
  useGetInvalidProductsQuery,
  useGetFilterQuery,
} = LecturersApiSlice;
