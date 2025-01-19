const mongoose = require("mongoose");

const UserInfoSchema = new mongoose.Schema(
  {
    _user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    bankName: { type: String, required: true },
    accountNo: { type: String, required: true },
    sortCode: { type: String, required: true },
    passportNo: { type: String, required: true, lowercase: true },
    licenceNo: { type: String, lowercase: true },
    nINo: { type: String, required: true, lowercase: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserInfo", UserInfoSchema);
