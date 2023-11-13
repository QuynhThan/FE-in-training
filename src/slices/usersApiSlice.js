import { apiSlice } from './apiSlice';
import { USERS_URL } from '../constants';
import { LOCALHOST } from '../constants';

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${LOCALHOST}/v1/login`,
        method: 'POST',
        body: data,
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `${LOCALHOST}/v1/register`,
        method: 'POST',
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: (data) => ({
        url: `${LOCALHOST}/v1/log-out`,
        method: 'POST',
      }),
    }),
    profile: builder.mutation({
      query: (data) => ({
        url: `${LOCALHOST}/v1/update`,
        method: 'POST',
        body: data,
      }),
    }),
    getUsers: builder.query({
      query: () => ({
        url: USERS_URL,
      }),
      providesTags: ['User'],
      keepUnusedDataFor: 5,
    }),
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `${LOCALHOST}/${userId}`,
        method: 'DELETE',
      }),
    }),
    getUserDetails: builder.query({
      query: (id) => ({
        url: `${LOCALHOST}/${id}`,
      }),
      keepUnusedDataFor: 5,
    }),
    updateUser: builder.mutation({
      query: (data) => ({
        url: `${LOCALHOST}/v1/update`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    getShippingInfo: builder.query({
      query: (productCode) => ({
        url:`${LOCALHOST}/admin/account/user-address/${productCode}`,
        method: 'Get'
      })
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useProfileMutation,
  useGetUsersQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useGetUserDetailsQuery,
  useGetShippingInfoQuery,
} = userApiSlice;
