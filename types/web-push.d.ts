/* Déclaration minimale du module web-push (évite d'installer @types). */
declare module "web-push" {
  interface PushSubscriptionLike {
    endpoint: string;
    keys: { p256dh: string; auth: string };
  }
  interface SendResult {
    statusCode: number;
  }
  interface WebPushError extends Error {
    statusCode: number;
  }
  function setVapidDetails(
    subject: string,
    publicKey: string,
    privateKey: string
  ): void;
  function sendNotification(
    subscription: PushSubscriptionLike,
    payload?: string
  ): Promise<SendResult>;
  const webpush: {
    setVapidDetails: typeof setVapidDetails;
    sendNotification: typeof sendNotification;
  };
  export default webpush;
}
