const accessSchema = require("../schemas/accessSchema");

const rateLimiting = async (req, res, next) => {
  console.log(req.session.id);

  const sid = req.session.id;

  //check if there is an entry with this session
  try {
    const accessDb = await accessSchema.findOne({ sessionId: sid });
    console.log(accessDb);

    //if null then creates an entry, (first request)
    if (!accessDb) {
      const accessObj = new accessSchema({ sessionId: sid, time: Date.now() });
      await accessObj.save();
      next();
      return;
    }

    //compare the time difference, (R2--Rnth)

    const diff = (Date.now() - accessDb.time) / 1000; // 1hit/sec
    if (diff < 1) {
      return res.send({
        status: 400,
        message: "Too many requests, please wait for some time.",
      });
    }

    //update the time to current req
    await accessSchema.findOneAndUpdate(
      { sessionId: sid },
      { time: Date.now() }
    );
    next();
  } catch (error) {
    return res.send({
      status: 500,
      message: "Internal server error",
      error: error,
    });
  }
};

module.exports = rateLimiting;
