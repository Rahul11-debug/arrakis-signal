export const allowedTransitions = {
  submitted: ['assigned'],
  assigned: ['in-progress'],
  'in-progress': ['resolved'],
  resolved: ['closed'],
  closed: [],
};
