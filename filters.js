import * as fs from "fs";
import * as fsPromises from "fs/promises";

const FILES_SM = "./files";
const FILES_LG = "./files_lg";

const readFromFile = async () => {
  let filesNamesList = [];
  let allExpressions = [];

  try {
    filesNamesList = await fsPromises.readdir(FILES_SM);

    filesNamesList.forEach((fileName) => {
      const file = fs.readFileSync(`${FILES_SM}/${fileName}`, "utf8");
      const fileExpressions = file.split("\n");

      allExpressions = [...allExpressions, [...fileExpressions]];
    });

    const startPerf = new Date().getTime();

    uniqueValues(allExpressions);
    // existInAllFiles(allExpressions);
    // existInAtLeastTen(allExpressions);

    const endPerf = new Date().getTime();

    console.log(endPerf - startPerf + "ms");
  } catch (e) {
    console.log("Error", e);
  }
};

const uniqueValues = (fullList) => {
  const uniqueList = fullList.flat();
  let watcher = new Map();
  let values = [];

  uniqueList.forEach((exp) => {
    if (watcher.has(exp)) {
      watcher.set(exp, 2);
    } else {
      watcher.set(exp, 1);
    }
  });

  for (let [key, value] of watcher.entries()) {
    value === 1 && values.push(key);
  }

  console.log(`Уникальных словосочетаний: ${values.length}`);
};

// const uniqueValues2 = (fullList) => {
//   const uniqueList = fullList.flat();
//   const values = uniqueList.filter((exp) => {
//     return uniqueList.indexOf(exp) === uniqueList.lastIndexOf(exp);
//   });

//   console.log(`Уникальных словосочетаний: ${values.length}`);
// };

const existInAllFiles = (fullList) => {
  const [baseList, ...restList] = [...fullList];

  const fullUniqueList = restList.map((list) => {
    return new Set(list);
  });

  const fullExistValues = baseList.filter((e) => fullUniqueList.every((set) => set.has(e)));
  const existValues = [...new Set(fullExistValues)];

  console.log(
    `Словосочетаний, которые есть во всех ${fullList.length} файлах: ${existValues.length}`
  );
};

// const existInAllFiles2 = (fullList) => {
//   const fullUniqueList = fullList.map((list) => {
//     return [...new Set(list)];
//   });

//   const existValues = fullUniqueList.reduce((a, b) => a.filter((c) => b.includes(c)));

//   console.log(
//     `Словосочетаний, которые есть во всех ${fullList.length} файлах: ${existValues.length}`
//   );
// };

const existInAtLeastTen = (fullList) => {
  let watcher = new Map();
  let existValues = [];
  let subList, count;

  fullList.forEach((arr) => {
    subList = [...new Set(arr)];
    
    subList.forEach((exp) => {
      count = watcher.get(exp) || 0;
      watcher.set(exp, count + 1);
    });
  });

  for (let [key, value] of watcher.entries()) {
    if (value > 9) {
      existValues.push(key);
    }
  }

  console.log(`Словосочетаний, которые есть, как минимум, в десяти файлах: ${existValues.length}`);
};

// start func
readFromFile().catch((error) => {
  console.log("Error", error);
});