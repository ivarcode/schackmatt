import sys
import json

# Currently, this file only works for lichess study CHAPTERS.  Once we break
# from the first [bracketed] details, the rest is treated as PGN code. I
# intend to create a second file, or possibly update this file with arguments
# and subroutines to handle a multi-chapter lichess file.

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

outObj = {
    'lichessData': outObj
}

# This should be an argument
filename = sys.argv[2]
with open(filename, 'w') as outfile:
    json.dump(outObj, outfile)

print('Written to "' + filename + '" the following JSON object:\n')
# print(outObj)
print('\nSuccess.')
