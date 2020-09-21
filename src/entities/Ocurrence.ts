/* eslint-disable camelcase */
export interface Ocurrence {
  _id: string;
  description: string;
  zip_code: string;
  latitude: number;
  longitutde: number;
  city: string;
  neighborhood: string;
  street: string;
  number: number;
  complement: string;
  anonymous: boolean;
  user_id: string;
  type: string;
  ocurred_at: number;
  user_name?: string;
}
