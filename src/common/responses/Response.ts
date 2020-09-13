export interface Response<Data = any> {
  success: boolean;

  code: number;

  message?: string;

  data?: Data;

  errors?: Record<string, string> | undefined;
}
