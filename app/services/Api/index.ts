import { TIMEOUT, endpoints } from "./config";
import { create } from "apisauce";
import { CreateVehicleByVin, GetVehicle, GetEvccId } from "./types";

const api = create({
  baseURL: endpoints.upower,
  timeout: TIMEOUT,
});

const createVehicleByVin = async (vin: CreateVehicleByVin) => {
  try {
    // 使用VIN建立vehicle物件後，物件的location會在headers裡面
    const { headers } = await api.post("/vehicle", { vin });
    return headers;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to create vehicle");
  }
};

const getVehicle = async ({
  vehicleId,
  offset,
  limit,
}: {
  vehicleId?: string;
  offset?: number;
  limit?: number;
}): Promise<GetVehicle | number> => {
  let search;
  if (vehicleId) {
    search = {
      vehicleId,
    };
  }
  if (offset) {
    search = {
      ...search,
      offset: offset.toString(),
    };
  }
  if (limit) {
    search = {
      ...search,
      limit: limit.toString(),
    };
  }
  const searchParams = new URLSearchParams(search);
  try {
    const { data, status } = await api.get(`/vehicle?${searchParams}`);
    if (status && status >= 200 && status <= 299) {
      return data as GetVehicle;
    }
    console.log("Failed to get vehicle, status: " + status);
    return status as number;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to get vehicle");
  }
};

const getEvccId = async (vehicleId: string): Promise<GetEvccId> => {
  try {
    const { data, status } = await api.get(
      `vehicle/evccid?vehicleid=${vehicleId}`
    );
    return { data, status } as GetEvccId;
  } catch (error) {
    throw new Error("Failed to get evccId");
  }
};

const bindEvccidWithVehicle = async (
  vehicleId: string,
  evccId: string,
  identifier: string
): Promise<number> => {
  try {
    const { status } = await api.put(
      `vehicle?vehicleid=${vehicleId}&identifier=${identifier}`,
      {
        evccId,
      }
    );
    return status as number;
  } catch (error) {
    throw new Error("Failed to bind evccId");
  }
};

export { createVehicleByVin, getVehicle, getEvccId, bindEvccidWithVehicle };
