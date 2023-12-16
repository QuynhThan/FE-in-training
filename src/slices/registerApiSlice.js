import { ROOT_USER } from '../constants';
import { apiSlice } from './apiSlice';

const searchRequest = {};

export const SubjectsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getROOT_USERs: builder.query({ 
      query: ({ search }) => ({
        url: `${ROOT_USER}/retrieve`,
        method: 'POST', 
        body: search
        // params: { keyword, pageNumber },
      }),
      // keepUnusedDataFor: 5,
      providesTags: ['Subjects'],
    }),
    getProductDetails: builder.query({
      query: (productId) => ({
        url: `${ROOT_USER}/retrieve/${productId}`,
      }),
      keepUnusedDataFor: 5,
    }),
    registerSubmit: builder.mutation({
      query: (data) => ({
        url: `${ROOT_USER}/subject-register/submit`,
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['Subject'],
    }),
    updateProduct: builder.mutation({
      query: (data) => ({
        url: `${ROOT_USER}/update`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Products'],
    }),
    uploadProductImage: builder.mutation({
      query: (data) => ({
        url: `${ROOT_USER}/update-image`,
        method: 'POST',
        body: data,
      }),
    }),
    deleteProduct: builder.mutation({
      query: (subject) => ({
        url: `${ROOT_USER}/delete`,
        method: 'POST',
        body: subject
      }),
      providesTags: ['Product'],
    }),
    createReview: builder.mutation({
      query: (data) => ({
        url: `${ROOT_USER}/${data.productId}/reviews`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Product'],
    }),
    getTopProducts: builder.query({
      query: () => `${ROOT_USER}/top`, 
      keepUnusedDataFor: 5,
    }),
    getInvalidProducts: builder.query({
      query: ({ keyword, pageNumber, field }) => ({
        url: `${ROOT_USER}/retrieve`,
        params: { keyword, pageNumber, field },
      }),
      keepUnusedDataFor: 5,
      providesTags: ['Products'],
    }),
    getFilter: builder.query({
      query: () => `${ROOT_USER}/filters`,
    }),
  }),
});

export const {
  useGetROOT_USERsQuery,
  useGetProductDetailsQuery,
  useRegisterSubmitMutation,
  useUpdateProductMutation: useUpdateSubjectMutation,
  useUploadProductImageMutation,
  useDeleteProductMutation: useDeleteSubjectMutation,
  useCreateReviewMutation,
  useGetTopProductsQuery,
  useGetInvalidProductsQuery,
  useGetFilterQuery,
} = SubjectsApiSlice;
