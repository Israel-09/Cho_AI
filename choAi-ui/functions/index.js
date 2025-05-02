const createAccount = require("./src/createAccount");
const getGreeting = require("./src/getGreeting");
const getBotResponse = require("./src/getBotResponse");
const {
  getConversations,
  createConversation,
  getConversation,
} = require("./src/manageConversation");
const deleteAllConversations = require("./src/deleteConversations");
const deleteUserAccount = require("./src/deleteAccount");

exports.createAccount = createAccount.createUserAndProfile;
exports.getGreeting = getGreeting.getGreeting;
exports.getBotResponse = getBotResponse.getBotResponse;
exports.getConversations = getConversations;
exports.createConversation = createConversation;
exports.getConversation = getConversation;
exports.deleteAllConversations = deleteAllConversations.deleteAllConversations;
exports.deleteUserAccount = deleteUserAccount.deleteUserAccount;
