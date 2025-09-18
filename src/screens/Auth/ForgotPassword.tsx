import { View, Text, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import {
  ButtonCus,
  ContainerCus,
  InputCus,
  SectionCus,
  SpaceCus,
  TextCus,
} from "../../components";
import { appColors } from "../../constants/appColors";
import { Button } from "@react-navigation/elements";
import { LoadingModal } from "../../Modal";
import authenticationAPI from "../../apis/authApi";
import { Validate } from "../../utils/validate";

const ForgotPassword = ({ navigation }: any) => {
  const [email, setEmail] = useState("");
  const [isDisable, setIsDisable] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const handleCheckEmail = () => {
    const isValidEmail = Validate.email(email);
    setIsDisable(!isValidEmail);
  };
  const handleForgotPassword = async (data: any) => {
    console.log(email);
    // Check email in database
    try {
      const res = await authenticationAPI.HandleAuthentication(
        "/forgot-password",
        { email },
        "post"
      );
      Alert.alert("Thành công", res?.message);
      console.log(res);
      navigation.navigate("OtpScreen", { email: email });
      console.log(res);
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "Không thể gửi OTP. Vui lòng thử lại sau.";
      setErrorMessage(message);
      console.log(error);
    }
  };
  return (
    <ContainerCus back isScroll>
      <SectionCus>
        <TextCus text="Resset Password" title />
        <SpaceCus height={12} />
        <TextCus text="Please enter your email address to request a password reset" />
        <SpaceCus height={26} />
        <InputCus
          value={email}
          onChange={(val) => setEmail(val)}
          //   affix={<Sms size={20} color={appColors.gray} />}
          placeholder="abc@gmail.com"
          onEnd={handleCheckEmail}
        />
      </SectionCus>
      <SectionCus>
        {errorMessage ? (
          <TextCus
            styles={{ textAlign: "center" }}
            text={errorMessage} // ✅ bây giờ luôn là string, không còn object
            color={appColors.danger}
          />
        ) : null}
        <ButtonCus
          onPress={handleForgotPassword}
          disable={isDisable}
          text="Send"
          type="primary"
          //   icon={<ArrowRight size={20} color={appColors.white} />}
          iconFlex="right"
        />
      </SectionCus>
      <LoadingModal visible={isLoading} />
    </ContainerCus>
  );
};

export default ForgotPassword;
