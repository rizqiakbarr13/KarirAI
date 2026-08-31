declare module "midtrans-client" {
  interface TransactionParams {
    transaction_details: {
      order_id: string;
      gross_amount: number;
    };
    customer_details?: {
      first_name?: string;
      email?: string;
    };
    [key: string]: unknown;
  }

  interface SnapTransaction {
    token: string;
    redirect_url: string;
  }

  export class Snap {
    constructor(options: { isProduction: boolean; serverKey: string; clientKey: string });
    createTransaction(params: TransactionParams): Promise<SnapTransaction>;
  }

  export class CoreApi {
    constructor(options: { isProduction: boolean; serverKey: string; clientKey: string });
    transaction: {
      notification(payload: unknown): Promise<Record<string, unknown>>;
      status(orderId: string): Promise<Record<string, unknown>>;
    };
  }
}
