import { Input } from "./ui/Input";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useState } from "react";
import { BACKEND_URL } from "../../config.ts";
import { Button } from "./ui/Button.tsx";
import { useNavigate } from "react-router-dom";
const validationSchema = Yup.object({
  name: Yup.string()
    .min(3, "Username must be at least 3 characters long")
    .required("Username is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters long")
    .matches(/[A-Z]/, "Password must contain at least one capital letter")
    .matches(/[\W_]/, "Password must contain at least one special character")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),
});

const otpValidationSchema = Yup.object({
  otp: Yup.string()
    .length(6, "OTP must be 6 digits")
    .required("OTP is required"),
});
export const Signup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [showOtp, setShowOtp] = useState(false);
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      otp: "",
    },
    validationSchema: showOtp ? otpValidationSchema : validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        if (!showOtp) {
          const response = await axios.post(BACKEND_URL + "/api/v1/signup", {
            name: values.name,
            email: values.email,
            password: values.password,
          });
          if (response.status === 200) {
            setShowOtp(true);
          }
        } else {
          const response = await axios.post(
            BACKEND_URL + "/api/v1/verify-otp",
            {
              email: values.email,
              otp: values.otp,
            },
          );
          if (response.status === 200) {
            const token = response.data.token;
            localStorage.setItem(token, token);
            navigate("/dashboard");
          }
        }
      } catch (e: unknown) {
        if (axios.isAxiosError(e)) {
          console.error("Full error:", e);
          console.error("Response data:", e.response?.data);
          console.error("Status code:", e.response?.status);
          if (e.response) {
            alert(e.response.data.error);
          } else {
            alert("Something went wrong. Please try again.");
          }
        }
      } finally {
        setIsLoading(false);
      }
    },
  });
  return (
    <div className="flex h-screen">
      <div className="md:w-[60%] w-full flex flex-col">
        <div className="flex pt-4 pl-4 gap-1">
          <img src="/icon.png" />
          <p className="text-2xl font-bold">HD</p>
        </div>
        <div className="flex flex-1 flex-col justify-center items-center">
          <div>
            <h1 className="sm:text-3xl text-2xl pb-2 font-bold">Sign up</h1>
            <p className="text-gray-400 pb-6">
              Sign up to enjoy the feature of HD
            </p>
            <form
              onSubmit={formik.handleSubmit}
              className="flex flex-col items-center space-y-3"
            >
              <Input
                placeholder=""
                label="Your Name"
                inputId="name"
                name="name"
                disabled={showOtp}
                required={true}
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-red-500 text-sm">{formik.errors.name}</p>
              )}
              <Input
                placeholder=""
                label="Email"
                name="email"
                inputId="email"
                required={true}
                disabled={showOtp}
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-500 text-sm">{formik.errors.email}</p>
              )}
              <Input
                placeholder=""
                label="Password"
                name="password"
                disabled={showOtp}
                inputId="password"
                required={true}
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.password && formik.errors.password && (
                <p className="text-red-500 text-sm">{formik.errors.password}</p>
              )}

              <Input
                placeholder=""
                label="ConfirmPassword"
                inputId="confirmPassword"
                name="confirmPassword"
                disabled={showOtp}
                required={true}
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.confirmPassword &&
                formik.errors.confirmPassword && (
                  <p className="text-red-500 text-sm">
                    {formik.errors.confirmPassword}
                  </p>
                )}

              {showOtp && (
                <Input
                  placeholder=""
                  label="OTP"
                  inputId="otp"
                  name="otp"
                  required={true}
                  value={formik.values.otp}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              )}
              {formik.touched.otp && formik.errors.otp && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.otp}</p>
              )}

              <Button
                text={
                  showOtp
                    ? isLoading
                      ? "Signing Up..."
                      : "Sign Up"
                    : "Get OTP"
                }
                type="submit"
                size="lg"
                loading={isLoading}
              />
            </form>
            <div className="pt-4">
              <p className="text-text text-center">
                Already Have an account?
                <span
                  className="text-blue-600 underline font-semibold hover:cursor-pointer"
                  onClick={() => {
                    navigate("/signin");
                  }}
                >
                  Sign in
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="w-[40%] md:block hidden">
        <img src="/right-column.png" className="w-full h-screen" />
      </div>
    </div>
  );
};
