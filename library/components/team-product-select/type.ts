import { ProductItemI } from "../../types/global";

export interface SelectedTeamProductI {
  team: {
    teamName: string;
    id:string;
  };
  product: ProductItemI
}