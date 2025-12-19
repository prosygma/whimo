import type { AccountInfo, UserResponse } from '../../../api/types/userTypes.ts';
import { GadgetTypeEnum } from '../../../api/schemas/userSchema.ts';
import type { VerificationType } from '../Info.tsx';

type ExtractedProfileData = {
  form: Partial<AccountInfo>;
  verificationStatus: Partial<Record<VerificationType, boolean>>;
  removeOnVerificationsSuccess: Partial<Record<VerificationType, string>>;
};

export type ExtractProfileData = (userData: UserResponse) => ExtractedProfileData;

export const extractProfileData: ExtractProfileData = (userData) => {
  return userData.gadgets.reduce<ExtractedProfileData>(
    (acc, item) => {
      if (acc.form?.[item.type] && acc.verificationStatus?.[item.type] === false) {
        if (item.is_verified) {
          acc.removeOnVerificationsSuccess[item.type] = item.identifier;
        }
        return acc;
      }

      let identifier = item.identifier;

      if (item.type === GadgetTypeEnum.PHONE) {
        identifier = `+${identifier}`;
      }

      acc.form[item.type] = identifier;
      acc.verificationStatus[item.type] = item.is_verified;

      return acc;
    },
    { form: { user_id: userData.id }, verificationStatus: {}, removeOnVerificationsSuccess: {} },
  );
};
