const fs = require("fs");

function decodeValue(base, value) {
  return parseInt(value, base);
}

function lagrangeInterpolation(points) {
  const n = points.length;

  function basisPolynomial(x, i) {
    const xi = points[i][0];
    let result = 1;
    for (let j = 0; j < n; j++) {
      if (i !== j) {
        const xj = points[j][0];
        result *= (x - xj) / (xi - xj);
      }
    }
    return result;
  }

  let c = 0;
  for (let i = 0; i < n; i++) {
    const yi = points[i][1];
    c += yi * basisPolynomial(0, i);
  }
  return Math.round(c);
}

function findConstantTerm(inputFile) {
  const data = JSON.parse(fs.readFileSync(inputFile, "utf8"));
  const keys = data.keys;
  const n = keys.n;
  const k = keys.k;

  if (n < k) {
    throw new Error(
      "Number of roots provided must be greater than or equal to k."
    );
  }

  const points = [];
  for (const key in data) {
    if (!isNaN(parseInt(key))) {
      const x = parseInt(key);
      const base = parseInt(data[key].base);
      const y = decodeValue(base, data[key].value);
      points.push([x, y]);
    }
  }

  const selectedPoints = points.slice(0, k);
  return lagrangeInterpolation(selectedPoints);
}

try {
  const constantTerm1 = findConstantTerm("tc1.json");
  console.log(`Secret (Test Case 1): ${constantTerm1}`);

  const constantTerm2 = findConstantTerm("tc2.json");
  console.log(`Secret (Test Case 2): ${constantTerm2}`);
} catch (error) {
  console.error(`Error: ${error.message}`);
}
