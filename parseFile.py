import sys

# print(sys.argv)

if len(sys.argv) != 2:
    print('Err: 1 argument required (target filename)')
    exit()
else:
    print(sys.argv[1])

f = open(sys.argv[1], 'r')
# print(f.read())

obj = {}

for line in f:
    if line[0] == '[':
        print(line)

# for arg in sys.argv:


# print('parse!')

