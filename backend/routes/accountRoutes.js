// Fund an account (simulate deposit)
router.post("/:id/fund", authMiddleware, async (req, res) => {
  try {
    const { amount } = req.body;
    const amt = Number(amount);

    if (!amt || amt <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const acc = await Account.findOne({ _id: req.params.id, user: req.user.id });
    if (!acc) return res.status(404).json({ message: "Account not found" });

    acc.balance += amt;
    await acc.save();

    res.json({ message: "Account funded", account: acc });
  } catch (err) {
    res.status(500).json({ message: "Failed to fund account" });
  }
});
