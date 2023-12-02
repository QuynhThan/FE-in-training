import { CLASS_CREDIT_URL } from '../constants';
import { apiSlice } from './apiSlice';

const searchRequest = {};

export const LecturersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getClassCredits: builder.query({ 
      query: ({ search }) => ({
        url: `${CLASS_CREDIT_URL}/retrieve`,
        method: 'POST', 
        body: search
        // params: { keyword, pageNumber },
      }),
      // keepUnusedDataFor: 5,
      providesTags: ['Lecturers'],
    }),
    getClassCreditsDetails: builder.query({
      query: (productId) => ({
        url: `${CLASS_CREDIT_URL}/retrieve/${productId}`,
      }),
      keepUnusedDataFor: 5,
    }),
    createClassCredits: builder.mutation({
      query: (data) => ({
        url: `${CLASS_CREDIT_URL}/add`,
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['Lecturers'],
    }),
    updateClassCredits: builder.mutation({
      query: (data) => ({
        url: `${CLASS_CREDIT_URL}/update`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Lecturers'],
    }),
    uploadClassCreditsImage: builder.mutation({
      query: (data) => ({
        url: `${CLASS_CREDIT_URL}/update-image`,
        method: 'POST',
        body: data,
      }),
    }),
    deleteClassCredits: builder.mutation({
      query: (subject) => ({
        url: `${CLASS_CREDIT_URL}/delete`,
        method: 'POST',
        body: subject
      }),
      providesTags: ['Lecturers'],
    }),
    createReview: builder.mutation({
      query: (data) => ({
        url: `${CLASS_CREDIT_URL}/${data.productId}/reviews`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Lecturers'],
    }),
    getTopProducts: builder.query({
      query: () => `${CLASS_CREDIT_URL}/top`, 
      keepUnusedDataFor: 5,
    }),
    getInvalidProducts: builder.query({
      query: ({ keyword, pageNumber, field }) => ({
        url: `${CLASS_CREDIT_URL}/retrieve`,
        params: { keyword, pageNumber, field },
      }),
      keepUnusedDataFor: 5,
      providesTags: ['Lecturers'],
    }),
    getFilter: builder.query({
      query: () => `${CLASS_CREDIT_URL}/filters`,
    }),
  }),
});

export const {
  useGetClassCreditsQuery,
  useGetClassCreditsDetailsQuery,
  useCreateClassCreditsMutation,
  useUpdateClassCreditsMutation,
  useUploadClassCreditsImageMutation,
  useDeleteClassCreditsMutation,
  useCreateReviewMutation,
  useGetTopProductsQuery,
  useGetInvalidProductsQuery,
  useGetFilterQuery,
} = LecturersApiSlice;
