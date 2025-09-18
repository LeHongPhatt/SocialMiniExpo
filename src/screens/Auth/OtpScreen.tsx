import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import {
  ButtonCus,
  ContainerCus,
  RowCus,
  SectionCus,
  SpaceCus,
  TextCus,
} from "../../components";
import { appColors } from "../../constants/appColors";
import { fontFamily } from "../../constants/fontFamily";
import authenticationAPI from "../../apis/authApi";
import { LoadingModal } from "../../Modal";

const OtpScreen = ({ route, navigation }: any) => {
  const { email } = route.params;

  const OTP_LENGTH = 4;
  const [codeValues, setCodeValues] = useState<string[]>(
    Array(OTP_LENGTH).fill("")
  );
  const [limit, setLimit] = useState(120);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  // ✅ Tạo mảng refs động
  const inputRefs = useRef<TextInput[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (limit > 0) {
      const timer = setInterval(() => setLimit((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [limit]);

  const handleChangeCode = (val: string, index: number) => {
    const data = [...codeValues];
    data[index] = val;
    setCodeValues(data);

    // Auto focus next input
    if (val && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleVerification = async () => {
    const newCode = codeValues.join(""); // ✅ Ghép thành chuỗi

    try {
      const res: any = await authenticationAPI.HandleAuthentication(
        "/verify-forgot-password-otp",
        { email, otp: newCode }, // ✅ đặt key đúng với BE
        "post"
      );
      navigation.navigate("ResetPasswordScreens", { email });
    } catch (error: any) {
      setErrorMessage(
        error?.response?.data?.message || "Xác minh OTP thất bại!"
      );
      console.log("VERIFY OTP FAILED:", error?.response?.data || error);
    }
  };

  const handleResendVerification = async () => {
    setCodeValues(Array(OTP_LENGTH).fill(""));
    setIsLoading(true);
    try {
      await authenticationAPI.HandleAuthentication(
        "/forgot-password",
        { email },
        "post"
      );
      setLimit(120);
    } catch (error: any) {
      setErrorMessage(
        error?.response?.data?.message || "Xác minh OTP thất bại!"
      );
      console.log("Không thể gửi lại OTP:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ContainerCus back isScroll>
      <SectionCus>
        <TextCus text="Nhập mã xác thực" title />
        <SpaceCus height={12} />
        <TextCus
          text={`Mã OTP đã gửi đến ${email.replace(/.{1,5}/, (m: any) =>
            "*".repeat(m.length)
          )}`}
        />
        <SpaceCus height={26} />

        {/* 🔑 Render OTP Input */}
        <RowCus justify="space-around">
          {Array.from({ length: OTP_LENGTH }).map((_, i) => (
            <TextInput
              key={i}
              ref={(el) => (inputRefs.current[i] = el!)}
              style={styles.input}
              keyboardType="number-pad"
              maxLength={1}
              value={codeValues[i]}
              onChangeText={(val) => handleChangeCode(val, i)}
              placeholder="-"
            />
          ))}
        </RowCus>
      </SectionCus>

      <SectionCus styles={{ marginTop: 40 }}>
        <ButtonCus
          disable={codeValues.join("").length !== OTP_LENGTH}
          onPress={handleVerification}
          text="Xác nhận OTP"
          type="primary"
        />
      </SectionCus>
      {errorMessage ? (
        <SectionCus>
          <TextCus
            styles={{ textAlign: "center" }}
            text={errorMessage}
            color={appColors.danger}
          />
        </SectionCus>
      ) : null}

      <SectionCus>
        {limit > 0 ? (
          <RowCus justify="center">
            <TextCus text="Gửi lại mã sau " flex={0} />
            <TextCus
              text={`${Math.floor(limit / 60)}:${String(limit % 60).padStart(
                2,
                "0"
              )}`}
              flex={0}
              color={appColors.link}
            />
          </RowCus>
        ) : (
          <ButtonCus
            type="link"
            text="Gửi lại OTP"
            onPress={handleResendVerification}
          />
        )}
      </SectionCus>

      <LoadingModal visible={isLoading} />
    </ContainerCus>
  );
};

export default OtpScreen;

const styles = StyleSheet.create({
  input: {
    height: 55,
    width: 55,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: appColors.gray2,
    fontSize: 24,
    fontFamily: fontFamily.raleway.medium,
    textAlign: "center",
  },
});
