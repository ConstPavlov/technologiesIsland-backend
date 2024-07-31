export default class UserDto {
  id;
  email;
  fullName;
  role;
  isActivated;

  constructor(model) {
    this.id = model.id
    this.email = model.email
    this.fullName = model.fullName
    this.role = model.role
    this.isActivated = model.isActivated
  }
}