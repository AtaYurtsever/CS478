import sys
import random
import math
import time

random.seed(time.time())

k = int(sys.argv[1])
h = int(sys.argv[2])
notOnHull = k - h

for i in range(notOnHull):
    print(f'{random.normalvariate(0,2)},{random.normalvariate(0,2)},{random.normalvariate(0,2)}')

for i in range(h): 
    x = [random.normalvariate(0,5),random.normalvariate(0,5),random.normalvariate(0,5)]
    m = math.sqrt(x[0]**2 + x[1]**2 + x[2]**2)/15
    x[0] /= m
    x[1] /= m
    x[2] /= m    
    print(f'{x[0]},{x[1]},{x[2]}')
