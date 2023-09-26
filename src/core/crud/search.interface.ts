import { ObjectLiteral } from 'typeorm';
/**
 * Generic search params interface
 */
export interface ISearch {
  readonly take?: number;
  readonly skip?: number;
  readonly quickFilter?: string;
  readonly orderBy?: string;
  readonly orderDirection?: string;
  readonly relations?: string[];
  readonly where?: ObjectLiteral;
}

export default ISearch;
