package main

import (
	"aoc/2021/utils"
	"fmt"
)

// INPUTS
var depths = utils.ParseInts(utils.ReadInput("./../inputs/day-01.txt", "\n"))

// PART 1 & 2

// countIncreases iterates through an array of integers and groups them into
// slices of size windowSize, summing them. It then compares these sums and
// returns the number of increasing sums (i.e. i < i + 1). For windowSize = 1,
// this is equivalent to comparing individual numbers
func countIncreases(depths []int, windowSize int) int {
	// Two consecutive windows contain windowSize - 1 of the same numbers. E.g., for windowSize = 3:
	// x1 x2 x3 x4
	// A  A  A
	//    B  B  B
	// Therefore, x2 + x3 + x4 > x1 + x2 + x3 if and only if x4 > x1
	count := 0
	for i, num := range depths[windowSize:] {
		if num > depths[i] {
			count++
		}
	}
	return count
}

func main() {
	fmt.Printf("Part 1: %d \n", countIncreases(depths, 1))
	fmt.Printf("Part 2: %d \n", countIncreases(depths, 3))
}
