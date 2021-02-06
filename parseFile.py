import sys
import json

# Currently, this file only works for lichess study CHAPTERS.  Once we break
# from the first [bracketed] details, the rest is treated as PGN code. I
# intend to create a second file, or possibly update this file with arguments
# and subroutines to handle a multi-chapter lichess file.

if len(sys.argv) != 2:
    print('Err: 1 argument required (target filename)')
    exit()
else:
    print('Located file: ' + sys.argv[1])

f = open(sys.argv[1], 'r')
# print(f.read())

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
        # print(line)
        parseLineIntoObj(line)
    else:
        pgnContent += line

obj['pgnContent'] = pgnContent

outObj = {}
outObj['lichessData'] = obj

# This should be an argument
filename = './out.json'
with open(filename, 'w') as outfile:
    json.dump(outObj, outfile)

print('Written to "' + filename + '" the following JSON object:\n')
print(obj)
print('\nSuccess.')
