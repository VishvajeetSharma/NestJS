/**
 * WHY THIS FILE EXISTS
 * --------------------
 * Defines the shape of the data we encode into every JWT (see
 * AuthService.generateToken) and decode back out of it (see
 * JwtStrategy.validate). Sharing one interface between "encode" and
 * "decode" prevents the two sides from drifting apart.
 */
export interface JwtPayload {
  // Subject - the authenticated user's UUID.
  sub: string;
  email: string;
}
