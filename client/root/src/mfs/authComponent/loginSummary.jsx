//DON'T delete this code.
// Reference to import independent module from 1 MF to another MF but not good approach 
// as it create dependency on another MF.

// import React, { useState, useEffect, Suspense } from "react";
// import { loadRemoteMF } from "../../loadRemoteMF";

// const LoginSummary = () => {
//     const [LoginSummaryComponent, setLoginSummaryComponent] = useState(null);

//     const openLogin = async () => {
//         if (!LoginSummaryComponent) {
//             const RemoteLogin = await loadRemoteMF(
//                 "http://localhost:8081/remoteEntry.js",
//                 "auth",
//                 "./loginSummary",
//             );
//             setLoginSummaryComponent(() => RemoteLogin.default); // ✅ set as component
//         }
//     };
//     useEffect(() => {
//         openLogin();
//     }, []);

//     return (
//         <div>
//             {LoginSummaryComponent && (
//                 <Suspense fallback={<div>Loading Modal...</div>}>
//                     <LoginSummaryComponent />
//                 </Suspense>
//             )}
//         </div>
//     );
// };

// export default LoginSummary;
