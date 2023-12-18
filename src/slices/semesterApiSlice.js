import { SEMESTER_URL } from '../constants';
import { apiSlice } from './apiSlice';

const searchRequest = {};

export const SubjectsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSemester: builder.query({ 
      query: (search) => ({
        url: `${SEMESTER_URL}/retrieve`,
        method: 'POST', 
        body: search
        // params: { keyword, pageNumber },
      }),
      // keepUnusedDataFor: 5,
      providesTags: ['Subjects'],
    }),
    getProductDetails: builder.query({
      query: (productId) => ({
        url: `${SEMESTER_URL}/retrieve/${productId}`,
      }),
      keepUnusedDataFor: 5,
    }),
    createProduct: builder.mutation({
      query: (data) => ({
        url: `${SEMESTER_URL}/add`,
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['Subject'],
    }),
    updateProduct: builder.mutation({
      query: (data) => ({
        url: `${SEMESTER_URL}/update`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Products'],
    }),
    uploadProductImage: builder.mutation({
      query: (data) => ({
        url: `${SEMESTER_URL}/update-image`,
        method: 'POST',
        body: data,
      }),
    }),
    deleteProduct: builder.mutation({
      query: (subject) => ({
        url: `${SEMESTER_URL}/delete`,
        method: 'POST',
        body: subject
      }),
      providesTags: ['Product'],
    }),
    createReview: builder.mutation({
      query: (data) => ({
        url: `${SEMESTER_URL}/${data.productId}/reviews`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Product'],
    }),
    getTopProducts: builder.query({
      query: () => `${SEMESTER_URL}/top`, 
      keepUnusedDataFor: 5,
    }),
    getInvalidProducts: builder.query({
      query: ({ keyword, pageNumber, field }) => ({
        url: `${SEMESTER_URL}/retrieve`,
        params: { keyword, pageNumber, field },
      }),
      keepUnusedDataFor: 5,
      providesTags: ['Products'],
    }),
    getFilter: builder.query({
      query: () => `${SEMESTER_URL}/filters`,
    }),
  }),
});

export const {
  useGetSemesterQuery,
  useGetProductDetailsQuery,
  useCreateProductMutation: useCreateSubjectMutation,
  useUpdateProductMutation: useUpdateSubjectMutation,
  useUploadProductImageMutation,
  useDeleteProductMutation: useDeleteSubjectMutation,
  useCreateReviewMutation,
  useGetTopProductsQuery,
  useGetInvalidProductsQuery,
  useGetFilterQuery,
} = SubjectsApiSlice;
