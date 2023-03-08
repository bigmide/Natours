/* eslint-disable */

import axios from 'axios';
import { showAlert } from './alert';

const stripe = Stripe(
  'pk_test_51MifAzKq2KQrOs2gYXh8043X4Qhm7kl3dUp6pd7t4EzdbBqcuyNNyu0dUAq7r4VF5uHQvVYnIWKKfzbiIYRjq4NJ00kXo4Awab'
);

export const bookTour = async (tourId) => {
  try {
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    // console.log(session);
    location.assign(session.data.session.url);
  } catch (err) {
    showAlert('error', err);
  }
};
