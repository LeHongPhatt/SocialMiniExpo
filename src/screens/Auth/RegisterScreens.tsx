import { Image, StyleSheet, Text, View } from "react-native";
import React, { use, useEffect } from "react";
import {
  ButtonCus,
  ContainerCus,
  InputCus,
  RowCus,
  SectionCus,
  SpaceCus,
  TextCus,
} from "../../components";
import { Images } from "../../assets/images";
import SocialLogin from "./components/SocialLogin";
import { LoadingModal } from "../../Modal";
import { Validate } from "../../utils/validate";
import axios from "axios";
import authenticationAPI from "../../apis/authApi";
import { appColors } from "../../constants/appColors";

const initValue = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const RegisterScreens = ({ navigation }: any) => {
  const [values, setValues] = React.useState(initValue);
  const [errorMessage, setErrorMessage] = React.useState<any>();
  const [isDisable, setIsDisable] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);

  useEffect(() => {
    if (
      !errorMessage ||
      (errorMessage &&
        (errorMessage.email ||
          errorMessage.password ||
          errorMessage.confirmPassword)) ||
      !values.email ||
      !values.password ||
      !values.confirmPassword
    ) {
      setIsDisable(true);
    } else {
      setIsDisable(false);
    }
  }, [errorMessage, values]);
  const formValidator = (key: string) => {
    const data = { ...errorMessage };
    let message = ``;

    switch (key) {
      case "email":
        if (!values.email) {
          message = `Email is required!!!`;
        } else if (!Validate.email(values.email)) {
          message = "Email is not invalid!!";
        } else {
          message = "";
        }

        break;

      case "password":
        message = !values.password ? `Password is required!!!` : "";
        break;

      case "confirmPassword":
        if (!values.confirmPassword) {
          message = `Please type confirm password!!`;
        } else if (values.confirmPassword !== values.password) {
          message = "Password is not match!!!";
        } else {
          message = "";
        }

        break;
    }

    data[`${key}`] = message;

    setErrorMessage(data);
  };

  const handleRegister = async () => {
    setIsLoading(true);
    try {
      const res = await authenticationAPI.HandleAuthentication(
        "/register",
        {
          username: values.username,
          email: values.email,
          password: values.password,
          confirmPassword: values.confirmPassword,
        },
        "post"
      );
      {
        if (res.status === 201) navigation.navigate("LoginScreens");
      }
      console.log("✅ Register success", res);
    } catch (err: any) {
      console.log("❌ Register failed", err.response?.data || err.message);
    } finally {
      setIsLoading(false); // luôn tắt loading dù thành công hay thất bại
    }
  };

  const handleChangeValue = (key: string, value: string) => {
    console.log(`✏️ Change field: ${key} = ${value}`);
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <>
      <ContainerCus isScroll back>
        <SectionCus>
          <TextCus text="Register" title size={24} />
          <SpaceCus height={21} />
          <InputCus
            allowClear
            value={values.username}
            onChange={(val) => handleChangeValue("username", val)}
            placeholder="username"
            onEnd={() => formValidator("username")}
          />
          <InputCus
            allowClear
            value={values.email}
            onChange={(val) => handleChangeValue("email", val)}
            placeholder="email"
            onEnd={() => formValidator("email")}
          />
          <InputCus
            isPassword
            allowClear
            value={values.password}
            onChange={(val) => handleChangeValue("password", val)}
            placeholder="pássword"
            onEnd={() => formValidator("password")}
          />
          <InputCus
            isPassword
            allowClear
            value={values.confirmPassword}
            onChange={(val) => handleChangeValue("confirmPassword", val)}
            placeholder="confirm password"
            onEnd={() => formValidator("confirmPassword")}
          />
        </SectionCus>
        {errorMessage && (
          <SectionCus>
            {Object.keys(errorMessage).map(
              (error, index) =>
                errorMessage[`${error}`] && (
                  <TextCus
                    text={errorMessage[`${error}`]}
                    key={`error${index}`}
                    color={appColors.danger}
                  />
                )
            )}
          </SectionCus>
        )}

        <ButtonCus
          disable={isDisable}
          type="primary"
          text="Sign In"
          onPress={handleRegister}
        />
        <SocialLogin />
        <SectionCus>
          <RowCus justify="center">
            <TextCus text="Don’t have an account? " />
            <ButtonCus
              type="link"
              text="Sign in"
              onPress={() => navigation.navigate("LoginScreens")}
            />
          </RowCus>
        </SectionCus>
      </ContainerCus>
      <LoadingModal visible={isLoading} />
    </>
  );
};

export default RegisterScreens;

const styles = StyleSheet.create({});
