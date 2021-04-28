import sys
import random
import time
random.seed(time.time())
k = int(sys.argv[1]);
for i in range(k):
    print(f'{random.uniform(-21,21)},{random.uniform(-21,21)},{random.uniform(-21,21)}')