import { Ed25519PublicKey, Ed25519Signature } from '@aptos-labs/ts-sdk';

export const validateSignature = ({
  publicKey,
  signature,
  message,
}: {
  publicKey: string;
  signature: string;
  message: string;
}) => {
  return new Ed25519PublicKey(publicKey).verifySignature({
    message,
    signature: new Ed25519Signature(signature),
  });
};
