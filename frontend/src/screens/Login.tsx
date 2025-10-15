import React from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useLogin } from "../hooks/useLogin";
const sha1 = require("js-sha1");

const Login: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { mutate: login, isPending, isError, error } = useLogin();

    const handleLogin = ({ email, password }: { email: string; password: string }) => {
        login({ email, password: sha1(password) }, { onSuccess: (response) => { navigate("/city/" + response.cityId) } });
    };

    const validationSchema = Yup.object({
        email: Yup.string()
            .email(t("validation.invalidEmail"))
            .max(100, t("validation.max", { max: 100 }))
            .required(t("validation.required")),
        password: Yup.string()
            .max(100, t("validation.max100"))
            .required(t("validation.required")),
    });

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
            <div className="bg-white shadow-md rounded-2xl p-8 w-full max-w-sm text-center">
                <h1 className="text-2xl font-semibold mb-6">{t("login.title")}</h1>

                <Formik
                    initialValues={{ email: "", password: "" }}
                    validationSchema={validationSchema}
                    onSubmit={(values, { setSubmitting }) => {
                        handleLogin(values);
                        setSubmitting(false);
                    }}
                >
                    {({ isSubmitting }) => (
                        <Form className="space-y-4 w-full">
                            <div>
                                <Field
                                    type="email"
                                    name="email"
                                    placeholder={t("login.emailPlaceholder") || ""}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <ErrorMessage
                                    name="email"
                                    component="div"
                                    className="text-red-500 text-sm mt-1"
                                />
                            </div>

                            <div>
                                <Field
                                    type="password"
                                    name="password"
                                    placeholder={t("login.passwordPlaceholder") || ""}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <ErrorMessage
                                    name="password"
                                    component="div"
                                    className="text-red-500 text-sm mt-1"
                                />
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-blue-600 text-white rounded-lg py-2 font-medium hover:bg-blue-700 transition"
                                >
                                    {t("login.submit")}
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>

                <div className="mt-4 text-sm text-gray-600">
                    {t("login.noAccount")}{" "}
                    <Link
                        to="/register"
                        className="text-blue-600 hover:underline font-medium"
                    >
                        {t("login.createAccount")}
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;