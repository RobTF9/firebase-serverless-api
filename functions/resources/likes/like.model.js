exports.notifcationModel = (recipient, sender, type, workoutId) => ({
  createdAt: new Date().toISOString(),
  recipient,
  sender,
  type,
  read: false,
  workoutId,
});
