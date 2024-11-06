import { useDispatch, useSelector } from "react-redux";
import OrdersStats from "./OrdersStatistics";
import { useEffect } from "react";
import { fetchOrdersAction } from "../../../redux/slice/order/orderSlice";
import ErrorMsg from "../../ErrorMsg/ErrorMsg";
import LoadingComponent from "../../LoadingComp/LoadingComponent";
import NoDataFound from "../../NoDataFound/NoDataFound";
import { Link } from "react-router-dom";

const people = [
  {
    name: "Lindsay Walton",
    title: "Front-end Developer",
    email: "lindsay.walton@example.com",
    role: "Member",
  },
  // More people...
];

export default function OrdersList() {
  const dispatch = useDispatch()

  useEffect(()=>{
    dispatch(fetchOrdersAction())
  },[dispatch])
  const {error, loading, orders} = useSelector(state=> state?.orders)
  // console.log(orders);

  
  return (
    <>
    {error && <ErrorMsg message={error?.message}/>}
      <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center"></div>
      {/* order stats */}
      <OrdersStats />

      <h3 className="text-lg font-medium leading-6 text-gray-900 mt-3">
        Recent Oders
      </h3>
      <div className="-mx-4 mt-3  overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:-mx-6 md:mx-0 md:rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                Order ID
              </th>
              <th
                scope="col"
                className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell">
                Payment Status
              </th>
              <th
                scope="col"
                className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell">
                Oder Date
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Delivery Date
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Status
              </th>

              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Total
              </th>
              {/* <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span className="sr-only">Edit</span>
              </th> */}
            </tr>
          </thead>
          {loading ? <LoadingComponent/>: orders?.length <= 0 ? <NoDataFound/> : <tbody className="divide-y divide-gray-200 bg-white">
            {orders?.orders.map((order) => (
              <tr key={order._id}>
                <td className="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-6">
                  {order._id}
                  <dl className="font-normal lg:hidden">
                    <dd className="mt-1 truncate text-gray-700">
                      {order.paymentMethod}
                    </dd>
                    
                    <dd className="mt-1 truncate text-gray-500 sm:hidden">
                      {order.email}
                    </dd>
                  </dl>
                </td>
                <td className="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">
                  {order?.paymentStatus === 'Not paid' ? <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-600 text-gray-300">
                    {order?.paymentStatus}
                    </span> :<span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-600 text-gray-300">
                    {order?.paymentStatus}
                    </span>}
                </td>
                <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="px-3 py-4 text-sm text-gray-500">
                  'Not Specified'
                </td>
                <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">
                  {order?.status}
                </td>
                <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">
                  {order.totalPrice}
                </td>
                <td className="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                 {
                  order?.paymentStatus !== 'Not paid' ?  (<Link
                    style={{cursor:"not-allowed"}}
                  className="text-gray-300 hover:text-indigo-100">
                    Edit
                  </Link>) : (<Link
                  to={`/admin/orders/${order?._id}`} className="text-indigo-600 hover:text-indigo-900">
                    Edit
                  </Link>)
                 }
                </td>
              </tr>
            ))}
          </tbody>}
        </table>
      </div>
    </div>
    </>
  );
}
