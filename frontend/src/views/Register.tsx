import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const Register: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
      <div className="bg-white shadow-md rounded-2xl p-8 w-full max-w-sm text-center">
        <h1 className="text-2xl font-semibold mb-6">{t("register.title")}</h1>
        <form className="space-y-4 w-full">
          <div>
            <input
              type="text"
              name="name"
              placeholder={t("register.namePlaceholder") || ""}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <input
              type="email"
              name="email"
              placeholder={t("register.emailPlaceholder") || ""}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              placeholder={t("register.passwordPlaceholder") || ""}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <input
              type="password"
              name="password_confirmation"
              placeholder={t("register.passwordConfirmPlaceholder") || ""}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white rounded-lg py-2 font-medium hover:bg-blue-700 transition"
            >
              {t("register.submit")}
            </button>
          </div>
        </form>
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