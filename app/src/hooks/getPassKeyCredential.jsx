const getPasskeyCredential = async (challenge) => {
  const challengeBuffer = Uint8Array.from(challenge, (c) => c.charCodeAt(0));
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
