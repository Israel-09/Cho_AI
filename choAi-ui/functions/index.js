const createAccount = require("./src/createAccount");

const getBotResponse = require("./src/getBotResponse");
const {
  getConversations,
  createConversation,
  getConversation,
} = require("./src/manageConversation");
const deleteAllConversations = require("./src/deleteConversations");
const deleteUserAccount = require("./src/deleteAccount");
const sendContactEmail = require("./src/sendContactEmail");
const cleanup = require("./src/cleanup");

exports.createAccount = createAccount.createUserAndProfile;
exports.getBotResponse = getBotResponse.getBotResponse;
exports.getConversations = getConversations;
exports.createConversation = createConversation;
exports.getConversation = getConversation;
exports.deleteAllConversations = deleteAllConversations.deleteAllConversations;
exports.deleteUserAccount = deleteUserAccount.deleteUserAccount;
exports.sendContactEmail = sendContactEmail.sendContactEmail;
exports.cleanupEmptyConversations = cleanup.cleanupEmptyConversations;
exports.cleanupExpiredConversations = cleanup.cleanupExpiredConversations;
