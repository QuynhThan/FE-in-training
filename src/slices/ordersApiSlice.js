import { apiSlice } from './apiSlice';
import { ORDERS_URL, PAYPAL_URL } from '../constants';
import { LOCALHOST } from '../constants';

export const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (order) => ({
        url: `${LOCALHOST}/order/create`,
        method: 'POST',
        body: order,
      }),
    }),
    getOrderDetails: builder.query({
      query: (id) => ({
        url: `${LOCALHOST}/order/order-detais/${id}`,
      }),
      keepUnusedDataFor: 5,
    }),
    payOrder: builder.mutation({
      query: ({ orderId, details }) => ({
        url: `${ORDERS_URL}/${orderId}/pay`,
        method: 'PUT',
        body: details,
      }),
    }),
    getPaypalClientId: builder.query({
      query: () => ({
        url: PAYPAL_URL,
      }),
      keepUnusedDataFor: 5,
    }),
    getMyOrders: builder.query({
      query: (userId) => ({
        url: `${LOCALHOST}/order/my-order/${userId}`,
      }),
      keepUnusedDataFor: 5,
    }),
    getOrders: builder.query({
      query: () => ({
        url: `${LOCALHOST}/order/retrieve`,
      }),
      keepUnusedDataFor: 5,
    }),
    deliverOrder: builder.mutation({
      query: (data) => ({
        url: `${LOCALHOST}/order/update`,
        body: data,
        method: 'POST',
      }),
    }),
    rejectOrder: builder.mutation({
      query: (orderId) => ({
        url: `${LOCALHOST}/order/update/${orderId}`,
        body: "Rejected",
        method: 'POST',
      }),
    }),
    completeOrder: builder.mutation({
      query: (orderId) => ({
        url: `${LOCALHOST}/order/update/${orderId}`,
        body: "Completed",
        method: 'POST',
      }),
    }),
    getReceiptOrder: builder.mutation({
      query: (orderId) => ({
        url: `${LOCALHOST}/order/receipt/${orderId}`,
        method: 'POST',
      }),
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useGetPaypalClientIdQuery,
  useGetMyOrdersQuery,
  useGetOrdersQuery,
  useDeliverOrderMutation,
  useRejectOrderMutation,
  useCompleteOrderMutation,
  useGetReceiptOrderMutation,
} = orderApiSlice;
