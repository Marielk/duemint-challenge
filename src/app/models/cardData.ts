export interface CardData {
  cardNumber: string;
  cardName: string;
  expiration: {
    expiringMonth: string;
    expiringYear: string;
  };
  cvv: string;
}
