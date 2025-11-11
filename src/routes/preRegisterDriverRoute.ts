import {Router, Request, Response} from "express";
import {auth} from "../middleware/auth";
import PreRegisteredDriverModel from "../models/preRegisteredDriverModel";

const requiredFields = [
  "fullName",
  "address",
  "contactNumber",
  "email",
  "birthDate",
  "gender",
  "vehicleType",
];

const router = Router();

// Create
router.post("/", async (req: Request, res: Response) => {
  const {captcha} = req.body;
  if (!captcha) return res.status(400).json({error: "Captcha required."});

  try {
    // Verify captcha
    const verifyUrl = "https://www.google.com/recaptcha/api/siteverify";
    const params = new URLSearchParams({
      secret: process.env.RECAPTCHA_SECRET_KEY!,
      response: captcha,
    });

    const response = await fetch(verifyUrl, {
      method: "POST",
      headers: {"Content-Type": "application/x-www-form-urlencoded"},
      body: params,
    });
    const data = await response.json();

    if (!data.success)
      return res.status(400).json({error: "Captcha verification failed."});

    // Validate required fields
    for (const field of requiredFields) {
      if (!req.body[field])
        return res
          .status(400)
          .json({error: `Missing required field: ${field}`});
    }

    const {email, contactNumber} = req.body;

    const existingDriver = await PreRegisteredDriverModel.findOne({
      $or: [{email}, {contactNumber}],
    });
    if (existingDriver)
      return res.status(409).json({
        error: "A driver with this email or contact number already exists.",
      });

    const driver = await PreRegisteredDriverModel.create(req.body);
    return res.status(201).json(driver);
  } catch (err: any) {
    console.error("Error during registration:", err);
    return res.status(500).json({error: "Internal server error."});
  }
});

// Read all
router.get("/", auth, async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  try {
    const [drivers, total, vehicleCountsAgg] = await Promise.all([
      PreRegisteredDriverModel.find()
        .skip(skip)
        .limit(limit)
        .sort({createdAt: -1}),
      PreRegisteredDriverModel.countDocuments(),
      PreRegisteredDriverModel.aggregate([
        {
          $group: {
            _id: "$vehicleType", // assumes your field is named vehicleType
            count: {$sum: 1},
          },
        },
      ]),
    ]);

    // Convert to object
    const vehicleCounts = vehicleCountsAgg.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {} as Record<string, number>);

    res.json({
      data: drivers,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      vehicleCounts,
    });
  } catch {
    res.status(500).json({error: "Server error"});
  }
});

// Read one
router.get("/:id", auth, async (req: Request, res: Response) => {
  try {
    const driver = await PreRegisteredDriverModel.findById(req.params.id);
    if (!driver) return res.status(404).json({error: "Not found"});
    res.json(driver);
  } catch {
    res.status(400).json({error: "Invalid ID"});
  }
});

// Read one by name
router.get("/search/:name", auth, async (req: Request, res: Response) => {
  try {
    const {name} = req.params;
    if (!name) return res.status(400).json({error: "Name params required"});

    const driver = await PreRegisteredDriverModel.findOne({
      name: {$regex: new RegExp(name as string, "i")},
    });
    if (!driver) return res.status(404).json({error: "Driver not found"});

    res.json(driver);
  } catch (error) {
    console.error(error);
    res.status(500).json({error: "Server error"});
  }
});

// Update
router.put("/:id", auth, async (req: Request, res: Response) => {
  try {
    const driver = await PreRegisteredDriverModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {new: true}
    );
    if (!driver) return res.status(404).json({error: "Not found"});
    res.json(driver);
  } catch {
    res.status(400).json({error: "Invalid ID"});
  }
});

// Delete
router.delete("/:id", auth, async (req: Request, res: Response) => {
  try {
    const driver = await PreRegisteredDriverModel.findByIdAndDelete(
      req.params.id
    );
    if (!driver) return res.status(404).json({error: "Not found"});
    res.json({message: "Deleted"});
  } catch {
    res.status(400).json({error: "Invalid ID"});
  }
});

export default router;
