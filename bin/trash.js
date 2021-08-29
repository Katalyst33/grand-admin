class One {
  name = "John";
  static public = "John";

  changeName(name) {
    this.name = name;
    console.log(`class one ${this.name}`);
  }
}

class Two extends One {
  email = "";

  setEmail(email) {
    this.email = email;
  }
}
console.log(One.public);
const one = new One();
const two = new Two();
console.log(one);
console.log(two);
one.public;

one.changeName("keneddy");
two.changeName("austin");

console.log(one);
console.log(two);
