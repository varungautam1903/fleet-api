const mongoose = require("mongoose");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    driverId: { type: String, required: true },
    displayName: { type: String },
    firstName: { type: String, required: true, lowercase: true },
    middleName: { type: String, lowercase: true },
    lastName: { type: String, required: true, lowercase: true },
    userName: { type: String, lowercase: true, unique: true },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      required: true,
      index: true,
      unique: true,
    },
    password: { type: String, required: true },
    salt: String,
    role: {
      type: String,
      enum: ["user", "admin", "manager", "accountant"],
      default: "user",
    },
    address: { type: String, required: true },
    postCode: { type: String, required: true },
    dob: { type: String, required: true },
    phoneNo: { type: String, required: true },
    addPhoneNo: { type: String, required: true },
    isActive: { type: Boolean, require: true, default: false }
  },
  { timestamps: true }
);

/**
 * Pre-save hooks
 */

// On every save update the display name
UserSchema.pre("save", function (next) {
  this.displayName = `${this.firstName} ${this.middleName} ${this.lastName}`;
  this.userName = `${this.firstName}${this.phoneNo.slice(-4)}`
  next();
});

// Create encrypted password
UserSchema.pre("save", async function (next) {
  if (!this || !this.isModified("password")) {
    next();
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/**
 * Methods
 */
UserSchema.methods = {
  /**
   * Check if the unencrypted password matches the saved encyrpted password
   * @param  {String} Unencrypted password
   * @param  {Function} Callback(error, Boolean)
   */
  authenticate(password, callback) {
    this.encryptPassword(password, (err, encryptedPassword) => {
      if (encryptedPassword === this.password) {
        callback(null, true);
      } else {
        callback(new Error("Incorrect password"), false);
      }
    });
  },

  async matchPassword(password) {
    return await bcrypt.compare(password, this.password);
  },

  /**
   * Encrypt a password
   * @param  {String} Unencrypted password
   * @param  {Function} Callback(error, encryptedPassword)
   */
  encryptPassword(password, callback) {
    const salt = this.salt;
    const defaultIterations = 10000;
    const defaultKeyLength = 64;
    const saltBase64 = new Buffer(salt, ["base64"]);
    const digest = "sha512";

    crypto.pbkdf2(
      password,
      saltBase64,
      defaultIterations,
      defaultKeyLength,
      digest,
      (err, key) => {
        if (err) {
          callback(err);
        }

        callback(null, key.toString("base64"));
      }
    );
  },

  /**
   * Generate a salt string
   * @param  {Function} Callback(error, salt)
   */
  generateSalt(callback) {
    const byteSize = 16;
    crypto.randomBytes(byteSize, (err, salt) => {
      if (err) {
        callback(err);
      }

      callback(null, salt.toString("base64"));
    });
  },
};

module.exports = mongoose.model("User", UserSchema);
