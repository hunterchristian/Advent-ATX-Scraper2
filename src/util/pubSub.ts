type SubscriptionHandler = (data: any) => void;

class PubSub {
  private pubSub: Record<string, SubscriptionHandler[]>;
  private static instance: PubSub;
  constructor() {
    if (PubSub.instance) {
      throw new Error('New instance cannot be created');
    }

    this.pubSub = {};
  }

  public subscribe(channel: string, handler: SubscriptionHandler) {
    this.pubSub[channel] = this.pubSub[channel] || [];

    this.pubSub[channel].push(handler);
  }

  public publish(channel: string, data: any) {
    this.pubSub[channel].forEach((handler) => handler(data));
  }

  public static getInstance() {
    if (!PubSub.instance) {
      PubSub.instance = new PubSub();
    }

    return PubSub.instance;
  }
}

export default PubSub;
