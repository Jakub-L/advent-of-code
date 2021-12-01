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
	var sums []int
	for i := range depths {
		if i <= len(depths)-windowSize {
			window := depths[i : i+windowSize]
			sum := 0
			for _, depth := range window {
				sum += depth
			}
			sums = append(sums, sum)
		}
	}
	count := 0
	for i := 0; i < len(sums)-1; i++ {
		if sums[i] < sums[i+1] {
			count++
		}
	}
	return count
}

func main() {
	fmt.Printf("Part 1: %d \n", countIncreases(depths, 1))
	fmt.Printf("Part 2: %d \n", countIncreases(depths, 3))
}
