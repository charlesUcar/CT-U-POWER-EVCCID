interface VinValidator {
  checkVinValid: (vin: string) => boolean;
}

const useVinValidator = (): VinValidator => {
  const weightedArr: number[] = [
    8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2,
  ];

  const checkVinValid = (VIN: string): boolean => {
    let multipliedEachVinWithWeightedSum: number = 0;
    for (let i = 0; i < 17; i++) {
      switch (VIN[i]) {
        case "0":
          multipliedEachVinWithWeightedSum += 0;
          break;

        case "1":
        case "A":
        case "J":
          multipliedEachVinWithWeightedSum += weightedArr[i];
          break;

        case "2":
        case "B":
        case "K":
        case "S":
          multipliedEachVinWithWeightedSum += weightedArr[i] * 2;
          break;

        case "3":
        case "C":
        case "L":
        case "T":
          multipliedEachVinWithWeightedSum += weightedArr[i] * 3;
          break;

        case "4":
        case "D":
        case "M":
        case "U":
          multipliedEachVinWithWeightedSum += weightedArr[i] * 4;
          break;

        case "5":
        case "E":
        case "N":
        case "V":
          multipliedEachVinWithWeightedSum += weightedArr[i] * 5;
          break;

        case "6":
        case "F":
        case "W":
          multipliedEachVinWithWeightedSum += weightedArr[i] * 6;
          break;

        case "7":
        case "G":
        case "P":
        case "X":
          multipliedEachVinWithWeightedSum += weightedArr[i] * 7;
          break;

        case "8":
        case "H":
        case "Y":
          multipliedEachVinWithWeightedSum += weightedArr[i] * 8;
          break;

        case "9":
        case "R":
        case "Z":
          multipliedEachVinWithWeightedSum += weightedArr[i] * 9;
          break;
      }
    }

    const vinCheckCode: number = multipliedEachVinWithWeightedSum % 11;
    if ((VIN[8] === "X" ? 10 : Number(VIN[8])) !== vinCheckCode) return false;
    return true;
  };

  return { checkVinValid };
};

export default useVinValidator;
