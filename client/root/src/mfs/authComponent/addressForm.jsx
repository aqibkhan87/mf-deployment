//DON'T delete this code.
// Reference to import independent module from 1 MF to another MF but not good approach 
// as it create dependency on another MF.

// import React, { useState, useEffect, Suspense } from "react";
// import { loadRemoteMF } from "../../loadRemoteMF";

// const AddressForm = () => {
//     const [AddressFormPopupComponent, setAddressFormPopupComponent] = useState(null);

//     const openAddressFormPopup = async () => {
//         if (!AddressFormPopupComponent) {
//             const RemoteAddressForm = await loadRemoteMF(
//                 "http://localhost:8081/remoteEntry.js",
//                 "auth",
//                 "./addressForm",
//             );
//             setAddressFormPopupComponent(() => RemoteAddressForm.default); // ✅ set as component
//         }
//     };

//     useEffect(() => {
//         openAddressFormPopup();
//     }, []);




//     return (
//         <div>
//             {AddressFormPopupComponent && (
//                 <Suspense fallback={<div>Loading Modal...</div>}>
//                     <AddressFormPopupComponent />
//                 </Suspense>
//             )}
//         </div>
//     );
// };

// export default AddressForm;
