export const validatePassKeyCreation = (clientData) => {
  const clientDataValidation = validateClientData(clientData);
  switch (clientDataValidation.valid) {
    case true:
      return clientDataValidation.challenge;
    case false:
      return null;
  }
};

const validateClientData = (clientData) => {
  // @ts-ignore
  // Gather the Client Data
  console.log("✅  Gathered Client Data: ", clientData);
  if (clientData.origin !== window.location.origin) {
    console.log("❌  Origin does not match!");
    return {
      valid: false,
      challenge: null,
    };
  } else if (clientData.type !== "webauthn.create") {
    console.log("❌  Type does not match webauthn.create");
    return {
      valid: false,
      challenge: null,
    };
  }
  console.log("✅  Client Data is Valid");
  return {
    valid: true,
    challenge: clientData.challenge,
  };
};
