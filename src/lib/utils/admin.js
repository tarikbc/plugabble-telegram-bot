const adminIds = []; // [userID]

const notifyAdmins = (bot, txt) =>
  adminIds.forEach(id =>
    bot.sentMessage(id, txt, { parsed_mode: 'Markdown' }));

const isAdmin = userId => adminIds.indexOf(userId) >= 0;

export {
  notifyAdmins,
  isAdmin };
