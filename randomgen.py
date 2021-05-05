import sys
import random
import time
random.seed(time.time())
k = int(sys.argv[1]);
for i in range(k):
    print(f'{random.normalvariate(0,5)},{random.normalvariate(0,5)},{random.normalvariate(0,5)}')