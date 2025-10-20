import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'apisauce';
import { TIMEOUT, endpoints } from './config';
import {
  BindEvccidWithVehicle,
  ChangePasswordPayload,
  CreateVehicleByVinParams,
  GetEvccId,
  GetVehicleParams,
  GetVehicleResponseBody,
  LoginPayLoad,
} from './types';

const api = create({
  baseURL: endpoints.upower,
  timeout: TIMEOUT,
});

let userToken: string = '';

// 添加一個 request 攔截器，在每個請求中添加 Token 到 headers 中
api.addRequestTransform((request) => {
  request.headers = request.headers || {};
  request.headers['Authorization'] = `Bearer ${userToken}`;
});

const setUserApiToken = (token: string) => {
  userToken = token;
};

const login = async (payload: LoginPayLoad) => {
  try {
    const response = await api.post('/user/login', payload);

    if (response.ok && (response.data as any).status) {
      // 登入成功
      // 設定全域token
      setUserApiToken((response.data as any).token.token as string);

      // 將Token與userName存到手機
      try {
        await AsyncStorage.setItem('token', userToken);
        await AsyncStorage.setItem('userName', payload.username);
      } catch (error) {
        console.error('fail to store token and userName in device:', error);
      }

      return { success: true, data: response.data, status: response.status };
    } else {
      // 登入失敗，返回一個通用的錯誤訊息
      return { success: false, error: 'Unexpected Error' };
    }
  } catch (error) {
    // 處理其他錯誤，例如網絡連接問題等
    console.error('Failed to login:', error);
    throw new Error('Failed to login');
  }
};

const changePassword = async (payload: ChangePasswordPayload) => {
  try {
    const response = await api.patch('/user/password', payload);

    if (response.ok) {
      // 修改成功
      return { success: true, data: response.data, status: response.status };
    } else {
      // 修改失敗，返回一個通用的錯誤訊息
      return { success: false, error: response.problem };
    }
  } catch (error) {
    // 處理其他錯誤，例如網絡連接問題等
    console.error('Failed to changePassword:', error);
    throw new Error('Failed to changePassword');
  }
};

const createVehicleByVin = async (vin: CreateVehicleByVinParams) => {
  try {
    const response = await api.post('/vehicle', { vin });
    // 使用VIN建立vehicle物件後，物件的location url會在headers裡面
    if (response.ok) {
      return {
        success: true,
        headers: response.headers,
        status: response.status,
      };
    } else {
      // 登入失敗，返回錯誤訊息或處理其他錯誤情況
      if (response.status === 401) {
        // 如果是未授權錯誤，可能是 Token 過期或無效，需要重新登入
        return {
          success: false,
          status: response.status,
          error: 'Unauthorized',
        };
      } else {
        // 其他狀況，可能是網絡問題等，可以顯示一個通用的錯誤訊息給用戶
        return {
          success: false,
          status: response.status,
          error: 'Unexpected Error',
        };
      }
    }
  } catch (error) {
    console.log(error);
    throw new Error('Failed to create vehicle');
  }
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
    const response = await api.get(`/vehicle?${searchParams}`);
    if (response.ok && (response.data as any).data?.length > 0) {
      return {
        success: true,
        data: response.data,
        status: response.status,
        headers: response.headers,
      };
    } else {
      // 獲取資料失敗，返回錯誤訊息或處理其他錯誤情況
      if (response.status === 401) {
        // 如果是未授權錯誤，可能是 Token 過期或無效，需要重新登入
        // 將手機內的token刪掉
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('userName');
        setUserApiToken('');
        return {
          success: false,
          status: response.status,
          error: 'Unauthorized',
        };
      } else {
        // 其他狀況，可能是網絡問題等，可以顯示一個通用的錯誤訊息給用戶
        return {
          success: false,
          status: response.status,
          error: 'Unexpected Error',
        };
      }
    }
    // if (result.status && result.status >= 200 && result.status <= 299) {
    //   return { data, headers };
    // }
    // console.log("Failed to get vehicle, status: " + result.status);
    // return false
  } catch (error) {
    console.log(error);
    throw new Error('Failed to get vehicle by params');
  }
};

const getEvccId = async (vehicleId: string): Promise<GetEvccId> => {
  // try {
  //   const { data, status } = await api.get(
  //     `vehicle/evccid?vehicleid=${vehicleId}`
  //   );
  //   return { data, status } as GetEvccId;
  // } catch (error) {
  //   throw new Error('Failed to get evccId');
  // }
  try {
    const response = await api.get(`vehicle/evccid?vehicleid=${vehicleId}`);
    if (response.ok) {
      return {
        success: true,
        data: response.data as GetEvccId['data'],
        status: response.status as GetEvccId['status'],
      };
    } else {
      // 獲取資料失敗，返回錯誤訊息或處理其他錯誤情況
      if (response.status === 401) {
        // 如果是未授權錯誤，可能是 Token 過期或無效，需要重新登入
        // 將手機內的token刪掉
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('userName');
        setUserApiToken('');
        return {
          success: false,
          status: response.status,
          error: 'Unauthorized',
        };
      } else {
        // 其他狀況，可能是網絡問題等，可以顯示一個通用的錯誤訊息給用戶
        return {
          success: false,
          status: response.status as GetEvccId['status'],
          error: 'Unexpected Error' as GetEvccId['error'],
        };
      }
    }
  } catch (error) {
    throw new Error('Failed to get evccId');
  }
};

const bindEvccidWithVehicle = async (
  vehicleId: string,
  evccId: string,
  identifier: string
): Promise<BindEvccidWithVehicle> => {
  try {
    const response = await api.put(
      `vehicle?vehicleid=${vehicleId}&identifier=${identifier}`,
      {
        evccId,
      }
    );
    if (response.ok) {
      return {
        success: true,
        status: response.status as number,
      };
    } else {
      return {
        success: false,
        status: response.status as number,
      };
    }
  } catch (error) {
    throw new Error('Failed to bind evccId');
  }
};

export {
  bindEvccidWithVehicle,
  changePassword,
  createVehicleByVin,
  getEvccId,
  getVehicle,
  login,
  setUserApiToken,
};
