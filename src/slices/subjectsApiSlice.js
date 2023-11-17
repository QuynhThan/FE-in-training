import { SUBJECTS_URL } from '../constants';
import { apiSlice } from './apiSlice';

const searchRequest = {};

export const SubjectsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSubjects: builder.query({ 
      query: ({ search }) => ({
        url: `${SUBJECTS_URL}/retrieve`,
        method: 'POST', 
        body: search
        // params: { keyword, pageNumber },
      }),
      // keepUnusedDataFor: 5,
      providesTags: ['Subjects'],
    }),
    getProductDetails: builder.query({
      query: (productId) => ({
        url: `${SUBJECTS_URL}/retrieve/${productId}`,
      }),
      keepUnusedDataFor: 5,
    }),
    createProduct: builder.mutation({
      query: (data) => ({
        url: `${SUBJECTS_URL}/add`,
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['Subject'],
    }),
    updateProduct: builder.mutation({
      query: (data) => ({
        url: `${SUBJECTS_URL}/update`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Products'],
    }),
    uploadProductImage: builder.mutation({
      query: (data) => ({
        url: `${SUBJECTS_URL}/update-image`,
        method: 'POST',
        body: data,
      }),
    }),
    deleteProduct: builder.mutation({
      query: (subject) => ({
        url: `${SUBJECTS_URL}/delete`,
        method: 'POST',
        body: subject
      }),
      providesTags: ['Product'],
    }),
    createReview: builder.mutation({
      query: (data) => ({
        url: `${SUBJECTS_URL}/${data.productId}/reviews`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Product'],
    }),
    getTopProducts: builder.query({
      query: () => `${SUBJECTS_URL}/top`, 
      keepUnusedDataFor: 5,
    }),
    getInvalidProducts: builder.query({
      query: ({ keyword, pageNumber, field }) => ({
        url: `${SUBJECTS_URL}/retrieve`,
        params: { keyword, pageNumber, field },
      }),
      keepUnusedDataFor: 5,
      providesTags: ['Products'],
    }),
    getFilter: builder.query({
      query: () => `${SUBJECTS_URL}/filters`,
    }),
  }),
});

export const {
  useGetSubjectsQuery,
  useGetProductDetailsQuery,
  useCreateProductMutation: useCreateSubjectMutation,
  useUpdateProductMutation,
  useUploadProductImageMutation,
  useDeleteProductMutation: useDeleteSubjectMutation,
  useCreateReviewMutation,
  useGetTopProductsQuery,
  useGetInvalidProductsQuery,
  useGetFilterQuery,
} = SubjectsApiSlice;
