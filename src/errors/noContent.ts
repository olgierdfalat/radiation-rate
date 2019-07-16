export class NoContent extends Error {
  constructor(message?: string) {
      super(message || 'No content'); // 'Error' breaks prototype chain here
      Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
  }
}