import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { ButtonCus, SectionCus, SpaceCus, TextCus } from "../../../components";
import { appColors } from "../../../constants/appColors";
import { fontFamily } from "../../../constants/fontFamily";
import { LoadingModal } from "../../../Modal";

// GoogleSignin.configure({
//   webClientId:
//     '51183564123-pf81s6h2gnkmudbcnhe2j6ke2eapt6l1.apps.googleusercontent.com',
//   iosClientId:
//     '51183564123-ftijaqo23c9thm2kfe9ssgqq6p92ru72.apps.googleusercontent.com',
// });
// Settings.setAppID('684546690239906');

const SocialLogin = () => {
  const [isLoading, setIsLoading] = useState(false);

  //   const api = `/google-signin`;
  //   const dispatch = useDispatch();

  //   const handleLoginWithGoogle = async () => {
  //     await GoogleSignin.hasPlayServices({
  //       showPlayServicesUpdateDialog: true,
  //     });

  //     try {
  //       await GoogleSignin.hasPlayServices();
  //       const userInfo = await GoogleSignin.signIn();
  //       const user = userInfo.user;

  //       const res: any = await authenticationAPI.HandleAuthentication(
  //         api,
  //         user,
  //         'post',
  //       );

  //       dispatch(addAuth(res.data));

  //       await AsyncStorage.setItem('auth', JSON.stringify(res.data));
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  //   const handleLoginWithFacebook = async () => {
  //     try {
  //       const result = await LoginManager.logInWithPermissions([
  //         'public_profile',
  //       ]);

  //       if (result.isCancelled) {
  //         console.log('Login cancel');
  //       } else {
  //         const profile = await Profile.getCurrentProfile();

  //         if (profile) {
  //           setIsLoading(true);
  //           const data = {
  //             name: profile.name,
  //             givenName: profile.firstName,
  //             familyName: profile.lastName,
  //             email: profile.userID,
  //             photo: profile.imageURL,
  //           };

  //           const res: any = await authenticationAPI.HandleAuthentication(
  //             api,
  //             data,
  //             'post',
  //           );

  //           dispatch(addAuth(res.data));

  //           await AsyncStorage.setItem('auth', JSON.stringify(res.data));

  //           setIsLoading(false);
  //         }
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  return (
    <SectionCus>
      <TextCus
        styles={{ textAlign: "center" }}
        text="OR"
        color={appColors.gray4}
        size={16}
        font={fontFamily.quicksand.medium}
      />
      <SpaceCus height={16} />

      <ButtonCus
        type="primary"
        // onPress={handleLoginWithGoogle}
        color={appColors.white}
        textColor={appColors.text}
        text="Login with Google"
        textFont={fontFamily.quicksand.medium}
        iconFlex="left"
        // icon={<Google />}
      />

      <ButtonCus
        type="primary"
        color={appColors.white}
        textColor={appColors.text}
        text="Login with Facebook"
        textFont={fontFamily.quicksand.medium}
        // onPress={handleLoginWithFacebook}
        iconFlex="left"
        // icon={<Facebook />}
      />
      <LoadingModal visible={isLoading} />
    </SectionCus>
  );
};

export default SocialLogin;
