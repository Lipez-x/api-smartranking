export interface UpdatePlayerPayload {
  id: string;
  updatePlayerDto: {
    urlImagePlayer: string;
    categoryId: string;
    phoneNumber: string;
    name: string;
  };
}
