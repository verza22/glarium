import React from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useRegister } from "../hooks/useRegister";
const sha1 = require("js-sha1");

const Register: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { mutate: register, isPending, isError, error } = useRegister();

    const handleRegister = ({ name, email, password }: { name:string, email: string; password: string }) => {
        register({ name, email, password: sha1(password) }, { onSuccess: (response) => { navigate("/city/" + response.cityId) } });
    };

    const validationSchema = Yup.object({
        name: Yup.string()
            .max(100, t("validation.max", { max: 100 }))
            .required(t("validation.required")),
        email: Yup.string()
            .email(t("validation.invalidEmail"))
            .max(100, t("validation.max", { max: 100 }))
            .required(t("validation.required")),
        password: Yup.string()
            .max(100, t("validation.max", { max: 100 }))
            .required(t("validation.required")),
        password_confirmation: Yup.string()
            .oneOf([Yup.ref("password")], t("validation.passwordsNotMatch"))
            .required(t("validation.required")),
    });

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
            <div className="bg-white shadow-md rounded-2xl p-8 w-full max-w-sm text-center">
                <h1 className="text-2xl font-semibold mb-6">{t("register.title")}</h1>

                <Formik
                    initialValues={{ name: "", email: "", password: "", password_confirmation: "" }}
                    validationSchema={validationSchema}
                    onSubmit={(values, { setSubmitting }) => {
                        handleRegister(values);
                        setSubmitting(false);
                    }}
                >
                    {({ isSubmitting }) => (
                        <Form className="space-y-4 w-full">
                            <div>
                                <Field
                                    type="text"
                                    name="name"
                                    placeholder={t("register.namePlaceholder") || ""}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <ErrorMessage
                                    name="name"
                                    component="div"
                                    className="text-red-500 text-sm mt-1"
                                />
                            </div>

                            <div>
                                <Field
                                    type="email"
                                    name="email"
                                    placeholder={t("register.emailPlaceholder") || ""}
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
                                    placeholder={t("register.passwordPlaceholder") || ""}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <ErrorMessage
                                    name="password"
                                    component="div"
                                    className="text-red-500 text-sm mt-1"
                                />
                            </div>

                            <div>
                                <Field
                                    type="password"
                                    name="password_confirmation"
                                    placeholder={t("register.passwordConfirmPlaceholder") || ""}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <ErrorMessage
                                    name="password_confirmation"
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
                                    {t("register.submit")}
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>

                <div className="mt-4 text-sm text-gray-600">
                    {t("register.alreadyAccount")}{" "}
                    <Link
                        to="/"
                        className="text-blue-600 hover:underline font-medium"
                    >
                        {t("register.login")}
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;