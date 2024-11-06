export interface UpdatePlayerPayload {
  id: string;
  updatePlayerDto: {
    categoryId: string;
    phoneNumber: string;
    name: string;
  };
}
