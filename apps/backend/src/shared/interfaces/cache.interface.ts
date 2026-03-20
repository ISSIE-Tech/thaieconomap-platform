import { PumpuangLocationDto } from '../../modules/pumpuangs/dto';

export interface IOtpCache {
  token: string;
  expiredAt: string;
  refno: string;
}

export interface IPumpuangLocationCache {
  current: PumpuangLocationDto;
  history: string[][];
}

export interface IPendingPumpuangSessionCache {
  tempId: string;
  hashedSessionId: string;
  deviceId: string;
}
