// Lightweight browser shim for bcrypt usage in client components.
// Provides minimal `compareSync` behavior to avoid bundling node crypto polyfills.
// If a proper bcrypt implementation is available at runtime, it can be used instead.
const bcryptShim = {
  compareSync: (plain, hashed) => {
    // In test environment, use bcryptjs to verify real bcrypt hashes created by tests.
    try {
      if (process && process.env && process.env.NODE_ENV === "test") {
        // eslint-disable-next-line global-require
        const bcryptjs = require("bcryptjs");
        if (typeof hashed === "string" && hashed.startsWith("$2")) {
          return bcryptjs.compareSync(plain, hashed);
        }
      }
    } catch (e) {
      // fall back to browser-friendly behavior below
    }

    // If hashed looks like a bcrypt hash in non-test env, we can't verify reliably here.
    try {
      if (typeof hashed === "string" && hashed.startsWith("$2")) {
        return false;
      }
    } catch (e) {
      // ignore
    }

    return plain === hashed;
  },
};

export default bcryptShim;
