const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
// const AppError = require('../utils/appError');
const factory = require('./handlerFactory');
const { async } = require('regenerator-runtime');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // Get the currently booked tour
  const tour = await Tour.findById(req.params.tourId);

  // Create checkout session

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/my-tours`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${tour.name} Tour`,
            description: tour.summary,
            images: [
              `${req.protocol}://${req.get('host')}/img/tours/tour-6-cover.jpg`,
            ],
          },
          unit_amount: tour.price * 100,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
  });

  //Create session as response
  res.status(200).json({
    status: 'success',
    session,
  });
});

const createBookingCheckout = async (session) => {
  const tour = session.client_reference_id;
  const user = (await User.find({ email: session.customer_email })).id;
  const price = session.line_items[0].unit_amount / 100;
  await Booking.create({ tour, user, price });
};

exports.webhookCheckout = catchAsync(async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_ENDPOINT_SECRET
    );
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const checkoutSessionCompleted = event.data.object;
      // Then define and call a function to handle the event checkout.session.completed
      createBookingCheckout(checkoutSessionCompleted);
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 res to acknowledge receipt of the event
  res.status(200).send();
});

exports.createBooking = factory.createOne(Booking);
exports.getAllBooking = factory.getAll(Booking);
exports.getBooking = factory.getOne(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
