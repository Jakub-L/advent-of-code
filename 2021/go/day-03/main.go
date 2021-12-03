package main

import (
	"aoc/2021/utils"
	"fmt"
	"strconv"
	"strings"
)

// INPUTS
var diagnostics = utils.ReadInput("./../inputs/day-03.txt", "\n")
var test = []string{"00100",
	"11110",
	"10110",
	"10111",
	"10101",
	"01111",
	"00111",
	"11100",
	"10000",
	"11001",
	"00010",
	"01010"}

// UTILS

// Find the string representation of most common bits
func gamma(diags []string) string {
	counts := []int{}
	var gamma strings.Builder
	for _, number := range diags {
		for i, digit := range number {
			if len(counts) <= i {
				counts = append(counts, 0)
			} else {
				n, _ := strconv.Atoi(string(digit))
				counts[i] += n
			}
		}
	}
	for _, count := range counts {
		if count >= len(diags)/2 {
			gamma.WriteString("1")
		} else {
			gamma.WriteString("0")
		}
	}

	return gamma.String()
}

func filterBitCriteria(diags []string, leastCommon bool) string {
	filtered := make([]string, len(diags))
	copy(filtered, diags)
	for i := 0; i < len(diags[0]); i++ {
		g := gamma(filtered)
		temp := []string{}
		for _, num := range filtered {
			if g[i] == num[i] && !leastCommon {
				temp = append(temp, num)
			} else if g[i] != num[i] && leastCommon {
				temp = append(temp, num)
			}
		}
		filtered = temp
	}
	return ""
}

// PART 1
// Find the power consumption of a submarine
func findPowerConsumption(diags []string) int64 {
	strGamma := gamma(diags)
	strInverter := strings.Repeat("1", len(strGamma))
	g, _ := strconv.ParseInt(strGamma, 2, 16)
	i, _ := strconv.ParseInt(strInverter, 2, 16)
	return g * (g ^ i)
}

func main() {
	// fmt.Printf("Part 1: %d \n", findPowerConsumption(diagnostics))
	// fmt.Printf("Part 2: %d \n", findPowerConsumption(diagnostics))
	filterBitCriteria(test, false)
	filterBitCriteria(test, true)
}
