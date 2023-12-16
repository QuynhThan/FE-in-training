import { FACULTY } from '../constants';
import { apiSlice } from './apiSlice';

const searchRequest = {};

export const SubjectsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getFacultys: builder.query({ 
      query: ({ search }) => ({
        url: `${FACULTY}/retrieve`,
        method: 'POST', 
        body: search
        // params: { keyword, pageNumber },
      }),
      // keepUnusedDataFor: 5,
      providesTags: ['Subjects'],
    }),
    getProductDetails: builder.query({
      query: (productId) => ({
        url: `${FACULTY}/retrieve/${productId}`,
      }),
      keepUnusedDataFor: 5,
    }),
    createProduct: builder.mutation({
      query: (data) => ({
        url: `${FACULTY}/add`,
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['Subject'],
    }),
    updateProduct: builder.mutation({
      query: (data) => ({
        url: `${FACULTY}/update`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Products'],
    }),
    uploadProductImage: builder.mutation({
      query: (data) => ({
        url: `${FACULTY}/update-image`,
        method: 'POST',
        body: data,
      }),
    }),
    deleteProduct: builder.mutation({
      query: (subject) => ({
        url: `${FACULTY}/delete`,
        method: 'POST',
        body: subject
      }),
      providesTags: ['Product'],
    }),
    createReview: builder.mutation({
      query: (data) => ({
        url: `${FACULTY}/${data.productId}/reviews`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Product'],
    }),
    getTopProducts: builder.query({
      query: () => `${FACULTY}/top`, 
      keepUnusedDataFor: 5,
    }),
    getInvalidProducts: builder.query({
      query: ({ keyword, pageNumber, field }) => ({
        url: `${FACULTY}/retrieve`,
        params: { keyword, pageNumber, field },
      }),
      keepUnusedDataFor: 5,
      providesTags: ['Products'],
    }),
    getFilter: builder.query({
      query: () => `${FACULTY}/filters`,
    }),
  }),
});

export const {
  useGetFacultysQuery,
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
