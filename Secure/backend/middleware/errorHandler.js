export function notFoundHandler(_req, res) {
  res.status(404).json({ error: "Not found" });
}

export function errorHandler(error, _req, res, _next) {
  const status =
    Number.isInteger(error?.status) && error.status >= 400 && error.status <= 599
      ? error.status
      : Number.isInteger(error?.statusCode) &&
          error.statusCode >= 400 &&
          error.statusCode <= 599
        ? error.statusCode
        : 500;

  if (status >= 500) {
    console.error("Unhandled server error:", error?.message || error?.name || "Error");
  }

  let message = error?.message || "Request failed";
  if (status >= 500) {
    message = "Internal server error";
  } else if (error?.type === "entity.too.large") {
    message = "Request body too large";
  } else if (error?.type === "entity.parse.failed") {
    message = "Invalid JSON body";
  }

  res.status(status).json({ error: message });
}
