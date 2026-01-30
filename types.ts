
export interface ProductType {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface MockupResult {
  id: string;
  productId: string;
  imageUrl: string;
  prompt: string;
  timestamp: number;
}

export enum AppStatus {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING',
  GENERATING = 'GENERATING',
  EDITING = 'EDITING',
  ERROR = 'ERROR'
}
