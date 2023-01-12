import { ReactNode } from "react";

export function numsToArabicNums(input: number): ReactNode {
  const arabicNums = [
    <>&#1632;</>,
    <>&#1633;</>,
    <>&#1634;</>,
    <>&#1635;</>,
    <>&#1636;</>,
    <>&#1637;</>,
    <>&#1638;</>,
    <>&#1639;</>,
    <>&#1640;</>,
    <>&#1641;</>,
  ];

  const nums = input.toString().split("");
  const arabicNumsArr = nums.map((num) => arabicNums[parseInt(num)]);
  return arabicNumsArr;
}
