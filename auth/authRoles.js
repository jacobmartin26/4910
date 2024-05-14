export const authRoles = {
    sa: [3], // Only Super Admin has access
    admin: [3], // Only SA & Admin has access
    editor: [2,3], // Only SA & Admin & Editor has access
    guest: [1,2,3], // Everyone has access
}
