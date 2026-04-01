export function asyncHandler(handler) {
  return function wrappedHandler(req, res, next) {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

export function respondWithError(res, error, fallbackMessage = "Request failed.") {
  if (error?.code === "23505") {
    return res.status(409).json({ error: "A record with the same unique value already exists." });
  }

  if (error?.code === "23503") {
    return res.status(400).json({ error: "This record references related data that does not exist." });
  }

  if (error?.code === "22P02") {
    return res.status(400).json({ error: "One of the provided values has an invalid format." });
  }

  return res.status(500).json({ error: fallbackMessage });
}
