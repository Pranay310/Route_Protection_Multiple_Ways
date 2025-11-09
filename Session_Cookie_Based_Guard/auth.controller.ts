// src/auth/auth.controller.ts

@Post('login')
async login(@Req() req, @Body() body) {
  const { email, password } = body;

  // Validate user logic...
  const user = await this.authService.validateUser(email, password);

  if (!user) {
    throw new UnauthorizedException('Invalid credentials');
  }

  // Store user identity inside session
  req.session.userId = user.id;

  return { message: 'Login successful' };
}
