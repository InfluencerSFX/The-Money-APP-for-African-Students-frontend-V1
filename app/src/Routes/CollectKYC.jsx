import React, { useEffect, useState } from "react";
import "@smile_identity/smart-camera-web";
import { AxiosType, postMethod } from "../api/axios";
import { useNavigate } from "react-router-dom";

function CollectKYC() {
  const searchParams = new URLSearchParams(document.location.search);
  const tier = searchParams.get("tier");

  const [bvn, setBvn] = useState("");
  const [dob, setDob] = useState(new Date().toISOString().split("T")[0]);
  const [phoneNumber, setPhoneNumber] = useState("");

  const countries =
    tier == 1
      ? [
          { value: "NG", label: "Nigeria" },
          { value: "TZ", label: "Tanzania" },
          { value: "GH", label: "Ghana" },
          { value: "CM", label: "Cameroon" },
          { value: "KE", label: "Kenya" },
          { value: "RW", label: "Rwanda" },
          { value: "ZA", label: "South Africa" },
          { value: "UG", label: "Uganda" },
          { value: "ZM", label: "Zambia" },
        ]
      : [
          { value: "TR", label: "Turkey" },
          { value: "CY", label: "Cyprus" },
        ];
  const [countrySelected, setCountrySelected] = useState(countries[0].value);

  const [selected, setSelected] = useState(false);
  const ids =
    tier == 1
      ? [
          { value: "PASSPORT", label: "Passport" },
          countrySelected === "NG" ? { value: "BVN", label: "BVN" } : null,
        ].filter((id) => id !== null)
      : [
          { value: "DRIVERS_LICENSE", label: "Driving License" },
          { value: "RESIDENT_ID", label: "Residence Permit" },
          { value: "WORK_PERMIT", label: "Work Permit" },
        ];
  const [idSelected, setIdSelected] = useState(ids[0].value);

  const token = localStorage.getItem("token");
  const refreshToken = localStorage.getItem("refreshToken");
  const navigate = useNavigate();

  const handleImagesComputed = async (e) => {
    const result = await postMethod(
      "/kyc/verify-docs",
      {
        detail: e.detail,
        id_info: {
          country: countrySelected,
          id_type: idSelected,
        },
        tier: Number(tier),
      },
      AxiosType.Main,
      token,
      refreshToken
    );
    navigate("/account");
  };

  const verifyBvn = async () => {
    if (idSelected === "BVN") {
      if (!bvn.match("^[0-9]{11}$")) {
        alert("Invalid BVN Value");
        return;
      }
      if (!phoneNumber.match("^[0-9]{10}$")) {
        alert("Invalid Phone Number");
        return;
      }
      const result = await postMethod(
        "/kyc/verify-bvn",
        { id_number: bvn, dob, phone_number: phoneNumber },
        AxiosType.Main,
        token,
        refreshToken
      );
      navigate("/account");
    } else {
      setSelected(true);
    }
  };

  useEffect(() => {
    if (selected) {
      const app = document.querySelector("smart-camera-web");
      app.addEventListener("imagesComputed", handleImagesComputed);

      return () => {
        app.removeEventListener("imagesComputed", handleImagesComputed);
      };
    }
  }, [selected]);

  return selected ? (
    <main className="px-2 mobile-screen space-y-8 flex flex-col justify-center">
      <smart-camera-web
        capture-id
        document-capture-modes="camera,upload"
      ></smart-camera-web>
    </main>
  ) : (
    <main className="px-2 mobile-screen space-y-8 flex flex-col justify-center">
      <h3 className="font-bold">Select your country and ID type</h3>
      <div className="flex space-x-2">
        <select
          className="bg-black flex-1"
          onChange={(e) => setCountrySelected(e.target.value)}
        >
          {countries.map((country) => (
            <option key={country.label} value={country.value}>
              {country.label}
            </option>
          ))}
        </select>
        <select
          className="bg-black flex-1"
          onChange={(e) => setIdSelected(e.target.value)}
        >
          {ids.map((id) => (
            <option key={id.label} value={id.value}>
              {id.label}
            </option>
          ))}
        </select>
      </div>

      {idSelected === "BVN" && (
        <div className="space-y-2">
          <div className="grid grid-cols-1 space-y-2 md:grid-cols-2 md:space-y-0">
            <div className="form-style form-validation">
              <input
                type="string"
                className="rounded font-medium text-start bg-transparent placeholder:text-gray-600"
                value={bvn}
                pattern="^[0-9]{11}$"
                placeholder="BVN"
                onChange={(e) => setBvn(e.target.value)}
              />
            </div>
            <div className="form-style form-validation">
              <input
                type="string"
                className="rounded font-medium text-start bg-transparent placeholder:text-gray-600"
                value={phoneNumber}
                pattern="^[0-9]{10}$"
                placeholder="Phone number"
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
          </div>
          <div className="form-style form-validation flex-col flex">
            <label className="">Date of Birth</label>
            <input
              type="date"
              format="yyyy-mm-dd"
              className="text-white bg-green-500"
              value={dob}
              placeholder="DOB"
              onChange={(e) => setDob(e.target.value)}
            />
          </div>
        </div>
      )}
      <button onClick={() => verifyBvn()} className="bg-green-500">
        Continue
      </button>
    </main>
  );
}

export default CollectKYC;
