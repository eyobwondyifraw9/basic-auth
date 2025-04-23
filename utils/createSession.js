const uap = require("ua-parser-js");
const Session = require("../models/Session");
const { maxmindReader } = require("./initMaxmind");
const { generateRefreshToken } = require("./token");

async function getUserLocation(req) {
  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.connection.remoteAddress ||
    req.ip;
  const LOCAL_IPS = ["127.0.0.1", "::1"];

  if (!ip || LOCAL_IPS.includes(ip)) {
    return {
      ip,
      region: "Local",
      country: "Local",
      city: "Localhost",
      lat: 0,
      lon: 0,
      source: "local",
    };
  }

  try {
    const location = await fetch(
      `https://ipinfo.io/${ip}?token=df295d165d0112`
    );
    const data = await location.json();
    const [lat, lon] = data.loc.split(",");

    return {
      ip: data?.ip || ip,
      city: data?.city,
      region: data?.region,
      country: data?.country,
      lat: parseFloat(lat),
      lon: parseFloat(lon),
      org: data?.org,
      timezone: data?.timezone,
      source: "ip.info",
    };
  } catch (err) {
    console.log("Ip.info failed, falling back to local database lookup", err);
  }

  if (!maxmindReader) {
    console.warn("MaxMind DB not initialized");
    return null;
  }

  const data = maxmindReader.get(ip);
  if (!data) return null;

  return {
    ip,
    city: data.city?.names?.en,
    region: data.subdivisions?.[0]?.names?.en,
    country: data.country?.iso_code,
    lat: data.location?.latitude,
    lon: data.location?.longitude,
    timezone: data.location?.time_zone,
    source: "maxmind",
  };
}

module.exports = async (user, req) => {
  const userAgent = uap(req.headers["user-agent"]);
  const address = await getUserLocation(req);

  const MAX_SESSIONS = 5;

  const oldestSessions = await Session.find({ userId: user._id })
    .sort({ createdAt: 1 }) // Oldest first
    .skip(MAX_SESSIONS); // Skip allowed sessions, keep only excess

  // Delete them
  if (oldestSessions.length > 0) {
    await Session.deleteMany({
      _id: { $in: oldestSessions.map((s) => s._id) },
    });
  }

  console.log("code", req.body.code);

  const session = new Session({
    userId: user._id,
    userAgent: userAgent.ua,
    ip: address?.ip,
    address,
    device: {
      browser:
        userAgent.browser?.name &&
        `${userAgent.browser.name} ${userAgent.browser.version}`,
      os: userAgent.os?.name && `${userAgent.os.name} ${userAgent.os.version}`,
      model: userAgent.device?.model || userAgent.device?.vendor,
      type: userAgent.device?.type,
      cpu: userAgent.cpu?.architecture,
    },
  });

  const refreshToken = generateRefreshToken(user, session);

  if (address?.lat && address?.lon) {
    session.location = {
      type: "Point",
      coordinates: [address.lon, address.lat],
    };
  }

  session.refreshToken = refreshToken;
  await session.save();

  return { session, refreshToken };
};
