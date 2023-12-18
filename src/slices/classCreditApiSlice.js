import { CLASS_CREDIT_URL } from '../constants';
import { apiSlice } from './apiSlice';

const searchRequest = {
  filters: [
    {
      key: "status",
      operator: "EQUAL",
      fieldType: "STRING",
      value: "INACTIVE",
      valueTo: {},
      values: [{}],
    },
  ],
};

export const ClassCreditsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getClassCredits: builder.query({ 
      query: (search ) => ({
        url: `${CLASS_CREDIT_URL}/retrieve`,
        method: 'POST', 
        body: search
        // params: { keyword, pageNumber },
      }),
      // keepUnusedDataFor: 5,
      invalidatesTags: ['Lecturers'],
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
    retrieveCC: builder.mutation({
      query: (data) => ({
        url: `${CLASS_CREDIT_URL}/retrieve`,
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
    phanCong: builder.mutation({
      query: (data) => ({
        url: `${CLASS_CREDIT_URL}/phan-cong`,
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
  useRetrieveCCMutation,
  useDeleteClassCreditsMutation,
  usePhanCongMutation,
  useGetTopProductsQuery,
  useGetInvalidProductsQuery,
  useGetFilterQuery,
} = ClassCreditsApiSlice;
