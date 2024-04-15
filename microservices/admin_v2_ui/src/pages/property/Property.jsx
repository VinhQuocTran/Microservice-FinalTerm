// import { useEffect, useState } from "react";
// import BasicTable from "../../components/basicTable/BasicTable";
// import './property.scss';
// import axios from "axios";

// const Property = () => {
//   const [properties, setProperties] = useState([]);
//   const columns = [
//     {
//       header: 'ID',
//       accessorKey: 'id'
//     },
//     {
//       header: 'Verified',
//       accessorKey: 'isVerified',
//     },
//     {
//       header: 'Listed',
//       accessorKey: 'isListed',
//     },    
//   ];

//   useEffect(() => {
//     const fetchProperties = async () => {
//       const response = await axios.
//     };
//   }, []);

//   return (
//     <section className='property-wrapper'>
//       <div className='flexColCenter innerWidth paddings property-container'>
//         <BasicTable data={currentOrders || <Skeleton count={10} />} columns={columns} />
//       </div>
//     </section>
//   )
// }

// export default Property