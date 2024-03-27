import { TIMEOUT, endpoints } from "./config";
import { create } from "apisauce";
import { CreateVehicleByVin, GetVehicleResponseBody, GetEvccId } from "./types";
import crashlytics from "@react-native-firebase/crashlytics";

const api = create({
  baseURL: endpoints.upower,
  timeout: TIMEOUT,
});

const createVehicleByVin = async (vin: CreateVehicleByVin) => {
  try {
    // 使用VIN建立vehicle物件後，物件的location url會在headers裡面
    const { headers } = await api.post("/vehicle", { vin });
    crashlytics().log('created vehicle by vin');
    return headers;
  } catch (error) {
    console.log(error);
    crashlytics().log('created vehicle by vin fail');
    throw new Error("Failed to create vehicle");
  }
};

type GetVehicleParams = {
  vehicleId?: string;
  offset?: string;
  limit?: string;
  startTime?: string;
  endTime?: string;
};

const getVehicle = async ({
  vehicleId,
  offset,
  limit,
  startTime,
  endTime,
}: GetVehicleParams): Promise<GetVehicleResponseBody | any> => {
  let search: GetVehicleParams = {};
  if (vehicleId) {
    search = {
      ...search,
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
  if (startTime) {
    search = {
      ...search,
      startTime,
    };
  }
  if (endTime) {
    search = {
      ...search,
      endTime,
    };
  }
  const searchParams = new URLSearchParams(search);
  try {
    const result = await api.get(`/vehicle?${searchParams}`);
    crashlytics().log('get vehicle by params');
    return result;
    // if (result.status && result.status >= 200 && result.status <= 299) {
    //   return { data, headers };
    // }
    // console.log("Failed to get vehicle, status: " + result.status);
    // return false
  } catch (error) {
    console.log(error);
    crashlytics().log('failed to get vehicle by params');
    throw new Error("Failed to get vehicle by params");
  }
};

const getEvccId = async (vehicleId: string): Promise<GetEvccId> => {
  try {
    const { data, status } = await api.get(
      `vehicle/evccid?vehicleid=${vehicleId}`
    );
    crashlytics().log('get evccId');
    return { data, status } as GetEvccId;
  } catch (error) {
    crashlytics().log('failed to get evccId');
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
    crashlytics().log('binding evccid with vehicle');
    return status as number;
  } catch (error) {
    crashlytics().log('failed to binding evccid with vehicle');
    throw new Error("Failed to bind evccId");
  }
};

export { createVehicleByVin, getVehicle, getEvccId, bindEvccidWithVehicle };
