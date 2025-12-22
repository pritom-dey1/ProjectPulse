export function allowRoles(user, roles) {
  if (!user || !roles.includes(user.role)) {
    throw new Error('Forbidden')
  }
}
