// import { Link } from "react-router-dom";
// import AdminSectionPage from "../../../components/admin/AdminSectionPage";
// import axios from "axios";
// import { useEffect, useState } from "react";

// export default function Products() {
//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const fetchProducts = async () => {
//     try {
//       const { data } = await axios.get(
//         "http://localhost:3000/api/products"
//       );

//       // if (data.products) {
//         setItems(data.products);
//       // } else {
//       //   setItems(data);
//       // }
//     } catch (error) {
//       console.log(error);
//     } finally {
//       setLoading(false);
//     }
//   };
//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   return (
//     <AdminSectionPage
//       title="Products"
//       description="Manage all products."
//       badge="Catalog"
//     >
    

//       {loading ? (
//         <h2 className="text-center text-white">
//           Loading...
//         </h2>
//       ) : (
//       <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
//   {(items || []).map((item) => (
//     <div
//       key={item._id}
//       className="overflow-hidden rounded-xl bg-slate-900 shadow-lg"
//     >
//       <img
//         src={
//           item.images?.length
//             ? `http://localhost:3000${item.images[0]}`
//             : "https://via.placeholder.com/400x300?text=No+Image"
//         }
//         alt={item.name}
//         className="h-60 w-full object-cover"
//       />

//       <div className="space-y-2 p-4">
//         <h3 className="text-lg font-bold text-white">
//           {item.name}
//         </h3>

//         <p className="text-gray-400">
//           {item.category}
//         </p>

//         <p className="text-sm text-gray-300">
//           {item.shortDescription}
//         </p>

//         <div className="flex justify-between">
//           <span className="font-bold text-emerald-400">
//             ₹{item.sellingPrice}
//           </span>

//           <span className="text-white">
//             Stock : {item.stock}
//           </span>
//         </div>

//         <div className="mt-4 flex gap-2">
//           <button className="flex-1 rounded bg-blue-600 py-2 text-white">
//             Edit
//           </button>

//           <button className="flex-1 rounded bg-red-600 py-2 text-white">
//             Delete
//           </button>
//         </div>
//       </div>
//     </div>
//   ))}
// </div>
//       )}
//     </AdminSectionPage>
//   );
// }