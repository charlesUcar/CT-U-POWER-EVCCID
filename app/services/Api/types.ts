export type ApiResponse = {
  error?: string;
  success: boolean;
  headers?: any;
  status: number;
};

export type LoginPayLoad = {
  username: string;
  password: string;
};

export type ChangePasswordPayload = {
  newPassword: string;
  oldPassword: string;
  confirmPassword: string;
};

export type Login = ApiResponse & {
  data: {
    loginId: string;
    userId: string;
    status: number;
    token: {
      token: string;
      refreshToken: string;
      expiresIn: number;
    };
  };
};

export type CreateVehicleByVinParams = {
  vin: string;
};

export type GetVehicleParams = {
  vehicleId?: string;
  offset?: string;
  limit?: string;
  startTime?: string;
  endTime?: string;
};

export type GetVehicleResponseBody = {
  code: string;
  message: string;
  data: {
    vehicleId: string;
    identifier?: string;
    vin: string;
    evccid: string;
    status: number;
    createdTime: string;
  }[];
};

export type GetEvccId = ApiResponse & {
  data?: {
    code: string;
    data: {
      evccid: string;
      identifier: string;
    };
    message: string;
  };
};

export type BindEvccidWithVehicle = ApiResponse;
