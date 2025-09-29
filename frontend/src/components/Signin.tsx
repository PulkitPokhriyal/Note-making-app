import { Input } from "./ui/Input";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useState } from "react";
import { BACKEND_URL } from "../../config.ts";
import { Button } from "./ui/Button.tsx";
import { useNavigate } from "react-router-dom";

const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});
export const Signin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const response = await axios.post(
          BACKEND_URL + "/api/v1/signin",
          values,
        );
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        navigate("/dashboard", { replace: true });
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
            <h1 className="sm:text-3xl text-2xl pb-2 font-bold">Sign in</h1>
            <p className="text-gray-400 pb-6">
              Please log in to continue to your account
            </p>
            <form
              onSubmit={formik.handleSubmit}
              className="flex flex-col items-center space-y-3"
            >
              <Input
                placeholder=""
                label="Email"
                name="email"
                inputId="email"
                required={true}
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
                inputId="password"
                required={true}
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.password && formik.errors.password && (
                <p className="text-red-500 text-sm">{formik.errors.password}</p>
              )}

              <Button
                text={isLoading ? "Signing in..." : "Sign in"}
                type="submit"
                loading={isLoading}
                size="lg"
              />
            </form>
            <div className="pt-4">
              <p className="text-text text-center">
                Need an account?
                <span
                  className="text-blue-600 underline font-semibold hover:cursor-pointer"
                  onClick={() => {
                    navigate("/signup");
                  }}
                >
                  Create one
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
