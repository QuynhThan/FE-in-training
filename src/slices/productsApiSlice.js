import { PRODUCTS_URL } from '../constants';
import { apiSlice } from './apiSlice';

export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({ 
      query: ({ keyword, pageNumber }) => ({
        url: `${PRODUCTS_URL}/retrieve-all`, 
        // params: { keyword, pageNumber },
      }),
      keepUnusedDataFor: 5,
      providesTags: ['Products'],
    }),
    getProductDetails: builder.query({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/retrieve/${productId}`,
      }),
      keepUnusedDataFor: 5,
    }),
    createProduct: builder.mutation({
      query: (data) => ({
        url: `${PRODUCTS_URL}/add`,
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['Product'],
    }),
    updateProduct: builder.mutation({
      query: (data) => ({
        url: `${PRODUCTS_URL}/update`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Products'],
    }),
    uploadProductImage: builder.mutation({
      query: (data) => ({
        url: `${PRODUCTS_URL}/update-image`,
        method: 'POST',
        body: data,
      }),
    }),
    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/delete/${productId}`,
        method: 'POST',
      }),
      providesTags: ['Product'],
    }),
    createReview: builder.mutation({
      query: (data) => ({
        url: `${PRODUCTS_URL}/${data.productId}/reviews`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Product'],
    }),
    getTopProducts: builder.query({
      query: () => `${PRODUCTS_URL}/top`, 
      keepUnusedDataFor: 5,
    }),
    getInvalidProducts: builder.query({
      query: ({ keyword, pageNumber, field }) => ({
        url: `${PRODUCTS_URL}/retrieve`,
        params: { keyword, pageNumber, field },
      }),
      keepUnusedDataFor: 5,
      providesTags: ['Products'],
    }),
    getFilter: builder.query({
      query: () => `${PRODUCTS_URL}/filters`,
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductDetailsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useUploadProductImageMutation,
  useDeleteProductMutation,
  useCreateReviewMutation,
  useGetTopProductsQuery,
  useGetInvalidProductsQuery,
  useGetFilterQuery,
} = productsApiSlice;
