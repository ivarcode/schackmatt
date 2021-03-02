import sys
import json

# Parses lichess PGN files into JSON files representing the same data

# version checking
if int(sys.version_info[0]) < 3:
    print('Err: Python3 is required for this script to properly run. Please upgrade from your version (Python ' + sys.version_info[0] + ')')
    exit()

# argument checking
if len(sys.argv) != 3:
    print('Err: 2 arguments required (<target_filepath> <output_filepath>)')
    exit()
else:
    print('Located file: ' + sys.argv[1])

f = open(sys.argv[1], 'r')
# print(f.read())

outObj = {}

eventIndex = 0
obj = {}

def parseLineIntoObj(line):
    for i in range(0, len(line)):
        if line[i] == ' ':
            spaceIndex = i
            break
    obj[line[1:spaceIndex]] = line[(spaceIndex + 2):len(line) - 3]

pgnContent = ''
for line in f:
    if line[0] == '[':
        if pgnContent != '':
            obj['pgnContent'] = pgnContent
            pgnContent = ''
            outObj[eventIndex] = obj
            eventIndex += 1
            obj = {}
        # print(line)
        parseLineIntoObj(line)
    else:
        pgnContent += line

obj['pgnContent'] = pgnContent
outObj[eventIndex] = obj
eventIndex += 1
obj = {}

# for the root object key, and for the filename, we want to grab this now
filename = sys.argv[2]
rootKeyStartIndex = 0
for i in range(0, len(filename)):
    if filename[i] == '/':
        rootKeyStartIndex = i

# assumption is that filename ends in .json
rootKey = filename[rootKeyStartIndex + 1:len(filename) - 5]

outObj = {
    rootKey: outObj
}

# This should be an argument
with open(filename, 'w') as outfile:
    json.dump(outObj, outfile)

print('Written to: ' + filename)
# print(outObj)
print('\nSuccess.')
