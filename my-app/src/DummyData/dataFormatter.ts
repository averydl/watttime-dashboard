

export function timeStampStringToDate(timeStamp: string): any {
  const intEpoch: number = parseInt(timeStamp);
  const newDate: Date = new Date(intEpoch);
  return newDate.getTime();
}


export function pivotJsonTableData(timeSeriesData: any): any {
  const tempMap: Map<string, any> = new Map();
  for (const [key, value] of Object.entries(timeSeriesData.load)) {
    tempMap.set(key, new Map());
  }
  for (const [key, value] of Object.entries(timeSeriesData)) {
    const newKey: any = value;
    for (const [k, v] of Object.entries(newKey)) {
      tempMap.get(k).set(key, v);
      if (!tempMap.get(k).has('dateTime')) {
        tempMap.get(k).set('dateTime', timeStampStringToDate(k));
      }
    }
  }
  return nestedMapToJson(tempMap);
}

function nestedMapToJson(mapIn: Map<string, Map<string, any>>): any {
  const tempJson: any = {};
  const jsonArray: object[] = [];
  mapIn.forEach((value, key) => {
    let entry: any = {};
    value.forEach((innerValue, innerKey) => {
      entry[innerKey] = innerValue;
    });
    tempJson[key] = entry;
    jsonArray.push(entry);
  });
  return jsonArray.sort(compareDate);
}

function compareDate(a: any, b: any) {
  if (a.dateTime > b.dateTime) return 1;
  if (b.dateTime > a.dateTime) return -1;
  return 0;
}