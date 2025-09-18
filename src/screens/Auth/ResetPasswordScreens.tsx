import { Alert, Image, View } from "react-native";
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

const ResetPasswordScreens = ({ navigation, route }: any) => {
  const { email } = route.params;
  const [rs_email, setRs_Email] = React.useState(email);
  const [password, setPassword] = React.useState("");
  const [rsPassWord, setRsPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [err, setErr] = React.useState("");
  const dispatch = useDispatch();
  const handleChangePass = async () => {
    setIsLoading(true);
    try {
      const res = await authenticationAPI.HandleAuthentication(
        "/reset-password",
        {
          email: rs_email,
          newPassword: password, // hoặc dùng rsPassWord nếu đây là password nhập lại
          confirmPassword: rsPassWord,
        },
        "post"
      );
      setIsLoading(false);
      Alert.alert("Thành công", res?.message || "Đổi mật khẩu thành công!");
      navigation.navigate("LoginScreens");
    } catch (error) {
      setIsLoading(false);
      const message = error?.response?.data?.message;
      setErr(message);
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
          text="New Password"
          title
        />
        <SpaceCus height={21} />
        <InputCus
          value={email}
          placeholder="Email"
          onChange={(val) => {
            setRs_Email(val);
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
        <InputCus
          isPassword
          value={rsPassWord}
          placeholder=" new Password"
          onChange={(val) => {
            setRsPassword(val);
          }}
          allowClear
          affix={<FontAwesome name="lock" size={22} color={appColors.gray} />}
        />
      </SectionCus>
      {err ? <TextCus text={err} color={appColors.danger} /> : ""}
      <SpaceCus height={12} />
      <ButtonCus onPress={handleChangePass} text="Sign In" type="primary" />

      <LoadingModal visible={isLoading} />
    </ContainerCus>
  );
};

export default ResetPasswordScreens;
