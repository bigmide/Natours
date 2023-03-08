/* eslint-disable */

import axios from 'axios';
import { showAlert } from './alert';

export const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'data'
        ? 'http://127.0.0.1:3000/api/v1/users/update-me'
        : 'http://127.0.0.1:3000/api/v1/users/update-my-password';
    const res = await axios({
      url,
      method: 'PATCH',
      data,
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Data Updated Successfully');
      location.reload(true);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
