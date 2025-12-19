import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import i18n from '../i18n.ts';

const handleError = (error: Error) => {
  if (error instanceof AxiosError && error.response?.data.message) {
    toast(error.response.data.message, { type: 'error', autoClose: 10000, });
  } else {
    toast(i18n.t('something_went_wrong', { ns: 'common' }), { type: 'error' });
  }
};

export default handleError;
