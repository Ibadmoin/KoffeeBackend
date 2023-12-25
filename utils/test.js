const term = "Caramel Syrups";
const regex = new RegExp(`${term.replace(/\s+$/, '')}(s)?`, "i");
const testString1 = 'Caramel syrup';
const testString2 = 'Caramel syrups';

// Remove trailing "s" if present
const searchTerm = term.replace(/\s+$/, '');
const regexWithOptionalS = new RegExp(`${searchTerm}(s)?`, "i");

console.log(regexWithOptionalS.test(testString1));  // Should be true
console.log(regexWithOptionalS.test(testString2));  // Should be true
