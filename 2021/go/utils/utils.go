package utils

import (
	"io/ioutil"
	"strconv"
	"strings"
)

// Reads a file located at the input path and splits it by delimiter
// into an array of strings.
func ReadInput(path string, delimiter string) []string {
	bytes, _ := ioutil.ReadFile(path)
	return strings.Split(string(bytes), delimiter)
}

// Parses an array of strings into an array of ints
func ParseInts(strArr []string) []int {
	var integers []int
	for _, str := range strArr {
		parsedStr, _ := strconv.Atoi(str)
		integers = append(integers, parsedStr)
	}
	return integers
}
