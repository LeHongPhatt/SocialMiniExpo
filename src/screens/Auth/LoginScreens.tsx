import { Image, View } from "react-native";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { globalStyles } from "../../styles/globalStyles";
import { Images } from "../../assets/images";
import {
  ButtonCus,
  ContainerCus,
  InputCus,
  RowCus,
  SectionCus,
  SpaceCus,
  TextCus,
} from "../../components";
import { appColors } from "../../constants/appColors";
import { FontAwesome } from "@expo/vector-icons";
import { LoadingModal } from "../../Modal";
import SocialLogin from "./components/SocialLogin";

import authenticationAPI from "../../apis/authApi";
import { Validate } from "../../utils/validate";
import { addAuth } from "../../redux/reduces/authReducer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { clearProfile, fetchProfile } from "../../redux/reduces/profileReducer";

const LoginScreens = ({ navigation }: any) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [isDisable, setIsDisable] = React.useState(true);
  const [errorMessage, setErrorMessage] = React.useState<any>();
  const dispatch = useDispatch();
  useEffect(() => {
    const emailValidation = Validate.email(email);

    if (!email || !password || !emailValidation) {
      setIsDisable(true);
    } else {
      setIsDisable(false);
    }
  }, [email, password]);
  const handleLogin = async () => {
    const emailValidation = Validate.email(email);
    if (emailValidation) {
      setIsLoading(true);
      try {
        const res = await authenticationAPI.HandleAuthentication(
          "/login",
          {
            email,
            password,
          },
          "post"
        );
        setIsLoading(false);
        await AsyncStorage.setItem("auth", JSON.stringify(res.data));
        dispatch(addAuth(res.data));
        dispatch(clearProfile()); // reset profile cũ
        dispatch(fetchProfile()); // fetch profile mới
        console.log("✅ Login success", res);
      } catch (err: any) {
        setErrorMessage(err.response?.data || err.message);
        console.log("❌ Login failed", err.response?.data || err.message);

        setIsLoading(false);
      }
    }
  };
  return (
    <ContainerCus isScroll>
      <SectionCus styles={[globalStyles.alCenter, { marginTop: 40 }]}>
        <Image
          source={Images.textLogo}
          style={{
            resizeMode: "contain",
            alignItems: "center",
          }}
        />
      </SectionCus>

      <SectionCus>
        <TextCus
          styles={{ textAlign: "center" }}
          size={34}
          text="Login"
          title
        />
        <SpaceCus height={21} />
        <InputCus
          value={email}
          placeholder="Email"
          onChange={(val) => {
            setEmail(val);
          }}
          allowClear
          affix={
            <FontAwesome name="envelope-o" size={22} color={appColors.gray} />
          }
        />

        <SpaceCus height={8} />

        <InputCus
          isPassword
          value={password}
          placeholder="Password"
          onChange={(val) => {
            setPassword(val);
          }}
          allowClear
          affix={<FontAwesome name="lock" size={22} color={appColors.gray} />}
        />
        {errorMessage && (
          <TextCus
            text={errorMessage.message || "Đăng nhập thất bại"}
            color={appColors.danger}
          />
        )}
      </SectionCus>
      <ButtonCus onPress={handleLogin} text="Sign In" type="primary" />
      <SectionCus
        styles={[globalStyles.row, { justifyContent: "space-between" }]}
      >
        <View />
        <ButtonCus
          onPress={() => navigation.navigate("ForgotPassword")}
          type="text"
          text="Forgot Password ?"
        />
      </SectionCus>
      <SocialLogin />
      <SectionCus>
        <RowCus justify="center">
          <TextCus text="Don’t have an account? " />
          <ButtonCus
            type="link"
            text="Sign up"
            onPress={() => navigation.navigate("RegisterScreens")}
          />
        </RowCus>
      </SectionCus>
      <LoadingModal visible={isLoading} />
    </ContainerCus>
  );
};

export default LoginScreens;
