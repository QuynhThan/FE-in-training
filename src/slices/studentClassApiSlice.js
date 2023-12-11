import { STUDENT_CLASS } from '../constants';
import { apiSlice } from './apiSlice';

const searchRequest = {};

export const StudentClassApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStudentClass: builder.query({ 
      query: ({ search }) => ({
        url: `${STUDENT_CLASS}/retrieve`,
        method: 'POST', 
        body: search
        // params: { keyword, pageNumber },
      }),
      // keepUnusedDataFor: 5,
      providesTags: ['StudentClass'],
    }),
    getProductDetails: builder.query({
      query: (productId) => ({
        url: `${STUDENT_CLASS}/retrieve/${productId}`,
      }),
      keepUnusedDataFor: 5,
    }),
    createProduct: builder.mutation({
      query: (data) => ({
        url: `${STUDENT_CLASS}/add`,
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['Subject'],
    }),
    updateProduct: builder.mutation({
      query: (data) => ({
        url: `${STUDENT_CLASS}/update`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Products'],
    }),
    uploadProductImage: builder.mutation({
      query: (data) => ({
        url: `${STUDENT_CLASS}/update-image`,
        method: 'POST',
        body: data,
      }),
    }),
    deleteProduct: builder.mutation({
      query: (subject) => ({
        url: `${STUDENT_CLASS}/delete`,
        method: 'POST',
        body: subject
      }),
      providesTags: ['Product'],
    }),
    createReview: builder.mutation({
      query: (data) => ({
        url: `${STUDENT_CLASS}/${data.productId}/reviews`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Product'],
    }),
    getTopProducts: builder.query({
      query: () => `${STUDENT_CLASS}/top`, 
      keepUnusedDataFor: 5,
    }),
    getInvalidProducts: builder.query({
      query: ({ keyword, pageNumber, field }) => ({
        url: `${STUDENT_CLASS}/retrieve`,
        params: { keyword, pageNumber, field },
      }),
      keepUnusedDataFor: 5,
      providesTags: ['Products'],
    }),
    getFilter: builder.query({
      query: () => `${STUDENT_CLASS}/filters`,
    }),
  }),
});

export const {
  useGetStudentClassQuery,
  useGetProductDetailsQuery,
  useCreateProductMutation: useCreateSubjectMutation,
  useUpdateProductMutation: useUpdateSubjectMutation,
  useUploadProductImageMutation,
  useDeleteProductMutation: useDeleteSubjectMutation,
  useCreateReviewMutation,
  useGetTopProductsQuery,
  useGetInvalidProductsQuery,
  useGetFilterQuery,
} = StudentClassApiSlice;
