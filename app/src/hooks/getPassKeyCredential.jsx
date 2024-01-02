const getPasskeyCredential = async ({
  userId,
  username,
  displayName,
  // challengeBuffer,
  challenge,
  allowCredentials: credentials,
}) => {
  const allowCredentials = [];

  for (const cred of credentials) {
    allowCredentials.push({
      id: Uint8Array.from(cred.credentialId).buffer,
      type: "public-key",
      transports: cred.transports,
    });
  }
  const challengeBuffer = Uint8Array.from(challenge);
  const publicKeyCredentialRequestOptions = {
    challenge: challengeBuffer,
    rpId: import.meta.env.VITE_DOMAIN,
    userVerification: "preferred",
    timeout: 60000,
  };

  return await navigator.credentials.get({
    publicKey: publicKeyCredentialRequestOptions,
  });
};

export default getPasskeyCredential;
