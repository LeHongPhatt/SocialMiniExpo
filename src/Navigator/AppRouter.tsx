// // import React, { useEffect, useState } from "react";
// // import AuthNavigator from "./AuthNavigator";
// // import { useSelector } from "react-redux";
// // import AsyncStorage from "@react-native-async-storage/async-storage";
// // import MainNavigator from "./MainNavigator";
// // import SplashScreen from "../screens/splashScreens";

// // const AppRouters = () => {
// //   const [isShowSplash, setIsShowSplash] = useState(true);
// //   const [isLogin, setIsLogin] = useState(false);
// //   useEffect(() => {
// //     const checkLogin = async () => {
// //       const auth = await AsyncStorage.getItem("auth");
// //       setIsLogin(!!auth);
// //     };
// //     checkLogin();
// //   }, []);
// //   useEffect(() => {
// //     // checkLogin();
// //     const timeout = setTimeout(() => {
// //       setIsShowSplash(false);
// //     }, 1500);

// //     return () => clearTimeout(timeout);
// //   }, []);

// //   return (
// //     <>
// //       {isShowSplash ? (
// //         <SplashScreen />
// //       ) : isLogin ? (
// //         <MainNavigator />
// //       ) : (
// //         <AuthNavigator />
// //       )}
// //     </>
// //   );
// // };

// // export default AppRouters;

// import React, { useEffect, useState } from "react";
// import AuthNavigator from "./AuthNavigator";
// import MainNavigator from "./MainNavigator";
// import SplashScreen from "../screens/splashScreens";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useSelector } from "react-redux";
// import { authSelector } from "../redux/reduces/authReducer";

// const AppRouters = () => {
//   const [isShowSplash, setIsShowSplash] = useState(true);
//   const [hasSeenIntro, setHasSeenIntro] = useState(false);
//   const [isLogin, setIsLogin] = useState(false);
//   const auth = useSelector(authSelector);
//   useEffect(() => {
//     const checkAppStatus = async () => {
//       try {
//         // Kiểm tra đã xem intro chưa
//         const intro = await AsyncStorage.getItem("hasSeenIntro");
//         setHasSeenIntro(!!intro);

//         // Kiểm tra login
//         const authData = await AsyncStorage.getItem("auth");
//         setIsLogin(!!authData);
//       } catch (error) {
//         console.log("Error checking app status:", error);
//       } finally {
//         setIsShowSplash(false); // tắt splash sau khi kiểm tra
//       }
//     };

//     checkAppStatus();
//   }, []);

//   if (isShowSplash) {
//     return <SplashScreen />;
//   }

//   // Nếu chưa xem intro → hiển thị IntroScreen
//   if (!hasSeenIntro) {
//     return <AuthNavigator initialRouteName="IntroScreens" />;
//   }

//   // Nếu đã xem intro
//   if (isLogin && auth?.accesstoken) {
//     return <MainNavigator />; // đã login → Home
//   }

//   // Nếu chưa login
//   return <AuthNavigator initialRouteName="LoginScreens" />;
// };

// export default AppRouters;

import React, { useEffect, useState } from "react";
import AuthNavigator from "./AuthNavigator";
import MainNavigator from "./MainNavigator";
import SplashScreen from "../screens/splashScreens";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { addAuth, authSelector } from "../redux/reduces/authReducer";

const AppRouters = () => {
 const [isShowSplash, setIsShowSplash] = useState(true);
  const [hasSeenIntro, setHasSeenIntro] = useState(false);

  const dispatch = useDispatch();
  const auth = useSelector(authSelector);

  useEffect(() => {
    const initApp = async () => {
      try {
        // 1. Kiểm tra intro
        const intro = await AsyncStorage.getItem("hasSeenIntro");
        setHasSeenIntro(!!intro);

        // 2. Lấy token từ AsyncStorage
        const authData = await AsyncStorage.getItem("auth");
        if (authData) {
          const parsedAuth = JSON.parse(authData);
          if (parsedAuth?.accesstoken) {
            dispatch(addAuth(parsedAuth));
          }
        }
      } catch (error) {
        console.log("Error init app:", error);
      } finally {
        setIsShowSplash(false);
      }
    };

    initApp();
  }, [dispatch]);

  if (isShowSplash) return <SplashScreen />;

  if (!hasSeenIntro) return <AuthNavigator initialRouteName="IntroScreens" />;

  return auth.accesstoken ? (
    <MainNavigator />
  ) : (
    <AuthNavigator initialRouteName="LoginScreens" />
  );
};

export default AppRouters;
