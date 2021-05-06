import sys
import random
import time
import math
random.seed(time.time())
k = int(sys.argv[1]);
for i in range(k):
    x = [random.normalvariate(0,5),random.normalvariate(0,5),random.normalvariate(0,5)]
    m = math.sqrt(x[0]**2 + x[1]**2 + x[2]**2)/5
    x[0] /= m
    x[1] /= m
    x[2] /= m    
    print(f'{x[0]},{x[1]},{x[2]}')