import { motion } from "framer-motion";

const UserOrders = () => {

  const orders = [
    {
      id: "#1025",
      date: "20 Aug 2026",
      product: "Nike Air Max Shoes",
      amount: "₹4,999",
      status: "Delivered",
    },
    {
      id: "#1024",
      date: "18 Aug 2026",
      product: "Premium T-Shirt",
      amount: "₹1,999",
      status: "Shipped",
    },
    {
      id: "#1023",
      date: "15 Aug 2026",
      product: "Running Shoes",
      amount: "₹2,499",
      status: "Pending",
    },
    {
      id: "#1022",
      date: "12 Aug 2026",
      product: "Casual Shirt",
      amount: "₹999",
      status: "Delivered",
    },
  ];

  const getStatusStyle = (status) => {
    if (status === "Delivered") {
      return "bg-emerald-50 text-emerald-600";
    }

    if (status === "Shipped") {
      return "bg-blue-50 text-blue-600";
    }

    if (status === "Pending") {
      return "bg-yellow-50 text-yellow-700";
    }

    return "bg-slate-50 text-slate-600";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">
          My Orders
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          View and track all your orders.
        </p>
      </div>

      {/* Order Summary */}
      <div className="grid gap-4 sm:grid-cols-3">

        <OrderStat
          title="Total Orders"
          value="12"
          icon="📦"
        />

        <OrderStat
          title="Pending"
          value="2"
          icon="⏳"
        />

        <OrderStat
          title="Delivered"
          value="8"
          icon="✅"
        />

      </div>

      {/* Orders */}
      <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">

        <h2 className="mb-5 text-lg font-bold">
          Order History
        </h2>

        <div className="overflow-x-auto">

          <table className="w-full min-w-[800px]">

            <thead>
              <tr className="border-b border-slate-100 text-left text-sm text-slate-500">

                <th className="pb-4">
                  Order ID
                </th>

                <th className="pb-4">
                  Product
                </th>

                <th className="pb-4">
                  Date
                </th>

                <th className="pb-4">
                  Amount
                </th>

                <th className="pb-4">
                  Status
                </th>

                <th className="pb-4">
                  Action
                </th>

              </tr>
            </thead>

            <tbody>

              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-slate-50 text-sm last:border-0"
                >

                  <td className="py-4 font-semibold">
                    {order.id}
                  </td>

                  <td className="py-4">
                    {order.product}
                  </td>

                  <td className="py-4 text-slate-500">
                    {order.date}
                  </td>

                  <td className="py-4 font-semibold">
                    {order.amount}
                  </td>

                  <td className="py-4">

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>

                  </td>

                  <td className="py-4">

                    <button className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-100">
                      View
                    </button>

                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>

    </motion.div>
  );
};


const OrderStat = ({ title, value, icon }) => {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">

      <div className="flex items-center justify-between">

        <div>
          <p className="text-sm text-slate-500">
            {title}
          </p>

          <h3 className="mt-2 text-2xl font-bold">
            {value}
          </h3>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl">
          {icon}
        </div>

      </div>

    </div>
  );
};

export default UserOrders;