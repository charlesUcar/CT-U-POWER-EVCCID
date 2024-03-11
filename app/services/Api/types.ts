export type CreateVehicleByVin = {
  vin: string;
};

export type GetVehicle = {
  code: string;
  message: string;
  data: {
    vehicleId: string;
    identifier: string;
    vin: string;
    evccid: string;
    status: number;
    createdTime: string;
  }[];
};

export type GetEvccId = {
  data: {
    code: "1000";
    data: {
      evccid: "007DFA073FF8";
      identifier: "037f6500-a512-4b85-bf1e-6e36ae16a292";
    };
    message: "Success";
  };
  status: number;
};
